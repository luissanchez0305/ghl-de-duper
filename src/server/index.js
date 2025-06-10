import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const fastify = Fastify({
  logger: true
});

// Enable CORS
await fastify.register(cors, {
  origin: true
});

// Initialize Supabase client with error handling
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required Supabase environment variables');
  process.exit(1);
}

console.log('Initializing server with Supabase configuration:', {
  hasUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceKey
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GHL API Base URL
const GHL_API_BASE = 'https://services.gohighlevel.com/v1/contacts';

// Root route
fastify.get('/', async (request, reply) => {
  console.log('Received request to root endpoint');
  return { 
    status: 'ok',
    message: 'GHL Contact De-Duper API',
    version: '1.0.0'
  };
});

// Health check route
fastify.get('/health', async (request, reply) => {
  console.log('Health check requested');
  return { status: 'ok' };
});

// OAuth token exchange route
fastify.post('/oauth/token', async (request, reply) => {
  console.log('OAuth token exchange requested:', request.body);
  const { code, locationId, redirectUri } = request.body;

  if (!code || !locationId || !redirectUri) {
    console.error('Missing required OAuth parameters:', { hasCode: !!code, hasLocationId: !!locationId, hasRedirectUri: !!redirectUri });
    return reply.status(400).send({ error: 'Missing required parameters' });
  }

  try {
    const clientId = process.env.VITE_GHL_CLIENT_ID;
    const clientSecret = process.env.VITE_GHL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing GHL OAuth configuration');
      return reply.status(500).send({ error: 'OAuth configuration error' });
    }

    console.log('Exchanging code for token with GHL');
    const tokenResponse = await fetch('https://marketplace.gohighlevel.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('GHL OAuth error:', tokenResponse.status, tokenResponse.statusText);
      const errorText = await tokenResponse.text();
      console.error('GHL OAuth error details:', errorText);
      throw new Error(`OAuth token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('OAuth token exchange successful:', { hasAccessToken: !!tokenData.access_token, hasRefreshToken: !!tokenData.refresh_token });

    return {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type || 'Bearer',
      expires_in: tokenData.expires_in,
    };
  } catch (error) {
    console.error('Error in OAuth token exchange:', error);
    return reply.status(500).send({ error: 'Failed to exchange code for token' });
  }
});

// Get GHL accounts/locations route
fastify.get('/accounts', async (request, reply) => {
  console.log('Fetching GHL accounts');
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    console.error('Missing authorization token');
    return reply.status(401).send({ error: 'Missing authorization token' });
  }

  try {
    console.log('Fetching user locations from GHL API');
    const response = await fetch('https://services.gohighlevel.com/v1/locations/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('GHL API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Locations fetched successfully:', { count: data.locations?.length });

    const accounts = (data.locations || []).map(location => ({
      id: location.id,
      name: location.name,
      timezone: location.timezone,
      country: location.country,
      address: location.address,
      phone: location.phone,
      email: location.email,
      website: location.website,
    }));

    return { accounts };
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return reply.status(500).send({ error: 'Failed to fetch accounts' });
  }
});

// Fetch contacts route
fastify.get('/contacts/search', async (request, reply) => {
  console.log('Fetching contacts:', request.query);
  const { locationId, limit = 200, page = 1 } = request.query;
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!locationId || !token) {
    console.error('Missing required parameters:', { hasLocationId: !!locationId, hasToken: !!token });
    return reply.status(400).send({ error: 'Missing required parameters' });
  }

  try {
    console.log('Fetching contacts from GHL API:', { locationId, limit, page });
    const contacts = await fetchContactsFromGHL(locationId, token, limit, page);
    
    console.log('Contacts fetched successfully:', { count: contacts.length });
    
    const normalizedContacts = contacts.map(contact => ({
      id: contact.id,
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
      email: contact.email?.toLowerCase().trim() || '',
      phone: normalizePhone(contact.phone),
      lastActivity: contact.lastActivityAt || contact.dateAdded,
      tags: contact.tags || [],
      notes: contact.notes || '',
      company: contact.companyName || '',
      position: contact.position || ''
    }));

    console.log('Contacts normalized:', { count: normalizedContacts.length });

    const duplicateGroups = findDuplicates(normalizedContacts);
    console.log('Duplicate groups found:', { count: duplicateGroups.length });

    return { 
      groups: duplicateGroups,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(contacts.length / limit),
        totalContacts: contacts.length
      }
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    request.log.error(error);
    return reply.status(500).send({ error: 'Failed to fetch contacts' });
  }
});

// Merge contacts route
fastify.post('/contacts/merge', async (request, reply) => {
  console.log('Merging contacts:', request.body);
  const { locationId, groupId, masterId, duplicateIds, mergeOptions } = request.body;
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!locationId || !groupId || !masterId || !duplicateIds) {
    console.error('Missing required parameters:', {
      hasLocationId: !!locationId,
      hasGroupId: !!groupId,
      hasMasterId: !!masterId,
      hasDuplicateIds: !!duplicateIds
    });
    return reply.status(400).send({ error: 'Missing required parameters' });
  }

  try {
    console.log('Fetching master contact:', { locationId, masterId });
    const masterContact = await fetchContactFromGHL(locationId, masterId, token);
    if (!masterContact) {
      throw new Error('Master contact not found');
    }

    console.log('Fetching duplicate contacts:', { count: duplicateIds.length });
    const duplicateContacts = await Promise.all(
      duplicateIds.map(id => fetchContactFromGHL(locationId, id, token))
    );

    console.log('Merging contact data');
    const mergedData = mergeContactData(masterContact, duplicateContacts, mergeOptions);

    console.log('Updating master contact:', { masterId });
    await updateContactInGHL(locationId, masterId, mergedData, token);

    console.log('Deleting duplicate contacts:', { count: duplicateIds.length });
    await Promise.all(
      duplicateIds.map(id => deleteContactFromGHL(locationId, id, token))
    );

    console.log('Logging merge activity to Supabase');
    await supabase
      .from('merge_logs')
      .insert({
        location_id: locationId,
        group_id: groupId,
        master_id: masterId,
        duplicate_ids: duplicateIds,
        merge_options: mergeOptions,
        status: 'completed'
      });

    return { status: 'success' };
  } catch (error) {
    console.error('Error merging contacts:', error);
    request.log.error(error);

    console.log('Logging failed merge attempt to Supabase');
    await supabase
      .from('merge_logs')
      .insert({
        location_id: locationId,
        group_id: groupId,
        master_id: masterId,
        duplicate_ids: duplicateIds,
        merge_options: mergeOptions,
        status: 'failed',
        error: error.message
      });

    return reply.status(500).send({ error: 'Failed to merge contacts' });
  }
});

// Helper function to fetch contacts from GHL API
async function fetchContactsFromGHL(locationId, token, limit, page) {
  console.log('Fetching contacts from GHL API:', { locationId, limit, page });
  const response = await fetch(`${GHL_API_BASE}?locationId=${locationId}&limit=${limit}&page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    console.error('GHL API error:', response.status, response.statusText);
    throw new Error(`Failed to fetch contacts: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('GHL API response:', { contactCount: data.contacts?.length });
  return data.contacts || [];
}

// Helper function to fetch a single contact from GHL API
async function fetchContactFromGHL(locationId, contactId, token) {
  console.log('Fetching single contact:', { locationId, contactId });
  const response = await fetch(`${GHL_API_BASE}/${contactId}?locationId=${locationId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    console.error('GHL API error:', response.status, response.statusText);
    throw new Error(`Failed to fetch contact: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to update a contact in GHL API
async function updateContactInGHL(locationId, contactId, data, token) {
  console.log('Updating contact:', { locationId, contactId });
  const response = await fetch(`${GHL_API_BASE}/${contactId}?locationId=${locationId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error('GHL API error:', response.status, response.statusText);
    throw new Error(`Failed to update contact: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to delete a contact in GHL API
async function deleteContactFromGHL(locationId, contactId, token) {
  console.log('Deleting contact:', { locationId, contactId });
  const response = await fetch(`${GHL_API_BASE}/${contactId}?locationId=${locationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    console.error('GHL API error:', response.status, response.statusText);
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }

  return true;
}

// Helper function to merge contact data
function mergeContactData(master, duplicates, options) {
  console.log('Merging contact data:', { 
    masterContact: master.id,
    duplicateCount: duplicates.length,
    options 
  });
  
  const mergedData = { ...master };

  if (options.keepTags) {
    const allTags = new Set(master.tags || []);
    duplicates.forEach(contact => {
      (contact.tags || []).forEach(tag => allTags.add(tag));
    });
    mergedData.tags = Array.from(allTags);
  }

  if (options.keepNotes) {
    const notes = [master.notes || ''];
    duplicates.forEach(contact => {
      if (contact.notes) {
        notes.push(contact.notes);
      }
    });
    mergedData.notes = notes.filter(Boolean).join('\n\n');
  }

  console.log('Merge completed:', {
    tagCount: mergedData.tags?.length,
    hasNotes: !!mergedData.notes
  });
  return mergedData;
}

// Helper function to normalize phone numbers to E.164 format
function normalizePhone(phone) {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Add country code if missing (assuming US numbers)
  if (numbers.length === 10) {
    return `+1${numbers}`;
  }
  
  // If already has country code
  if (numbers.length === 11 && numbers.startsWith('1')) {
    return `+${numbers}`;
  }
  
  return `+${numbers}`;
}

// Helper function to find duplicates using fuzzy matching
function findDuplicates(contacts) {
  console.log('Finding duplicates in contacts:', { count: contacts.length });
  const groups = [];
  const processed = new Set();

  contacts.forEach((contact, i) => {
    if (processed.has(contact.id)) return;

    const duplicates = contacts.slice(i + 1).filter(c => {
      if (processed.has(c.id)) return false;

      // Check email similarity
      const emailMatch = contact.email && c.email && 
        (contact.email === c.email || levenshteinDistance(contact.email, c.email) <= 1);

      // Check phone similarity
      const phoneMatch = contact.phone && c.phone &&
        calculatePhoneSimilarity(contact.phone, c.phone) >= 0.9;

      return emailMatch || phoneMatch;
    });

    if (duplicates.length > 0) {
      const group = {
        id: `group_${i}`,
        contacts: [contact, ...duplicates],
        matchType: duplicates.some(d => d.email === contact.email) ? 'email' : 'phone',
        similarity: calculateGroupSimilarity(contact, duplicates)
      };

      groups.push(group);
      processed.add(contact.id);
      duplicates.forEach(d => processed.add(d.id));
    }
  });

  console.log('Duplicate groups found:', { count: groups.length });
  return groups;
}

// Helper function to calculate group similarity score
function calculateGroupSimilarity(contact, duplicates) {
  const scores = duplicates.map(duplicate => {
    let score = 0;
    let factors = 0;

    if (contact.email && duplicate.email) {
      const emailSimilarity = 1 - (levenshteinDistance(contact.email, duplicate.email) / Math.max(contact.email.length, duplicate.email.length));
      score += emailSimilarity;
      factors++;
    }

    if (contact.phone && duplicate.phone) {
      const phoneSimilarity = calculatePhoneSimilarity(contact.phone, duplicate.phone);
      score += phoneSimilarity;
      factors++;
    }

    if (contact.name && duplicate.name) {
      const nameSimilarity = 1 - (levenshteinDistance(contact.name, duplicate.name) / Math.max(contact.name.length, duplicate.name.length));
      score += nameSimilarity;
      factors++;
    }

    return factors > 0 ? (score / factors) * 100 : 0;
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Helper function to calculate Levenshtein distance
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

// Helper function to calculate phone number similarity
function calculatePhoneSimilarity(phone1, phone2) {
  const digits1 = phone1.replace(/\D/g, '');
  const digits2 = phone2.replace(/\D/g, '');
  
  if (digits1 === digits2) return 1;
  
  let matches = 0;
  const length = Math.max(digits1.length, digits2.length);
  
  for (let i = 0; i < length; i++) {
    if (digits1[i] === digits2[i]) matches++;
  }
  
  return matches / length;
}

// Start the server
try {
  await fastify.listen({ port: 3000 });
  console.log('Server running at http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
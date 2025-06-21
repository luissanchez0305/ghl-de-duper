// Helper function to fetch contacts from GHL API
async function fetchContactsFromGHL(locationId, token, limit, page) {
  const GHL_API_BASE = 'https://services.gohighlevel.com/v1/contacts';
  const response = await fetch(`${GHL_API_BASE}?locationId=${locationId}&limit=${limit}&page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.contacts || [];
}

// Helper function to normalize phone numbers to E.164 format
function normalizePhone(phone) {
  if (!phone) return '';
  
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 10) {
    return `+1${numbers}`;
  }
  
  if (numbers.length === 11 && numbers.startsWith('1')) {
    return `+${numbers}`;
  }
  
  return `+${numbers}`;
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

// Helper function to find duplicates using fuzzy matching
function findDuplicates(contacts) {
  const groups = [];
  const processed = new Set();

  contacts.forEach((contact, i) => {
    if (processed.has(contact.id)) return;

    const duplicates = contacts.slice(i + 1).filter(c => {
      if (processed.has(c.id)) return false;

      const emailMatch = contact.email && c.email && 
        (contact.email === c.email || levenshteinDistance(contact.email, c.email) <= 1);

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { locationId, limit = 200, page = 1 } = req.query;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!locationId || !token) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const contacts = await fetchContactsFromGHL(locationId, token, limit, page);
    
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

    const duplicateGroups = findDuplicates(normalizedContacts);

    return res.status(200).json({ 
      groups: duplicateGroups,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(contacts.length / limit),
        totalContacts: contacts.length
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch contacts' });
  }
} 
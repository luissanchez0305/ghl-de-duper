import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to fetch a single contact from GHL API
async function fetchContactFromGHL(locationId, contactId, token) {
  const GHL_API_BASE = 'https://services.gohighlevel.com/v1/contacts';
  const response = await fetch(`${GHL_API_BASE}/${contactId}?locationId=${locationId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch contact: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to update a contact in GHL API
async function updateContactInGHL(locationId, contactId, data, token) {
  const GHL_API_BASE = 'https://services.gohighlevel.com/v1/contacts';
  const response = await fetch(`${GHL_API_BASE}/${contactId}?locationId=${locationId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update contact: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to delete a contact in GHL API
async function deleteContactFromGHL(locationId, contactId, token) {
  const GHL_API_BASE = 'https://services.gohighlevel.com/v1/contacts';
  const response = await fetch(`${GHL_API_BASE}/${contactId}?locationId=${locationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }

  return true;
}

// Helper function to merge contact data
function mergeContactData(master, duplicates, options) {
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

  return mergedData;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { locationId, groupId, masterId, duplicateIds, mergeOptions } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!locationId || !groupId || !masterId || !duplicateIds) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const masterContact = await fetchContactFromGHL(locationId, masterId, token);
    if (!masterContact) {
      throw new Error('Master contact not found');
    }

    const duplicateContacts = await Promise.all(
      duplicateIds.map(id => fetchContactFromGHL(locationId, id, token))
    );

    const mergedData = mergeContactData(masterContact, duplicateContacts, mergeOptions);

    await updateContactInGHL(locationId, masterId, mergedData, token);

    await Promise.all(
      duplicateIds.map(id => deleteContactFromGHL(locationId, id, token))
    );

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

    return res.status(200).json({ status: 'success' });
  } catch (error) {
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

    return res.status(500).json({ error: 'Failed to merge contacts' });
  }
} 
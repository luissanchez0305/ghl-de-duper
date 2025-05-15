import { DuplicateGroup } from '../types';

const API_URL = '/api';

export async function fetchContacts(locationId: string, token: string): Promise<{ groups: DuplicateGroup[] }> {
  console.log('Fetching contacts:', { locationId });
  const response = await fetch(`${API_URL}/contacts/search?locationId=${locationId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch contacts:', response.status, response.statusText);
    throw new Error('Failed to fetch contacts');
  }

  const data = await response.json();
  console.log('Contacts fetched successfully:', {
    groupCount: data.groups?.length,
    totalContacts: data.groups?.reduce((sum: number, group: DuplicateGroup) => sum + group.contacts.length, 0)
  });
  return data;
}

export async function mergeContacts(locationId: string, groupId: string, masterId: string, duplicateIds: string[], token: string): Promise<{ status: string }> {
  console.log('Merging contacts:', { locationId, groupId, masterId, duplicateCount: duplicateIds.length });
  const response = await fetch(`${API_URL}/contacts/merge`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId,
      groupId,
      masterId,
      duplicateIds,
    }),
  });

  if (!response.ok) {
    console.error('Failed to merge contacts:', response.status, response.statusText);
    throw new Error('Failed to merge contacts');
  }

  const data = await response.json();
  console.log('Merge completed successfully:', data);
  return data;
}
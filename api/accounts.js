export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  try {
    const response = await fetch('https://services.gohighlevel.com/v1/locations/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = await response.json();

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

    return res.status(200).json({ accounts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch accounts' });
  }
} 
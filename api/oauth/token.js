export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, locationId, redirectUri } = req.body;

  if (!code || !locationId || !redirectUri) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const clientId = process.env.VITE_GHL_CLIENT_ID;
    const clientSecret = process.env.VITE_GHL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'OAuth configuration error' });
    }

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
      const errorText = await tokenResponse.text();
      throw new Error(`OAuth token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    return res.status(200).json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type || 'Bearer',
      expires_in: tokenData.expires_in,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to exchange code for token' });
  }
} 
// supabase/functions/ghl-token-exchange/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { code } = await req.json();

    const response = await fetch("https://marketplace.gohighlevel.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: Deno.env.get("GHL_CLIENT_ID"),
        client_secret: Deno.env.get("GHL_CLIENT_SECRET"),
        redirect_uri: Deno.env.get("GHL_REDIRECT_URI"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
});

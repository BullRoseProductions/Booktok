// /api/claude.js
// Vercel serverless function. Spice Rack's front end sends its Anthropic
// request body here; this function adds your secret API key on the server and
// forwards it to Anthropic, so the key is NEVER exposed in the browser.
//
// SETUP:
//   1. In Vercel → Project → Settings → Environment Variables, add:
//        ANTHROPIC_API_KEY = sk-ant-...   (from console.anthropic.com)
//   2. Make sure Fluid Compute is ON (Settings → Functions) so the slow
//      web-search calls don't time out. maxDuration is set in vercel.json.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
  }

  try {
    // Vercel parses JSON bodies automatically, but handle string just in case.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: String(err) });
  }
}

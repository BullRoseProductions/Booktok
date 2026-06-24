# Spice Rack

Trope-based romance book discovery — describe a craving, build it from tropes,
name a half-remembered book, check a series, save presets, rate what you read,
and tag books (author portal). Powered by the Anthropic API with live web search.

## What's in here

```
spice-rack/
  index.html                ← the reader app (homepage)
  spice-rack-authors.html   ← the author tagging portal
  storage-shim.js           ← makes presets/ratings/accounts persist (per browser)
  api/
    claude.js               ← serverless proxy that holds your API key
  vercel.json               ← raises the function timeout for slow web searches
  package.json
```

The two HTML files are already wired to call `/api/claude` and to load the
storage shim — no hand-editing needed.

## Deploy (GitHub + Vercel)

1. **Push to GitHub.** Create a new repo and push this folder's contents to it.
2. **Import to Vercel.** vercel.com → Add New → Project → import the repo.
   It's a static site with serverless functions; no build step or framework needed.
3. **Add your API key.** Project → Settings → Environment Variables:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from https://console.anthropic.com (starts with `sk-ant-`)
   Redeploy after adding it.
4. **Turn on Fluid Compute.** Project → Settings → Functions → enable Fluid
   Compute. Web-search lookups can take 20–60s; this keeps them from timing out.
   (`vercel.json` already sets the function maxDuration to 60s.)
5. Open your Vercel URL. The author portal is at `/spice-rack-authors.html`.

### Local testing

Install the CLI (`npm i -g vercel`), put your key in a `.env.local` file as
`ANTHROPIC_API_KEY=sk-ant-...`, then run `vercel dev`. (Opening index.html
directly with file:// won't run the serverless function.)

## Important notes

- **Cost:** the API is pay-as-you-go. The app uses Claude Sonnet 4.6 (~$3/$15
  per million tokens) plus ~$0.01 per web search, so each lookup is roughly a
  nickel to ~20¢. No subscription; you pay per use.
- **Storage today = per browser.** `storage-shim.js` saves presets, ratings, and
  accounts in the visitor's own browser via localStorage. Great for a demo, but
  a person can't log in across two devices, and the author-submission wall isn't
  shared between people. For real accounts + a shared catalog, replace the shim
  with Supabase (auth + Postgres) — the account layer is already structured for it.
- **Vercel plan:** the free Hobby tier is for non-commercial use. The day this
  earns money or serves paying customers, Vercel's terms require the Pro plan ($20/mo).
- **Affiliate:** set `AFFILIATE_TAG` near the top of the `<script>` in index.html
  to your Amazon Associates tag to earn on Kindle links.

This is a working prototype. Real accounts, a shared catalog, and the pre-read
trust card are the natural next builds.

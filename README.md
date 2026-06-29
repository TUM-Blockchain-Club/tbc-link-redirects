# TBC Link Redirects

Next.js redirect and click tracking service for `link.tum-blockchain.com`.

## Development

Run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`. The root URL redirects to `https://www.tum-blockchain.com/`.

Redirects are served through:

```text
/q/[year]/[slug]
```

Initial links:

```text
/q/26/fly-01
/q/26/fly-02
...
/q/26/fly-20
/q/26/roll-up-01
...
/q/26/roll-up-05
```

## Tracking

Targets first resolve from `src/lib/link-definitions.json`. If a path is not hardcoded, the app falls back to an active Supabase soft link with the same `/q/[year]/[slug]` path. Click tracking is written to Supabase after the redirect response using Next.js `after()`.

Campaign redirects append outbound UTM parameters before redirecting to the target:

```text
utm_source=[variant or slug]
utm_medium=qr
utm_campaign=[campaign]
utm_content=[slug]
```

For example, `/q/26/fly-01` redirects to the configured target with `utm_source=fly-01&utm_medium=qr&utm_campaign=flyer-2026&utm_content=fly-01`.

The app stores datensparsame analytics fields: link metadata, sanitized target URL, referrer domain, device type, browser family, Vercel country, UTM query parameters, and click hour. It does not store IP addresses, raw user agents, full referrer URLs, or exact click timestamps.

Apply `supabase/link_redirect_clicks.sql` and `supabase/link_redirect_definitions.sql` before relying on production tracking.

Sync canonical links into Supabase metadata:

```bash
pnpm sync:links
```

Promote active Supabase soft links, or Supabase target changes for existing hardcoded links, into the hardcoded JSON:

```bash
pnpm promote:links
```

More details are in `docs/architecture.md`.

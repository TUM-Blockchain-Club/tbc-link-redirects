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

Targets are hardcoded from `src/lib/link-definitions.json`. Click tracking is written to Supabase after the redirect response using Next.js `after()`.

The app stores datensparsame analytics fields: link metadata, sanitized target URL, referrer domain, device type, browser family, Vercel country, UTM query parameters, and click hour. It does not store IP addresses, raw user agents, full referrer URLs, or exact click timestamps.

Apply `supabase/link_redirect_clicks.sql` and `supabase/link_redirect_definitions.sql` before relying on production tracking.

Sync canonical links into Supabase metadata:

```bash
pnpm sync:links
```

More details are in `docs/architecture.md`.

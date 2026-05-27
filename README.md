# TBC Link Redirects

Next.js redirect and click tracking service for `link.tum-blockchain.com`.

## Development

Run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

Redirects are served through:

```text
/q/[year]/[slug]
```

Initial links:

```text
/q/26/fly-1
/q/26/fly-2
```

## Tracking

Targets are hardcoded in `src/lib/links.ts`. Click tracking is written to Supabase after the redirect response using Next.js `after()`.

Apply `supabase/link_redirect_clicks.sql` before relying on production tracking.

More details are in `docs/architecture.md`.

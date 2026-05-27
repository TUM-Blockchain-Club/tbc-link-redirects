# TBC Link Redirects Architecture

## Purpose

This project serves QR and campaign redirect URLs for TUM Blockchain Club at `link.tum-blockchain.com`.

The root route `/` redirects to `https://www.tum-blockchain.com/` and is intentionally not tracked. Tracking is reserved for explicit campaign links under `/q/[year]/[slug]` so analytics measure QR/link campaign performance rather than generic homepage traffic.

Public links follow this format:

```text
/q/[year]/[slug]
```

Initial examples:

```text
/q/26/fly-01
/q/26/fly-02
```

## Redirect Source

Redirect targets are currently hardcoded from `src/lib/link-definitions.json`. This keeps the pre-redirect path as fast as possible because the route does not need to fetch the target from Supabase before responding.

The code is still structured around a `getRedirectLink(year, slug)` lookup so the storage backend can later move to Supabase without changing public QR URLs.

`link-definitions.json` is also synced into Supabase with `pnpm sync:links`. This avoids maintaining separate canonical link lists: code remains the source of truth for redirect behavior, while Supabase stores metadata for the membership analytics dashboard.

## Tracking Flow

1. A visitor opens `/q/[year]/[slug]`.
2. The route resolves the hardcoded link.
3. The route immediately returns a temporary `302` redirect.
4. Next.js `after()` schedules the Supabase insert after the response.

Tracking failures are logged but do not block redirects.

## Tracked Fields

The app stores:

- year
- slug
- status: `redirected` or `not_found`
- target URL
- origin
- campaign
- variant
- label
- HTTP referrer domain
- device type
- browser family
- Vercel country header
- selected UTM query parameters
- request path
- click hour

The app intentionally does not store IP addresses, raw user agents, full referrer URLs, city-level geo fields, or exact click timestamps.

## Supabase

The tracking table SQL lives in `supabase/link_redirect_clicks.sql`.

The link metadata table SQL lives in `supabase/link_redirect_definitions.sql`.

The production deployment needs:

```text
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

The service role key is server-only and must never be exposed to client code.

After changing canonical links, run:

```bash
pnpm sync:links
```

The sync updates canonical columns such as target URL, label, origin, campaign, and variant. Deployment fields such as `deployment_region`, `deployment_location`, `deployment_notes`, and `deployed_at` are intentionally not overwritten by the sync script, so the dashboard can manage those operational notes.

## Membership Dashboard Integration

The membership management platform already uses Supabase Google OAuth via `auth.signInWithGoogle()` and loads dashboard access from `members_main`.

For the future analytics view, add it in that repository behind the existing dashboard shell and only render it for members where `member.Role === "Board Member"` or the existing special-access flow returns true. The analytics view should read aggregate data from `link_redirect_clicks`; avoid exposing row-level raw analytics unless the board specifically needs it.

## Adding Links

Add a new entry to `src/lib/link-definitions.json`.

For flyer variants, prefer one slug per printed QR code:

```text
/q/26/fly-01
/q/26/fly-02
/q/26/fly-03
```

Group related links through shared metadata such as `origin: "flyer"` and `campaign: "flyer-2026"`.

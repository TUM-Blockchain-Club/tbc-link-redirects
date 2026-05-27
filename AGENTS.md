# Repository Instructions

- Use `pnpm` for all Node.js commands.
- This is a Next.js App Router project for QR/link redirects at `link.tum-blockchain.com`.
- Keep canonical redirect definitions in `src/lib/link-definitions.json`. `src/lib/links.ts` consumes that file for fast hardcoded redirects before falling back to Supabase soft links.
- Run `pnpm sync:links` after adding or changing canonical links so Supabase metadata stays in sync for analytics dashboards.
- Run `pnpm promote:links` to promote active Supabase soft links, or Supabase target changes for existing hardcoded links, into `src/lib/link-definitions.json` without changing public paths.
- Do not store IP addresses. The tracking route records link metadata, referrer, user agent, Vercel country header, query UTM values, and timestamps only.
- Keep implementation and architecture notes in Markdown under `docs/`.
- Apply `supabase/link_redirect_clicks.sql` and `supabase/link_redirect_definitions.sql` before relying on production click tracking and analytics metadata.
- Do not commit `.env.local` or other local secret files.
- Run `pnpm lint` and `pnpm build` before handing off changes.

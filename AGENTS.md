# Repository Instructions

- Use `pnpm` for all Node.js commands.
- This is a Next.js App Router project for QR/link redirects at `link.tum-blockchain.com`.
- Keep redirect definitions in `src/lib/links.ts` until the project migrates link storage to Supabase.
- Do not store IP addresses. The tracking route records link metadata, referrer, user agent, Vercel country header, query UTM values, and timestamps only.
- Keep implementation and architecture notes in Markdown under `docs/`.
- Apply `supabase/link_redirect_clicks.sql` before relying on production click tracking.
- Do not commit `.env.local` or other local secret files.
- Run `pnpm lint` and `pnpm build` before handing off changes.

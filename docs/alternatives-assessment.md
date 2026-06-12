# Link Redirect Alternatives Assessment

## Question

Was building this redirect service unnecessary because open-source URL shortener and link-management tools already exist?

## Short Answer

For a generic branded URL shortener, yes: mature open-source products already cover this space and provide broader management UIs, APIs, analytics, QR-code support, expiration, password protection, and custom domains.

For this project's current scope, the custom implementation is still defensible. It is deliberately small, keeps canonical printed campaign links in Git, redirects quickly from static definitions, stores privacy-preserving click events in Supabase, and integrates naturally with the existing TUM Blockchain Club dashboard data model.

## Project-Specific Requirements

- Stable printed QR paths under `/q/[year]/[slug]`.
- Fast redirects where hardcoded links win over mutable dashboard data.
- Privacy-preserving analytics that avoid IP addresses, raw user agents, full referrers, and exact timestamps.
- Supabase tables that can be read by the membership dashboard.
- A promotion flow where operational soft links can later become canonical Git-managed links.
- Very small operational surface on the existing Next.js/Vercel/Supabase stack.

## Existing Open-Source Options

### Dub

Dub is a mature open-source link attribution platform for short links, conversion tracking, and affiliate programs. It is feature-rich and built on a larger production stack including Next.js, Prisma, Redis, Tinybird, PlanetScale, NextAuth, Stripe, and other services.

Best fit: teams that want a polished link-management product with attribution, collaboration, APIs, and possible hosted-service parity.

Tradeoff for this project: significantly more infrastructure and product surface than needed for a small set of QR campaign redirects.

### Shlink

Shlink is a self-hosted MIT-licensed URL shortener with custom slugs, REST API, CLI tooling, anonymized visit stats, geolocation, Docker support, and a separate web client.

Best fit: self-hosted link shortening with a stable backend, API, and dashboard client.

Tradeoff for this project: it is PHP-based and would introduce a separate service/runtime instead of fitting directly into the existing Next.js/Supabase deployment.

### Kutt

Kutt is a modern open-source URL shortener with custom domains, link editing, private stats, user management, admin pages, REST API, link expiration, passwords, OIDC login, and multiple database options.

Best fit: a general-purpose shortener with user accounts and admin workflows.

Tradeoff for this project: it duplicates dashboard/auth concerns already handled elsewhere and is broader than the QR redirect requirement.

### YOURLS

YOURLS is a long-running MIT-licensed self-hosted PHP shortener with stats, API support, bookmarklets, and a large plugin ecosystem.

Best fit: lightweight traditional self-hosted shortening where plugin extensibility matters.

Tradeoff for this project: legacy PHP/MySQL-style deployment and plugin-driven customization are less aligned with the current Next.js/Supabase stack.

### Sink

Sink is an open-source Cloudflare-native shortener with analytics, custom slugs, QR codes, expiration, password protection, smart routing, and import/export.

Best fit: teams already comfortable running link infrastructure on Cloudflare Workers, KV/D1, and Workers Analytics.

Tradeoff for this project: Cloudflare-native infrastructure would move the system away from the current Vercel/Supabase operating model.

## Recommendation

Keeping the custom service is reasonable if the goal is stable QR campaign links, privacy-preserving Supabase analytics, and minimal operational surface.

Migrating to an existing open-source product would make sense if the club wants a full link-management product: non-technical link creation, dashboard-first administration, bulk import/export, password-protected links, expirations, QR-code generation, role management, team workflows, or richer attribution.

If migrating, the most relevant candidates are Dub for a polished modern product, Shlink for a focused self-hosted shortener, and Kutt for an admin/user-oriented shortener. For this repository's current shape, Shlink is the closest conceptual replacement, while Dub is the strongest product-level alternative.

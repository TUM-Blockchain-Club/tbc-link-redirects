# Dependency maintenance

Next.js and its ESLint configuration are kept on the same patched release. React and React DOM share an exact version. The pnpm lockfile records resolved transitive security updates.

Use `pnpm install --frozen-lockfile --ignore-scripts`, then run lint, build, typecheck and available tests. Check `pnpm audit` after refreshing dependencies. Verification must use synthetic environment values and avoid analytics or database mutations.

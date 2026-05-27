import { readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

async function loadLocalEnv() {
  try {
    const envFile = await readFile(".env.local", "utf8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      process.env[key] ??= valueParts.join("=");
    }
  } catch {
    // Vercel and CI provide environment variables directly.
  }
}

const definitionsUrl = new URL("../src/lib/link-definitions.json", import.meta.url);

function sortLinks(a, b) {
  return (
    String(a.year).localeCompare(String(b.year)) ||
    String(a.origin).localeCompare(String(b.origin)) ||
    String(a.slug).localeCompare(String(b.slug))
  );
}

async function main() {
  await loadLocalEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const localDefinitions = JSON.parse(await readFile(definitionsUrl, "utf8"));
  const byKey = new Map(localDefinitions.map((link) => [`${link.year}/${link.slug}`, link]));

  const { data, error } = await supabase
    .from("link_redirect_definitions")
    .select("year, slug, label, target_url, origin, campaign, variant, active")
    .eq("active", true)
    .order("year", { ascending: true })
    .order("slug", { ascending: true });

  if (error) {
    throw error;
  }

  let inserted = 0;
  let updated = 0;

  for (const row of data ?? []) {
    const key = `${row.year}/${row.slug}`;
    const existing = byKey.get(key);
    const promoted = {
      year: row.year,
      slug: row.slug,
      label: row.label,
      targetUrl: row.target_url,
      origin: row.origin,
      campaign: row.campaign,
      variant: row.variant,
    };

    if (!existing) {
      byKey.set(key, promoted);
      inserted += 1;
      continue;
    }

    const changed =
      existing.label !== promoted.label ||
      existing.targetUrl !== promoted.targetUrl ||
      existing.origin !== promoted.origin ||
      existing.campaign !== promoted.campaign ||
      existing.variant !== promoted.variant;

    if (changed) {
      byKey.set(key, promoted);
      updated += 1;
    }
  }

  const nextDefinitions = [...byKey.values()].sort(sortLinks);
  await writeFile(definitionsUrl, `${JSON.stringify(nextDefinitions, null, 2)}\n`);

  console.info(
    `Promoted ${inserted} new soft links and updated ${updated} existing hardcoded links.`,
  );
  console.info("Run `pnpm sync:links` after committing/deploying to refresh hardcoded metadata.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { readFile } from "node:fs/promises";
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

async function main() {
  await loadLocalEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  const definitions = JSON.parse(
    await readFile(new URL("../src/lib/link-definitions.json", import.meta.url), "utf8"),
  );

  const rows = definitions.map((link) => ({
    year: link.year,
    slug: link.slug,
    label: link.label,
    target_url: link.targetUrl,
    origin: link.origin,
    campaign: link.campaign,
    variant: link.variant,
    active: true,
    redirect_source: "hardcoded",
    hardcoded_target_url: link.targetUrl,
    hardcoded_synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase
    .from("link_redirect_definitions")
    .upsert(rows, { onConflict: "year,slug" });

  if (error) {
    throw error;
  }

  console.info(`Synced ${rows.length} link definitions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

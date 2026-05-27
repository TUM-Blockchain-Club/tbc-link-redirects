import { LINKS } from "@/lib/links";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f2ea] text-[#151515]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-[#151515]/15 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#866d32]">
              TBC Link Redirects
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              link.tum-blockchain.com
            </h1>
          </div>
          <div className="rounded-full border border-[#151515]/20 px-3 py-1 text-sm font-medium">
            Active
          </div>
        </header>

        <div className="grid flex-1 gap-10 py-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <p className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Fast QR redirects with post-response Supabase tracking.
            </p>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#49433a]">
              Public QR links use hardcoded targets for minimal redirect delay.
              Click metadata is written after the redirect response, without IP
              storage.
            </p>
          </div>

          <div className="border border-[#151515]/15 bg-[#fffaf0]">
            <div className="grid grid-cols-[1fr_auto] border-b border-[#151515]/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d6048]">
              <span>Path</span>
              <span>Origin</span>
            </div>
            <div>
              {LINKS.map((link) => (
                <a
                  key={`${link.year}/${link.slug}`}
                  href={`/q/${link.year}/${link.slug}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-5 border-b border-[#151515]/10 px-5 py-4 last:border-b-0 hover:bg-[#f3ead9]"
                >
                  <div>
                    <p className="font-mono text-sm">
                      /q/{link.year}/{link.slug}
                    </p>
                    <p className="mt-1 text-sm text-[#6d6048]">{link.label}</p>
                  </div>
                  <p className="text-sm font-medium">{link.origin}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-[#151515]/15 py-5 text-sm text-[#6d6048]">
          Redirect route: <span className="font-mono">/q/[year]/[slug]</span>
        </footer>
      </section>
    </main>
  );
}

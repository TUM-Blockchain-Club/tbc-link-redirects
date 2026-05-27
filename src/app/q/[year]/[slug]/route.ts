import { after, type NextRequest, NextResponse } from "next/server";
import { getRedirectLink } from "@/lib/links";
import { trackClick } from "@/lib/tracking";

type RouteContext = {
  params: Promise<{
    year: string;
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: RouteContext) {
  const { year, slug } = await context.params;
  const link = getRedirectLink(year, slug);

  if (!link) {
    after(async () => {
      try {
        await trackClick({ request, link: null, year, slug, status: "not_found" });
      } catch (error) {
        console.error("Failed to track missing redirect link", error);
      }
    });

    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  after(async () => {
    try {
      await trackClick({
        request,
        link,
        year,
        slug,
        status: "redirected",
        targetUrl: link.targetUrl,
      });
    } catch (error) {
      console.error("Failed to track redirect click", error);
    }
  });

  return NextResponse.redirect(link.targetUrl, 302);
}

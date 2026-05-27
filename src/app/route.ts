import { NextResponse } from "next/server";

const MAIN_SITE_URL = "https://www.tum-blockchain.com/";

export function GET() {
  return NextResponse.redirect(MAIN_SITE_URL, 302);
}

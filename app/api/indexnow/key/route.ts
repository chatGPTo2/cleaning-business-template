import { NextResponse } from "next/server";
import { getIndexNowKey } from "@/lib/indexnow";

export function GET() {
  const key = getIndexNowKey();

  if (!key) {
    return new NextResponse("IndexNow key is not configured.", { status: 404 });
  }

  return new NextResponse(key, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

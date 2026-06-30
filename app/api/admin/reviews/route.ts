import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { getAllReviewsAdmin, upsertReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reviews = await getAllReviewsAdmin();
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.author_name || !body.review_body || !body.date_published) {
    return NextResponse.json({ error: "author_name, review_body and date_published are required." }, { status: 400 });
  }

  const result = await upsertReview({
    author_name:    String(body.author_name),
    author_initial: String(body.author_initial ?? String(body.author_name).charAt(0).toUpperCase()),
    rating:         Number(body.rating ?? 5),
    review_body:    String(body.review_body),
    service_type:   body.service_type ? String(body.service_type) : null,
    date_published: String(body.date_published),
    source:         String(body.source ?? "google"),
    place_review_id: body.place_review_id ? String(body.place_review_id) : null,
    is_featured:    Boolean(body.is_featured ?? false),
    is_visible:     Boolean(body.is_visible ?? true),
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}

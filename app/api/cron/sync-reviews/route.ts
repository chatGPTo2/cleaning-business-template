import { NextRequest, NextResponse } from "next/server";
import { upsertReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// Google Places API returns max 5 reviews per request
// This cron runs daily to pick up any new reviews

interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number; // unix timestamp
  relative_time_description: string;
}

function authorInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  const querySecret = req.nextUrl.searchParams.get("secret");

  if (!secret || (auth !== `Bearer ${secret}` && querySecret !== secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({
      ok: false,
      message: "GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID env vars required",
    });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json() as {
    status: string;
    result?: { reviews?: PlaceReview[]; rating?: number; user_ratings_total?: number };
  };

  if (data.status !== "OK" || !data.result?.reviews) {
    return NextResponse.json({ ok: false, message: `Places API: ${data.status}` });
  }

  const reviews: PlaceReview[] = data.result.reviews;
  let imported = 0;
  let skipped = 0;

  for (const r of reviews) {
    if (!r.text) { skipped++; continue; }

    const date = new Date(r.time * 1000).toISOString().split("T")[0];
    const placeReviewId = `places_${r.author_name}_${r.time}`;

    const result = await upsertReview({
      author_name: r.author_name,
      author_initial: authorInitial(r.author_name),
      rating: r.rating,
      review_body: r.text,
      service_type: null,
      date_published: date,
      source: "google",
      place_review_id: placeReviewId,
      is_featured: false,
      is_visible: true,
    });

    if (result.ok) imported++;
    else skipped++;
  }

  return NextResponse.json({ ok: true, imported, skipped, total: reviews.length });
}

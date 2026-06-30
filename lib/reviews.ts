export interface Review {
  id: string;
  author_name: string;
  author_initial: string;
  rating: number;
  review_body: string;
  service_type: string | null;
  date_published: string;
  source: string;
  place_review_id: string | null;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
}

export async function getVisibleReviews(): Promise<Review[]> {
  const { supabaseAdmin } = await import("./supabase");
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("is_visible", true)
    .order("date_published", { ascending: false });

  if (error) {
    console.error("[reviews] fetch error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedReview(): Promise<Review | null> {
  const { supabaseAdmin } = await import("./supabase");
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("is_visible", true)
    .eq("is_featured", true)
    .order("date_published", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  const { supabaseAdmin } = await import("./supabase");
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("date_published", { ascending: false });

  return data ?? [];
}

export async function upsertReview(review: Omit<Review, "id" | "created_at">): Promise<{ ok: boolean; error?: string }> {
  const { supabaseAdmin } = await import("./supabase");
  if (!supabaseAdmin) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabaseAdmin
    .from("reviews")
    .upsert(review, { onConflict: "place_review_id" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteReview(id: string): Promise<{ ok: boolean }> {
  const { supabaseAdmin } = await import("./supabase");
  if (!supabaseAdmin) return { ok: false };

  await supabaseAdmin.from("reviews").delete().eq("id", id);
  return { ok: true };
}

export async function updateReview(id: string, patch: Partial<Review>): Promise<{ ok: boolean }> {
  const { supabaseAdmin } = await import("./supabase");
  if (!supabaseAdmin) return { ok: false };

  await supabaseAdmin.from("reviews").update(patch).eq("id", id);
  return { ok: true };
}

export function getAggregateRating(reviews: Review[]) {
  if (reviews.length === 0) return { ratingValue: "5.0", reviewCount: 0 };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return {
    ratingValue: avg.toFixed(1),
    reviewCount: reviews.length,
  };
}

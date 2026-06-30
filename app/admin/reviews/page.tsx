import { requireAdmin } from "@/lib/admin-auth";
import { getAllReviewsAdmin } from "@/lib/reviews";
import AdminShell from "../AdminShell";
import ReviewsManager from "./ReviewsManager";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  await requireAdmin();
  const reviews = await getAllReviewsAdmin();

  return (
    <AdminShell section="reviews">
      <ReviewsManager initialReviews={reviews} />
    </AdminShell>
  );
}

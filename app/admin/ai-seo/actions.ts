"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAiSeoBlogDrafts, getAiSeoSettings, getSeoSnapshot, saveAiSeoSettings } from "@/lib/ai-seo";
import { supabaseAdmin } from "@/lib/supabase";

function formNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : undefined;
}

function formList(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 40);
}

export async function generateAiSeoDrafts() {
  await requireAdmin();

  let redirectTo = "/admin/ai-seo";

  try {
    const snapshot = await getSeoSnapshot();
    if (!snapshot.connected) {
      redirectTo = "/admin/ai-seo?error=connect-google-first";
      return;
    }

    const settings = await getAiSeoSettings();
    const drafts = await createAiSeoBlogDrafts(snapshot, {
      limit: settings.drafts_per_run,
      autoPublish: false,
      settings,
    });
    revalidatePath("/admin/blog");
    revalidatePath("/admin/ai-seo");
    redirectTo = `/admin/ai-seo?drafts=${drafts.length}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate AI SEO drafts.";
    redirectTo = `/admin/ai-seo?error=${encodeURIComponent(message)}`;
  }

  redirect(redirectTo);
}

export async function updateAiSeoSchedule(formData: FormData) {
  await requireAdmin();

  let redirectTo = "/admin/ai-seo?schedule=1";

  try {
    await saveAiSeoSettings({
      enabled: formData.get("enabled") === "on",
      interval_hours: formNumber(formData, "interval_hours"),
      drafts_per_run: formNumber(formData, "drafts_per_run"),
      auto_publish: formData.get("auto_publish") === "on",
      require_approval_before_publish: formData.get("require_approval_before_publish") !== "off",
      target_locations: formList(formData, "target_locations"),
      target_services: formList(formData, "target_services"),
      content_brief: String(formData.get("content_brief") ?? "").trim(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save schedule.";
    redirectTo = `/admin/ai-seo?error=${encodeURIComponent(message)}`;
  }

  redirect(redirectTo);
}

export async function bulkApproveDrafts(postIds: string[]) {
  await requireAdmin();
  if (!supabaseAdmin || postIds.length === 0) return { approved: 0 };

  const { data } = await supabaseAdmin
    .from("blog_posts")
    .update({ approved: true })
    .in("id", postIds)
    .select("id");

  revalidatePath("/admin/ai-seo");
  revalidatePath("/admin/blog");
  return { approved: data?.length ?? 0 };
}

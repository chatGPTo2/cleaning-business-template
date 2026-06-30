"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdmin, setAdminSession } from "@/lib/admin-auth";
import { labelise, shortReference } from "@/lib/crm";
import { blogPostUrl, submitIndexNowUrls } from "@/lib/indexnow";
import { createSquarePaymentLink } from "@/lib/square";
import { supabaseAdmin } from "@/lib/supabase";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function nullableValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw || null;
}

function moneyValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function percentageValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  if (!raw) return 100;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 100;
  return Math.min(100, Math.max(0, parsed));
}

export async function loginAdmin(formData: FormData) {
  const password = value(formData, "password");
  if (!process.env.ADMIN_DASHBOARD_PASSWORD || password !== process.env.ADMIN_DASHBOARD_PASSWORD) {
    redirect("/admin?error=1");
  }

  await setAdminSession();
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

export async function updateQuoteStatus(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/dashboard?setup=1");

  const id = value(formData, "id");
  const status = value(formData, "status");
  await supabaseAdmin.from("quotes").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin");
}

export async function updateJobStatus(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/dashboard?setup=1");

  const id = value(formData, "id");
  const status = value(formData, "status");
  await supabaseAdmin.from("jobs").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin");
}

export async function addNote(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/dashboard?setup=1");

  const customerId = nullableValue(formData, "customer_id");
  const jobId = nullableValue(formData, "job_id");
  const content = value(formData, "content");
  if (!content || !customerId) return;

  await supabaseAdmin.from("notes").insert({
    customer_id: customerId,
    job_id: jobId,
    content,
    note_type: value(formData, "note_type") || "admin_comment",
    created_by: value(formData, "created_by") || "Admin",
  });

  revalidatePath("/admin");
}

export async function convertQuoteToJob(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/dashboard?setup=1");

  const quoteId = value(formData, "quote_id");
  const { data: quote } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (!quote) return;

  const price = moneyValue(formData, "price") ?? quote.estimated_price ?? null;
  const scheduledTime = nullableValue(formData, "scheduled_exact_time")
    || nullableValue(formData, "scheduled_time")
    || quote.preferred_exact_time
    || quote.preferred_time;

  const { data: job } = await supabaseAdmin
    .from("jobs")
    .insert({
      customer_id: quote.customer_id,
      quote_id: quote.id,
      service_type: value(formData, "service_type") || quote.service_type,
      frequency: value(formData, "frequency") || quote.frequency,
      scheduled_date: nullableValue(formData, "scheduled_date") || quote.preferred_date,
      scheduled_time: scheduledTime,
      status: value(formData, "status") || "draft",
      internal_notes: nullableValue(formData, "internal_notes"),
      customer_notes: nullableValue(formData, "customer_notes"),
      price,
      payment_status: "not_required",
    })
    .select("id")
    .single();

  await supabaseAdmin
    .from("quotes")
    .update({ status: "converted_to_job", updated_at: new Date().toISOString() })
    .eq("id", quote.id);

  revalidatePath("/admin");
  if (job?.id) redirect(`/admin/jobs/${job.id}`);
}

export async function updateJobFinalisation(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/dashboard?setup=1");

  const id = value(formData, "id");
  const price = moneyValue(formData, "price");
  const paymentPercentage = percentageValue(formData, "payment_percentage");
  const paymentAmount = price === null ? null : Math.round(price * (paymentPercentage / 100) * 100) / 100;

  const milestonesRaw = value(formData, "milestones");
  let milestones = null;
  try {
    const parsed = JSON.parse(milestonesRaw);
    milestones = Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch { /* ignore */ }

  await supabaseAdmin
    .from("jobs")
    .update({
      service_type: value(formData, "service_type"),
      frequency: nullableValue(formData, "frequency"),
      scheduled_date: nullableValue(formData, "scheduled_date"),
      scheduled_time: nullableValue(formData, "scheduled_time"),
      final_scope_notes: nullableValue(formData, "final_scope_notes"),
      price,
      deposit_required: formData.get("deposit_required") === "on",
      full_payment_required: formData.get("full_payment_required") === "on",
      payment_due_timing: nullableValue(formData, "payment_due_timing"),
      payment_percentage: paymentPercentage,
      payment_amount: paymentAmount,
      payment_status: paymentAmount && paymentAmount > 0 ? "not_required" : "not_required",
      milestones,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin");
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/hub");

  const slug = value(formData, "slug");
  const status = value(formData, "status") || "draft";

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      slug,
      title: value(formData, "title"),
      excerpt: value(formData, "excerpt"),
      content: value(formData, "content"),
      category: value(formData, "category") || "Tips",
      image: value(formData, "image"),
      image_alt: value(formData, "image_alt"),
      meta_title: nullableValue(formData, "meta_title"),
      meta_description: nullableValue(formData, "meta_description"),
      read_time: value(formData, "read_time") || "5 min read",
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (status === "published") {
    await submitIndexNowUrls([blogPostUrl(slug)]);
  }
  redirect(`/admin/blog/${data!.id}`);
}

export async function updateBlogPost(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/hub");

  const id = value(formData, "id");
  const slug = value(formData, "slug");
  const previousSlug = value(formData, "previous_slug");
  const status = value(formData, "status") || "draft";
  const wasPublished = value(formData, "was_published") === "true";

  await supabaseAdmin
    .from("blog_posts")
    .update({
      slug,
      title: value(formData, "title"),
      excerpt: value(formData, "excerpt"),
      content: value(formData, "content"),
      category: value(formData, "category") || "Tips",
      image: value(formData, "image"),
      image_alt: value(formData, "image_alt"),
      meta_title: nullableValue(formData, "meta_title"),
      meta_description: nullableValue(formData, "meta_description"),
      read_time: value(formData, "read_time") || "5 min read",
      status,
      published_at: status === "published" && !wasPublished ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
  revalidatePath(`/admin/blog/${id}`);
  if (status === "published") {
    await submitIndexNowUrls([blogPostUrl(slug)]);
  }
  redirect(`/admin/blog/${id}`);
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/hub");

  const id = value(formData, "id");
  const slug = value(formData, "slug");

  await supabaseAdmin.from("blog_posts").delete().eq("id", id);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function generateSquarePaymentLink(formData: FormData) {
  await requireAdmin();
  if (!supabaseAdmin) redirect("/admin/dashboard?setup=1");

  const id = value(formData, "id");
  const { data: job, error } = await supabaseAdmin
    .from("jobs")
    .select("*,customers(first_name,last_name,email,phone)")
    .eq("id", id)
    .single();

  if (error || !job) return;

  const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers;
  const amount = Number(job.payment_amount ?? job.price ?? 0);
  const reference = shortReference("J", job.id);
  const serviceDescription = [
    labelise(job.service_type),
    job.scheduled_date ? `on ${job.scheduled_date}` : null,
    job.scheduled_time ? `at ${job.scheduled_time}` : null,
  ].filter(Boolean).join(" ");

  const payment = await createSquarePaymentLink({
    jobId: job.id,
    reference,
    customerName: [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || "Customer",
    customerEmail: customer?.email,
    customerPhone: customer?.phone,
    serviceDescription,
    amount,
  });

  await supabaseAdmin
    .from("jobs")
    .update({
      payment_provider: "square",
      payment_link: payment.paymentLink,
      payment_status: "pending",
      payment_amount: amount,
      payment_created_at: new Date().toISOString(),
      payment_reference: payment.paymentReference,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin");
}

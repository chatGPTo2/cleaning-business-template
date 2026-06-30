import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ drafts: [] });
  }

  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .not("generation_run_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json({ drafts: data ?? [] });
}

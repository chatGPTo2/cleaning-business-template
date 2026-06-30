import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Accept either a single postId or an array of postIds
  const postIds: string[] = Array.isArray(body.postIds)
    ? (body.postIds as string[])
    : body.postId
    ? [String(body.postId)]
    : [];

  if (postIds.length === 0) {
    return NextResponse.json({ error: "postId or postIds required" }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from("blog_posts")
    .delete()
    .in("id", postIds)
    .neq("status", "published"); // safety: never delete published posts from this endpoint

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: postIds.length });
}

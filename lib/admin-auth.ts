import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

const COOKIE_NAME = "taspro_admin";

function sessionValue() {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) return null;

  const secret = process.env.TOKEN_SECRET ?? "taspro-admin-session";
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export async function isAdminSession() {
  const expected = sessionValue();
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  return Boolean(expected && session === expected);
}

export async function requireAdmin() {
  if (!(await isAdminSession())) {
    redirect("/admin");
  }
}

export async function setAdminSession() {
  const expected = sessionValue();
  if (!expected) return false;

  (await cookies()).set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return true;
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

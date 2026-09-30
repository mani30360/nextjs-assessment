import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth/credentials";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken } from "@/lib/auth/session";
import type { LoginCredentials } from "@/types";

function isLoginCredentials(body: unknown): body is LoginCredentials {
  return (
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    "password" in body &&
    typeof body.email === "string" &&
    typeof body.password === "string"
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (!isLoginCredentials(body)) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const user = validateCredentials(body);
  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json(user);
  response.cookies.set(SESSION_COOKIE, await createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

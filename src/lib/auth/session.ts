import type { AuthUser } from "@/types";

/**
 * Stateless session tokens: `<base64url(email)>.<base64url(HMAC-SHA256)>`.
 * Uses Web Crypto only, so it runs in the proxy, route handlers and server components alike.
 */

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Copy .env.example to .env and set it.");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function importKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(user: AuthUser): Promise<string> {
  const payload = toBase64Url(encoder.encode(user.email));
  const signature = await crypto.subtle.sign("HMAC", await importKey(), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the user when the token's signature is valid, otherwise `null`. */
export async function verifySessionToken(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await importKey(),
      fromBase64Url(signature),
      encoder.encode(payload),
    );
    return valid ? { email: new TextDecoder().decode(fromBase64Url(payload)) } : null;
  } catch {
    // Malformed base64 or similar — treat as unauthenticated.
    return null;
  }
}

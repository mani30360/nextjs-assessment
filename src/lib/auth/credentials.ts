import "server-only";
import type { AuthUser, LoginCredentials } from "@/types";

// Hardcoded demo account, as required by the assessment. Only ever evaluated on the server.
const DEMO_USER = {
  email: "admin@test.com",
  password: "admin123",
} as const;

export function validateCredentials({ email, password }: LoginCredentials): AuthUser | null {
  const matches =
    email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password;
  return matches ? { email: DEMO_USER.email } : null;
}

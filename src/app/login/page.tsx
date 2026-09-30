import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

const DEFAULT_REDIRECT = "/products";
const ALLOWED_REDIRECT = /^\/(products|cart)(\/[\w-]*)*$/;

interface LoginPageProps {
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams;
  // Only honour internal app paths to avoid an open redirect.
  const redirectTo = typeof from === "string" && ALLOWED_REDIRECT.test(from) ? from : DEFAULT_REDIRECT;

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="page-title">Sign in</h1>
        <p className="auth__hint">
          Demo account: <code>admin@test.com</code> / <code>admin123</code>
        </p>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthError, selectAuthStatus } from "@/store/selectors";
import { login } from "@/store/slices/authSlice";

interface LoginFormProps {
  /** Where to go after signing in (already validated by the page). */
  redirectTo: string;
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const serverError = useAppSelector(selectAuthError);
  const router = useRouter();

  const isSubmitting = status === "loading";
  const error = validationError ?? serverError;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setValidationError("Please enter both email and password.");
      return;
    }
    setValidationError(null);

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      router.replace(redirectTo);
      router.refresh();
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label htmlFor="email" className="form__label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input"
          autoComplete="email"
          placeholder="admin@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form__field">
        <label htmlFor="password" className="form__label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

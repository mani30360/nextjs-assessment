export interface AuthUser {
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthStatus = "idle" | "loading" | "failed";

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
}

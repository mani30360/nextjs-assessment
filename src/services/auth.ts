import type { AuthUser, LoginCredentials } from "@/types";
import { appApi } from "./api";

export function loginRequest(credentials: LoginCredentials) {
  return appApi.post<AuthUser>("/api/auth/login", credentials);
}

export function logoutRequest() {
  return appApi.post<void>("/api/auth/logout");
}

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiError } from "@/services/api";
import { loginRequest, logoutRequest } from "@/services/auth";
import type { AuthState, AuthUser, LoginCredentials } from "@/types";

export const initialAuthState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginRequest(credentials);
    } catch (error) {
      return rejectWithValue(
        error instanceof ApiError ? error.message : "Unable to sign in. Please try again.",
      );
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutRequest();
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to sign in. Please try again.";
      })
      .addCase(logout.fulfilled, () => initialAuthState);
  },
});

export default authSlice.reducer;

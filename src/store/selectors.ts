import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemQuantity = (state: RootState, productId: number) =>
  state.cart.items.find((item) => item.id === productId)?.quantity ?? 0;

// Totals are derived from the items on read (memoised) rather than stored in the slice.
export const selectCartTotalQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartTotalAmount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

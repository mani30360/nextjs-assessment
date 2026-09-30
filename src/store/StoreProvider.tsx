"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import type { AuthUser } from "@/types";
import { loadCart, saveCart } from "./cartStorage";
import { makeStore } from "./index";
import { initialAuthState } from "./slices/authSlice";
import { hydrateCart } from "./slices/cartSlice";

interface StoreProviderProps {
  /** Session user resolved on the server from the auth cookie. */
  initialUser: AuthUser | null;
  children: ReactNode;
}

export default function StoreProvider({ initialUser, children }: StoreProviderProps) {
  const [store] = useState(() =>
    makeStore({ auth: { ...initialAuthState, user: initialUser } }),
  );

  // Restore the cart after mount (localStorage is client-only, so doing it during
  // render would cause a hydration mismatch), then persist every change.
  useEffect(() => {
    store.dispatch(hydrateCart(loadCart()));

    let previousItems = store.getState().cart.items;
    return store.subscribe(() => {
      const { items } = store.getState().cart;
      if (items !== previousItems) {
        previousItems = items;
        saveCart(items);
      }
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}

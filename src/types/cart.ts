import type { Product } from "./product";

/** The product fields a cart line needs; captured when the item is added. */
export type CartProduct = Pick<Product, "id" | "title" | "price" | "thumbnail">;

export interface CartItem extends CartProduct {
  quantity: number;
}

/** Totals are derived from `items` via selectors, never stored. */
export interface CartState {
  items: CartItem[];
}

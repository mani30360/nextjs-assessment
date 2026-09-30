import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <>
      <h1 className="page-title">Your cart</h1>
      <CartView />
    </>
  );
}

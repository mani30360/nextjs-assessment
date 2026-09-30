"use client";

import Link from "next/link";
import StatusMessage from "@/components/ui/StatusMessage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from "@/store/selectors";
import { clearCart } from "@/store/slices/cartSlice";
import { formatPrice } from "@/utils/format";
import CartItemRow from "./CartItemRow";

export default function CartView() {
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalAmount = useAppSelector(selectCartTotalAmount);
  const dispatch = useAppDispatch();

  if (items.length === 0) {
    return (
      <StatusMessage
        title="Your cart is empty."
        description="Browse the catalogue and add something you like."
        action={
          <Link href="/products" className="btn btn--primary">
            Shop products
          </Link>
        }
      />
    );
  }

  return (
    <div className="cart">
      <ul className="cart__items">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </ul>

      <aside className="cart-summary" aria-label="Order summary">
        <h2 className="cart-summary__title">Summary</h2>
        <dl className="cart-summary__rows">
          <div>
            <dt>Total items</dt>
            <dd>{totalQuantity}</dd>
          </div>
          <div className="cart-summary__total">
            <dt>Total amount</dt>
            <dd>{formatPrice(totalAmount)}</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--ghost btn--danger btn--block" onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </aside>
    </div>
  );
}

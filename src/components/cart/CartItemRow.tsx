"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { removeFromCart } from "@/store/slices/cartSlice";
import type { CartItem } from "@/types";
import { formatPrice } from "@/utils/format";
import QuantityControl from "./QuantityControl";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  return (
    <li className="cart-item">
      <Link href={`/products/${item.id}`} className="cart-item__media">
        <Image src={item.thumbnail} alt={item.title} fill sizes="80px" className="cart-item__image" />
      </Link>

      <div className="cart-item__info">
        <Link href={`/products/${item.id}`} className="cart-item__title">
          {item.title}
        </Link>
        <span className="cart-item__unit">{formatPrice(item.price)} each</span>
      </div>

      <QuantityControl productId={item.id} productTitle={item.title} quantity={item.quantity} />

      <span className="cart-item__subtotal">{formatPrice(item.price * item.quantity)}</span>

      <button
        type="button"
        className="btn btn--ghost btn--danger"
        onClick={() => dispatch(removeFromCart(item.id))}
        aria-label={`Remove ${item.title} from cart`}
      >
        Remove
      </button>
    </li>
  );
}

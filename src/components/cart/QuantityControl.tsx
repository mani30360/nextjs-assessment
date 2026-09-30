"use client";

import { useAppDispatch } from "@/store/hooks";
import { decreaseQuantity, increaseQuantity } from "@/store/slices/cartSlice";

interface QuantityControlProps {
  productId: number;
  productTitle: string;
  quantity: number;
}

export default function QuantityControl({ productId, productTitle, quantity }: QuantityControlProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="qty" role="group" aria-label={`Quantity of ${productTitle}`}>
      <button
        type="button"
        className="qty__btn"
        aria-label={`Decrease quantity of ${productTitle}`}
        onClick={() => dispatch(decreaseQuantity(productId))}
      >
        −
      </button>
      <span className="qty__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="qty__btn"
        aria-label={`Increase quantity of ${productTitle}`}
        onClick={() => dispatch(increaseQuantity(productId))}
      >
        +
      </button>
    </div>
  );
}

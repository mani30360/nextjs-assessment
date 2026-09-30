"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItemQuantity } from "@/store/selectors";
import { addToCart } from "@/store/slices/cartSlice";
import type { CartProduct } from "@/types";
import QuantityControl from "@/components/cart/QuantityControl";

interface AddToCartButtonProps {
  product: CartProduct;
}

/** "Add to Cart" until the product is in the cart, then an inline quantity stepper. */
export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state) => selectCartItemQuantity(state, product.id));

  if (quantity > 0) {
    return <QuantityControl productId={product.id} productTitle={product.title} quantity={quantity} />;
  }

  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={() =>
        dispatch(
          addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
          }),
        )
      }
    >
      Add to Cart
    </button>
  );
}

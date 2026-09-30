import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/types";
import { formatPrice } from "@/utils/format";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__media">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
            className="product-card__image"
          />
        </div>
        <h2 className="product-card__title">{product.title}</h2>
      </Link>
      <p className="product-card__category">{product.category}</p>
      <div className="product-card__footer">
        <span className="price">{formatPrice(product.price)}</span>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

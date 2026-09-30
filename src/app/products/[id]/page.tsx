import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddToCartButton from "@/components/products/AddToCartButton";
import { ApiError } from "@/services/api";
import { getProductById } from "@/services/products";
import { formatPrice } from "@/utils/format";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Deduplicates the request between generateMetadata and the page render.
const loadProduct = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await getProductById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  return { title: product.title, description: product.description };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await loadProduct(id);

  return (
    <>
      <Link href="/products" className="back-link">
        ← Back to products
      </Link>

      <article className="product-detail">
        <div className="product-detail__media">
          <Image
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="product-detail__image"
          />
        </div>

        <div className="product-detail__info">
          <p className="product-detail__category">
            {product.category}
            {product.brand && ` · ${product.brand}`}
          </p>
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="rating" aria-label={`Rated ${product.rating} out of 5`}>
            <span aria-hidden="true">★</span> {product.rating.toFixed(1)} / 5
          </p>
          <p className="product-detail__price price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>
          <p className="product-detail__stock">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <AddToCartButton product={product} />
        </div>
      </article>
    </>
  );
}

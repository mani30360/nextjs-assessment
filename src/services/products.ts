import type { Product, ProductCategory, ProductListResponse } from "@/types";
import { productApi } from "./api";

const LIST_FIELDS = "title,category,price,rating,thumbnail";

export function searchProducts(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: query.trim(), limit: "0", select: LIST_FIELDS });
  return productApi.get<ProductListResponse>(`/products/search?${params}`, { signal });
}

export function getCategories(signal?: AbortSignal) {
  return productApi.get<ProductCategory[]>("/products/categories", { signal });
}

export function getProductById(id: string) {
  return productApi.get<Product>(`/products/${encodeURIComponent(id)}`);
}

"use client";

import { useCallback, useMemo, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import StatusMessage from "@/components/ui/StatusMessage";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFetch } from "@/hooks/useFetch";
import { getCategories, searchProducts } from "@/services/products";
import type { ProductSummary } from "@/types";
import ProductCard from "./ProductCard";
import ProductFilters, { type ProductFilterValues, type SortOption } from "./ProductFilters";

const INITIAL_FILTERS: ProductFilterValues = { query: "", category: "", sort: "relevance" };

const SORTERS: Record<Exclude<SortOption, "relevance">, (a: ProductSummary, b: ProductSummary) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
};

export default function ProductList() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const debouncedQuery = useDebouncedValue(filters.query);

  // Text search is done by the REST API; category and sort are applied locally on the results.
  const products = useFetch(
    useCallback((signal: AbortSignal) => searchProducts(debouncedQuery, signal), [debouncedQuery]),
  );
  const categories = useFetch(getCategories);

  const results = products.data?.products;
  const visibleProducts = useMemo(() => {
    if (!results) return [];
    const filtered = filters.category
      ? results.filter((p) => p.category === filters.category)
      : results;
    return filters.sort === "relevance" ? filtered : [...filtered].sort(SORTERS[filters.sort]);
  }, [results, filters.category, filters.sort]);

  const hasActiveFilters = filters.query !== "" || filters.category !== "";

  return (
    <>
      <ProductFilters
        values={filters}
        categories={categories.data ?? []}
        onChange={setFilters}
      />

      {products.status === "loading" && <Spinner label="Loading products…" />}

      {products.status === "error" && (
        <StatusMessage
          variant="error"
          title="We couldn't load products."
          description={products.error}
          action={
            <button type="button" className="btn btn--primary" onClick={products.retry}>
              Try again
            </button>
          }
        />
      )}

      {products.status === "success" && visibleProducts.length === 0 && (
        <StatusMessage
          title="No products found."
          description="Try a different search term or category."
          action={
            hasActiveFilters && (
              <button type="button" className="btn btn--ghost" onClick={() => setFilters(INITIAL_FILTERS)}>
                Clear filters
              </button>
            )
          }
        />
      )}

      {products.status === "success" && visibleProducts.length > 0 && (
        <>
          <p className="results-count">
            {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}
          </p>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

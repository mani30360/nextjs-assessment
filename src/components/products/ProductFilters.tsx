import type { ProductCategory } from "@/types";

export type SortOption = "relevance" | "price-asc" | "price-desc" | "rating-desc";

export interface ProductFilterValues {
  query: string;
  category: string;
  sort: SortOption;
}

interface ProductFiltersProps {
  values: ProductFilterValues;
  categories: ProductCategory[];
  onChange: (values: ProductFilterValues) => void;
}

export default function ProductFilters({ values, categories, onChange }: ProductFiltersProps) {
  return (
    <div className="filters" role="search">
      <input
        type="search"
        className="input filters__search"
        placeholder="Search products…"
        aria-label="Search products"
        value={values.query}
        onChange={(e) => onChange({ ...values, query: e.target.value })}
      />

      <select
        className="input"
        aria-label="Filter by category"
        value={values.category}
        onChange={(e) => onChange({ ...values, category: e.target.value })}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        className="input"
        aria-label="Sort products"
        value={values.sort}
        onChange={(e) => onChange({ ...values, sort: e.target.value as SortOption })}
      >
        <option value="relevance">Sort: Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Top Rated</option>
      </select>
    </div>
  );
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

/** Fields needed to render a product in the listing grid. */
export type ProductSummary = Pick<
  Product,
  "id" | "title" | "category" | "price" | "rating" | "thumbnail"
>;

export interface ProductListResponse {
  products: ProductSummary[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductCategory {
  slug: string;
  name: string;
}

import type { Metadata } from "next";
import ProductList from "@/components/products/ProductList";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <>
      <h1 className="page-title">Products</h1>
      <ProductList />
    </>
  );
}

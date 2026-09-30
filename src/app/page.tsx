import { redirect } from "next/navigation";

// The proxy sends "/" to /login or /products; this is a fallback if it ever doesn't run.
export default function HomePage() {
  redirect("/products");
}

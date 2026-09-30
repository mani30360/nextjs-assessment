import Link from "next/link";
import StatusMessage from "@/components/ui/StatusMessage";

export default function ProductNotFound() {
  return (
    <StatusMessage
      title="Product not found."
      description="It may have been removed, or the link is incorrect."
      action={
        <Link href="/products" className="btn btn--primary">
          Back to products
        </Link>
      }
    />
  );
}

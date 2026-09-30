"use client";

import Link from "next/link";
import StatusMessage from "@/components/ui/StatusMessage";

interface ProductErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ProductError({ error, retry }: ProductErrorProps) {
  return (
    <StatusMessage
      variant="error"
      title="We couldn't load this product."
      description={error.message}
      action={
        <div className="status__actions">
          <button type="button" className="btn btn--primary" onClick={retry}>
            Try again
          </button>
          <Link href="/products" className="btn btn--ghost">
            Back to products
          </Link>
        </div>
      }
    />
  );
}

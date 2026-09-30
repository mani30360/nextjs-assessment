"use client";

import Card from "@/components/common/Card";
import { use } from "react";
import { useRouter } from "next/navigation";
const React = require("react");

export default function ProductsPage() {
  return (
    <>
      <div className="grid">
        <h1 className="text-3xl font-bold underline">Products page</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card title="Product 1" description="This is product 1" />
        <Card title="Product 2" description="This is product 2" />
        <Card title="Product 3" description="This is product 3" />
        <Card title="Product 4" description="This is product 4" />
      </div>

    </>
  );
}



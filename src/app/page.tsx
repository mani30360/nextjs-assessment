import Card from "@/components/common/Card";

export default function HomePage() {
  return (
    <>
      <h1 className="page-title">Welcome</h1>
      <div className="grid">
        <Card title="Getting Started">
          <p>Edit src/app/page.tsx to begin.</p>
        </Card>
      </div>
    </>
  );
}

import Link from "next/link";

export default function NovelsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Novels</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Novel content will be added here */}
        <div className="p-4 text-muted-foreground text-center">
          Novel content coming soon...
          <Link href="/novels/1">Novel 1</Link>
        </div>
      </div>
    </div>
  );
}

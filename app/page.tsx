import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">AgriOS</h1>
      <p className="text-gray-600 mb-8">Land discovery, verification, and investor matching for Indian farmland.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/submit-land" className="border rounded p-6 hover:bg-gray-50">
          <p className="font-semibold">List Your Land</p>
          <p className="text-sm text-gray-600 mt-1">For land owners</p>
        </Link>
        <Link href="/admin" className="border rounded p-6 hover:bg-gray-50">
          <p className="font-semibold">Review Listings</p>
          <p className="text-sm text-gray-600 mt-1">For admin/engineer</p>
        </Link>
        <Link href="/invest" className="border rounded p-6 hover:bg-gray-50">
          <p className="font-semibold">Browse Land</p>
          <p className="text-sm text-gray-600 mt-1">For investors</p>
        </Link>
      </div>
    </main>
  );
}
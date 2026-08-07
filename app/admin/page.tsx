"use client";

import { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
type Listing = {
  id: string;
  location: string;
  areaAcres: number;
  waterSource: string | null;
  currentCrop: string | null;
  status: string;
  owner: { name: string | null; email: string };
};

export default function AdminPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    const res = await fetch("/api/land-listings");
    const data = await res.json();
    setListings(data.listings || []);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/land-listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes: notes[id] || "" }),
    });
    loadListings();
  }

  if (loading) return <main className="p-8">Loading...</main>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin: Land Listings</h1>

      {listings.length === 0 && <p>No submissions yet.</p>}

      <div className="space-y-6">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded p-4">
            <p className="font-semibold">{listing.location}</p>
            <p className="text-sm text-gray-600">
              {listing.areaAcres} acres · {listing.waterSource || "No water source listed"} · Owner: {listing.owner.name} ({listing.owner.email})
            </p>
            <p className="text-sm mt-1">
              Status: <span className="font-medium">{listing.status}</span>
            </p>

            {listing.status === "PENDING" && (
              <div className="mt-3 space-y-2">
                <textarea
                  placeholder="Inspection notes (optional)"
                  value={notes[listing.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [listing.id]: e.target.value })}
                  className="w-full border rounded p-2 text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(listing.id, "APPROVED")} className="bg-green-600 text-white px-4 py-1.5 rounded text-sm">
                    Approve
                  </button>
                  <button onClick={() => updateStatus(listing.id, "REJECTED")} className="bg-red-600 text-white px-4 py-1.5 rounded text-sm">
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
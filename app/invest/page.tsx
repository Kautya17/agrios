"use client";

import { useEffect, useState } from "react";

type Listing = {
  id: string;
  location: string;
  areaAcres: number;
  waterSource: string | null;
  currentCrop: string | null;
  expectedRevenue: number | null;
};

export default function InvestPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/land-listings?status=APPROVED")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      });
  }, []);

  async function submitInterest(id: string) {
    await fetch(`/api/land-listings/${id}/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitted({ ...submitted, [id]: true });
    setActiveId(null);
    setForm({ name: "", email: "", budget: "", message: "" });
  }

  if (loading) return <main className="p-8">Loading...</main>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Available Land</h1>

      {listings.length === 0 && <p>No approved listings yet.</p>}

      <div className="space-y-6">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded p-4">
            <p className="font-semibold">{listing.location}</p>
            <p className="text-sm text-gray-600">
              {listing.areaAcres} acres · {listing.waterSource || "Water source not listed"}
              {listing.currentCrop ? ` · Current crop: ${listing.currentCrop}` : ""}
            </p>

            {submitted[listing.id] ? (
              <p className="text-green-600 mt-2 text-sm">Interest submitted — you'll be contacted soon.</p>
            ) : activeId === listing.id ? (
              <div className="mt-3 space-y-2">
                <input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded p-2 text-sm" />
                <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded p-2 text-sm" />
                <input placeholder="Budget (INR)" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full border rounded p-2 text-sm" />
                <textarea placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border rounded p-2 text-sm" rows={2} />
                <button onClick={() => submitInterest(listing.id)} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">
                  Submit Interest
                </button>
              </div>
            ) : (
              <button onClick={() => setActiveId(listing.id)} className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded text-sm">
                Express Interest
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
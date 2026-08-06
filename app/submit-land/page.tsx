"use client";

import { useState } from "react";

export default function SubmitLandPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    areaAcres: "",
    waterSource: "",
    currentCrop: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/land-listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", location: "", areaAcres: "", waterSource: "", currentCrop: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Submit Your Land</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required className="w-full border rounded p-2" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded p-2" />
        <input name="location" placeholder="Land Location (village, district)" value={form.location} onChange={handleChange} required className="w-full border rounded p-2" />
        <input name="areaAcres" type="number" step="0.1" placeholder="Area (in acres)" value={form.areaAcres} onChange={handleChange} required className="w-full border rounded p-2" />
        <input name="waterSource" placeholder="Water Source (borewell, canal, river)" value={form.waterSource} onChange={handleChange} className="w-full border rounded p-2" />
        <input name="currentCrop" placeholder="Current Crop (if any)" value={form.currentCrop} onChange={handleChange} className="w-full border rounded p-2" />

        <button type="submit" disabled={status === "loading"} className="w-full bg-green-600 text-white rounded p-2 font-medium">
          {status === "loading" ? "Submitting..." : "Submit Land"}
        </button>

        {status === "success" && <p className="text-green-600">Submitted successfully!</p>}
        {status === "error" && <p className="text-red-600">Something went wrong. Try again.</p>}
      </form>
    </main>
  );
}
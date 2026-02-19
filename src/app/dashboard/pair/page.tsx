"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PairPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePair(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/pair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairing_code: code.toUpperCase().trim(), device_name: name.trim() || "Min uggla" }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Något gick fel");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/owl/${data.device_id}`);
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Parkoppla uggla</h1>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <p className="text-gray-600 mb-6">
          Ange parkopplingskoden som finns på kortet i ugglans förpackning.
        </p>

        <form onSubmit={handlePair} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Parkopplingskod
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="T.ex. UGGLA1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest uppercase focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ge ugglan ett namn (valfritt)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="T.ex. Emils uggla"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? "Parkopplar..." : "Parkoppla"}
          </button>
        </form>
      </div>
    </div>
  );
}

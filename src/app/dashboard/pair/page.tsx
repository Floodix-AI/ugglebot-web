"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wifi, PenLine } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NightSky } from "@/components/decorative/NightSky";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";

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
      body: JSON.stringify({
        pairing_code: code.toUpperCase().trim(),
        device_name: name.trim() || "Min Uggly",
      }),
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
      <PageHeader title="Väck din uggla till liv" backHref="/dashboard" />

      {/* Night scene with owl */}
      <div className="relative bg-gradient-to-b from-night-950 to-night-800 rounded-2xl overflow-hidden mb-6 h-52 flex flex-col items-center justify-center">
        <NightSky density="sparse" />
        <div className="relative z-10 flex flex-col items-center">
          <SpeechBubble direction="bottom" className="mb-3">
            <span className="text-sm">
              {loading ? "Parkopplar..." : "Hej! Jag väntar på att träffa dig!"}
            </span>
          </SpeechBubble>
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-full animate-pulse-glow"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,168,23,0.3) 0%, transparent 70%)",
              }}
            />
            <UgglyOwlAnimated size={120} />
          </div>
        </div>
      </div>

      <Card padding="lg">
        <p className="text-night-600 text-sm text-center mb-8">
          Ange parkopplingskoden som finns på kortet i din Ugglys förpackning.
        </p>

        <form onSubmit={handlePair} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-night-700 font-heading mb-1.5">
              Parkopplingskod
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="T.ex. UGGLA1"
              className="w-full px-4 py-3 bg-night-50 border-2 border-night-200 rounded-xl text-center text-2xl font-mono tracking-[0.3em] uppercase text-night-900 placeholder:text-night-300 focus:outline-none focus:ring-2 focus:ring-glow-500/50 focus:border-glow-500 focus:bg-white transition-all"
              maxLength={10}
              required
            />
          </div>

          <Input
            type="text"
            label="Ge din Uggly ett namn (valfritt)"
            icon={PenLine}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="T.ex. Emils Uggly"
            error={error || undefined}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading || !code.trim()}
            icon={Wifi}
            className="w-full"
            size="lg"
          >
            {loading ? "Parkopplar..." : "Parkoppla"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

"use client";

import { RefreshCw } from "lucide-react";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { NightSky } from "@/components/decorative/NightSky";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-night-950 via-night-900 to-night-950 p-8 relative overflow-hidden">
      <NightSky density="sparse" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <SpeechBubble direction="bottom" className="mb-3">
          <span className="text-sm">Oj! Något gick snett...</span>
        </SpeechBubble>

        <div style={{ filter: "drop-shadow(0 0 40px rgba(232,168,23,0.25))" }}>
          <UgglyOwlAnimated size={160} />
        </div>

        <h1 className="font-heading text-3xl font-bold text-white mt-8">
          Något gick fel
        </h1>
        <p className="text-night-300 mt-2">
          Ett oväntat fel inträffade. Försök igen eller gå tillbaka.
        </p>

        <div className="mt-8">
          <Button onClick={reset} icon={RefreshCw} size="lg">
            Försök igen
          </Button>
        </div>
      </div>
    </div>
  );
}

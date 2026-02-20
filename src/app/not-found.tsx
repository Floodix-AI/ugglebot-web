import Link from "next/link";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { NightSky } from "@/components/decorative/NightSky";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-night-950 via-night-900 to-night-950 p-8 relative overflow-hidden">
      <NightSky density="sparse" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <SpeechBubble direction="bottom" className="mb-3">
          <span className="text-sm">Uhu? Jag hittar inte den sidan...</span>
        </SpeechBubble>

        <div style={{ filter: "drop-shadow(0 0 40px rgba(232,168,23,0.25))" }}>
          <UgglyOwlAnimated size={160} />
        </div>

        <h1 className="font-heading text-5xl font-bold text-white mt-8">
          404
        </h1>
        <p className="text-night-300 mt-2 text-lg">
          Sidan du letar efter finns inte
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-glow-500 hover:bg-glow-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-glow-500/25"
          >
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}

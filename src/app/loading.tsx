import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div
        className="relative"
        style={{ filter: "drop-shadow(0 0 30px rgba(232,168,23,0.2))" }}
      >
        <UgglyOwlAnimated size={80} />
      </div>
      <p className="text-night-400 text-sm animate-pulse">Laddar...</p>
    </div>
  );
}

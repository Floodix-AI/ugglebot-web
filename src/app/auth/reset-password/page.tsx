"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Check } from "lucide-react";
import { UgglyLogo } from "@/components/brand/UgglyLogo";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { NightSky } from "@/components/decorative/NightSky";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";
import { MoonIllustration } from "@/components/decorative/MoonIllustration";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError("Kunde inte uppdatera lösenordet. Försök igen.");
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Brand Panel - Desktop */}
      <div className="hidden md:flex relative flex-col items-center justify-center bg-gradient-to-b from-night-950 via-night-900 to-night-950 p-12 overflow-hidden">
        <NightSky density="sparse" />
        <div className="absolute top-12 right-12">
          <MoonIllustration size={50} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <SpeechBubble direction="bottom" className="mb-3">
            <span className="text-sm">Välj ett nytt lösenord!</span>
          </SpeechBubble>
          <div style={{ filter: 'drop-shadow(0 0 40px rgba(232,168,23,0.25))' }}>
            <UgglyOwlAnimated size={180} />
          </div>
          <div className="mt-6">
            <UgglyLogo size="md" variant="color" onDark />
          </div>
          <p className="text-night-400 mt-2 text-sm">Din familjs smarta uggla</p>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden relative bg-gradient-to-b from-night-950 to-night-900 px-6 py-8 overflow-hidden flex flex-col items-center">
        <NightSky density="sparse" />
        <div className="relative z-10 flex flex-col items-center">
          <SpeechBubble direction="bottom" className="mb-2">
            <span className="text-xs">Välj ett nytt lösenord!</span>
          </SpeechBubble>
          <div style={{ filter: 'drop-shadow(0 0 30px rgba(232,168,23,0.2))' }}>
            <UgglyOwlAnimated size={120} />
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-8 bg-night-50">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center md:text-left">
            <h1 className="font-heading text-3xl font-bold text-night-900">
              Nytt lösenord
            </h1>
            <p className="text-night-400 mt-2">
              Ange ditt nya lösenord nedan
            </p>
            <div className="gold-divider mt-4" />
          </div>

          {success ? (
            <div className="bg-forest-50 border border-forest-400/30 rounded-xl p-4">
              <p className="text-sm text-forest-600 font-medium flex items-center gap-2">
                <Check className="h-4 w-4" />
                Lösenordet uppdaterat! Skickar dig till dashboarden...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                label="Nytt lösenord"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                required
                minLength={6}
              />

              <Input
                type="password"
                label="Bekräfta lösenord"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Skriv lösenordet igen"
                required
                error={error || undefined}
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Sparar..." : "Spara nytt lösenord"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { UgglyLogo } from "@/components/brand/UgglyLogo";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { NightSky } from "@/components/decorative/NightSky";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";
import { MoonIllustration } from "@/components/decorative/MoonIllustration";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      setError("Kunde inte skicka återställningslänk. Försök igen.");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
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
            <span className="text-sm">Ingen fara, jag hjälper dig!</span>
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
            <span className="text-xs">Ingen fara, jag hjälper dig!</span>
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
              Återställ lösenord
            </h1>
            <p className="text-night-400 mt-2">
              Ange din e-postadress så skickar vi en återställningslänk
            </p>
            <div className="gold-divider mt-4" />
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="bg-forest-50 border border-forest-400/30 rounded-xl p-4">
                <p className="text-sm text-forest-600 font-medium">
                  Vi har skickat en återställningslänk till {email}
                </p>
                <p className="text-xs text-forest-500 mt-1">
                  Kolla din inkorg (och skräpposten) och klicka på länken.
                </p>
              </div>
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-glow-700 hover:text-glow-500 font-semibold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Tillbaka till inloggning
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleReset} className="space-y-4">
                <Input
                  type="email"
                  label="E-post"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@email.se"
                  required
                  error={error || undefined}
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Skickar..." : "Skicka återställningslänk"}
                </Button>
              </form>

              <p className="text-center text-sm text-night-400">
                <Link
                  href="/login"
                  className="text-glow-700 hover:text-glow-500 font-semibold transition-colors"
                >
                  Tillbaka till inloggning
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

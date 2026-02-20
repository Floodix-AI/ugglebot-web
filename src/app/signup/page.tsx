"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import { UgglyLogo } from "@/components/brand/UgglyLogo";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { NightSky } from "@/components/decorative/NightSky";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";
import { MoonIllustration } from "@/components/decorative/MoonIllustration";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
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
            <span className="text-sm">Välkommen till Uggly-familjen!</span>
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
            <span className="text-xs">Välkommen till Uggly-familjen!</span>
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
              Skapa konto
            </h1>
            <p className="text-night-400 mt-2">
              Börja ditt barns äventyr med Uggly
            </p>
            <div className="gold-divider mt-4" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="text"
              label="Namn"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt namn"
              required
            />
            <Input
              type="email"
              label="E-post"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              required
            />
            <Input
              type="password"
              label="Lösenord"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minst 6 tecken"
              required
              minLength={6}
              error={error || undefined}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Skapar konto..." : "Skapa konto"}
            </Button>
          </form>

          <p className="text-center text-sm text-night-400">
            Har du redan ett konto?{" "}
            <Link
              href="/login"
              className="text-glow-700 hover:text-glow-500 font-semibold transition-colors"
            >
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

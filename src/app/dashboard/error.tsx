"use client";

import { RefreshCw } from "lucide-react";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { SpeechBubble } from "@/components/decorative/SpeechBubble";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto py-20">
      <Card padding="lg">
        <div className="flex flex-col items-center text-center space-y-6">
          <SpeechBubble direction="bottom">
            <span className="text-sm">Oj! Något gick snett...</span>
          </SpeechBubble>

          <UgglyOwlAnimated size={100} />

          <div>
            <h2 className="font-heading text-xl font-bold text-night-900">
              Något gick fel
            </h2>
            <p className="text-night-400 text-sm mt-1">
              Vi kunde inte ladda sidan. Försök igen.
            </p>
          </div>

          <Button onClick={reset} icon={RefreshCw}>
            Försök igen
          </Button>
        </div>
      </Card>
    </div>
  );
}

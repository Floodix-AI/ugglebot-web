"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import {
  Check,
  Smartphone,
  TrendingUp,
  PenLine,
  User,
  Volume2,
  Unlink,
  RefreshCw,
  Copy,
  Wifi,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { UgglyOwl } from "@/components/icons/UgglyOwl";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";
import { useToast } from "@/lib/toast-context";

interface DeviceSettings {
  child_name: string;
  child_age: number;
  language: string;
  voice_id: string;
  daily_budget_sek: number;
  session_max_minutes: number;
  idle_timeout_seconds: number;
  max_tokens: number;
}

interface Device {
  id: string;
  device_name: string;
  is_active: boolean;
  last_seen_at: string | null;
  paired_at: string | null;
}

interface UsageLog {
  date: string;
  total_sek: number;
  interactions: number;
  whisper_cost: number;
  claude_cost: number;
  elevenlabs_cost: number;
}

const VOICES = [
  { value: "zrHiDhphv9ZnVXBqCLjz", label: "Mimi (standard)" },
  { value: "EXAVITQu4vr4xnSDxMaL", label: "Sarah" },
  { value: "pFZP5JQG7iQjIQuC4Bku", label: "Lily" },
  { value: "onwK4e9ZLuTAKqWW03F9", label: "Daniel" },
];

export default function OwlSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();
  const deviceId = params.id as string;

  const [device, setDevice] = useState<Device | null>(null);
  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [usage, setUsage] = useState<UsageLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmUnpair, setConfirmUnpair] = useState(false);
  const [unpairing, setUnpairing] = useState(false);
  const [rotatingKey, setRotatingKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [requestingWifiSetup, setRequestingWifiSetup] = useState(false);
  const [wifiSetupRequested, setWifiSetupRequested] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: dev } = await supabase
        .from("devices")
        .select("id, device_name, is_active, last_seen_at, paired_at")
        .eq("id", deviceId)
        .single();

      if (!dev) {
        router.push("/dashboard");
        return;
      }
      setDevice(dev);

      const { data: s } = await supabase
        .from("device_settings")
        .select("*")
        .eq("device_id", deviceId)
        .single();

      if (s) {
        setSettings({
          child_name: s.child_name || "",
          child_age: s.child_age,
          language: s.language,
          voice_id: s.voice_id,
          daily_budget_sek: s.daily_budget_sek,
          session_max_minutes: s.session_max_minutes,
          idle_timeout_seconds: s.idle_timeout_seconds,
          max_tokens: s.max_tokens,
        });
      }

      const { data: logs } = await supabase
        .from("usage_logs")
        .select(
          "date, total_sek, interactions, whisper_cost, claude_cost, elevenlabs_cost"
        )
        .eq("device_id", deviceId)
        .order("date", { ascending: false })
        .limit(30);

      setUsage(logs || []);
      setLoading(false);
    }
    load();
  }, [deviceId, router, supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("device_settings")
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", deviceId);

    setSaving(false);
    if (error) {
      toast.error("Kunde inte spara inställningarna. Försök igen.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleDeviceNameSave(newName: string) {
    const { error } = await supabase
      .from("devices")
      .update({ device_name: newName })
      .eq("id", deviceId);

    if (error) {
      toast.error("Kunde inte spara enhetsnamnet.");
    }
  }

  async function handleUnpair() {
    if (!confirmUnpair) {
      setConfirmUnpair(true);
      return;
    }
    setUnpairing(true);
    try {
      const res = await fetch(`/api/devices/${deviceId}/unpair`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Kunde inte avkoppla enheten.");
        setUnpairing(false);
        return;
      }
      toast.success("Enheten har avkopplats.");
      router.push("/dashboard");
    } catch {
      toast.error("Något gick fel. Försök igen.");
      setUnpairing(false);
    }
  }

  async function handleWifiSetup() {
    setRequestingWifiSetup(true);
    try {
      const res = await fetch(`/api/devices/${deviceId}/wifi-setup`, {
        method: "POST",
      });
      if (!res.ok) {
        toast.error("Kunde inte starta WiFi-setup.");
        setRequestingWifiSetup(false);
        return;
      }
      setWifiSetupRequested(true);
      toast.success("WiFi-setup begärd! Uggly går in i setup-läge.");
    } catch {
      toast.error("Något gick fel. Försök igen.");
    }
    setRequestingWifiSetup(false);
  }

  async function handleRotateKey() {
    setRotatingKey(true);
    try {
      const res = await fetch(`/api/devices/${deviceId}/rotate-key`, {
        method: "POST",
      });
      if (!res.ok) {
        toast.error("Kunde inte rotera API-nyckeln.");
        setRotatingKey(false);
        return;
      }
      const data = await res.json();
      setNewApiKey(data.api_key);
      toast.success("API-nyckeln har roterats.");
    } catch {
      toast.error("Något gick fel. Försök igen.");
    }
    setRotatingKey(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{
              background:
                "radial-gradient(circle, rgba(232,168,23,0.3) 0%, transparent 70%)",
            }}
          />
          <UgglyOwlAnimated size={80} />
        </div>
        <p className="text-night-400 text-sm">Laddar din uggla...</p>
      </div>
    );
  }

  if (!device || !settings) {
    return (
      <p className="text-night-400 text-center py-20">
        Din Uggly hittades inte.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/dashboard"
        title={device.device_name}
        badge={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-night-50 flex items-center justify-center">
              <UgglyOwl size={22} variant="color" />
            </div>
            <Badge variant={device.is_active ? "success" : "neutral"}>
              {device.is_active ? "Aktiv" : "Inaktiv"}
            </Badge>
          </div>
        }
      />

      {/* Settings Form */}
      <form onSubmit={handleSave}>
        <Card padding="lg">
          <div className="space-y-8">
            <h2 className="font-heading text-xl font-bold text-night-900">
              Ugglys personlighet
            </h2>

            {/* Device name */}
            <Input
              label="Ugglys namn"
              icon={PenLine}
              value={device.device_name}
              onChange={(e) =>
                setDevice({ ...device, device_name: e.target.value })
              }
              onBlur={(e) => handleDeviceNameSave(e.target.value)}
            />

            {/* Voice */}
            <Select
              label="Röst"
              icon={Volume2}
              options={VOICES}
              value={settings.voice_id}
              onChange={(e) =>
                setSettings({ ...settings, voice_id: e.target.value })
              }
            />

            {/* Child profile section */}
            <div className="space-y-6">
              <div className="gold-divider" />
              <h3 className="text-sm font-semibold text-night-500 uppercase tracking-wider">
                Vem pratar ugglan med?
              </h3>

              <Input
                label="Barnets namn"
                icon={User}
                value={settings.child_name}
                onChange={(e) =>
                  setSettings({ ...settings, child_name: e.target.value })
                }
                placeholder="T.ex. Emil"
              />

              <Slider
                label="Barnets ålder"
                value={settings.child_age}
                onChange={(v) => setSettings({ ...settings, child_age: v })}
                min={4}
                max={10}
                unit="år"
              />
            </div>

            {/* Limits section */}
            <div className="space-y-6">
              <div className="gold-divider" />
              <h3 className="text-sm font-semibold text-night-500 uppercase tracking-wider">
                Dagliga gränser
              </h3>

              <Slider
                label="Daglig budget"
                value={settings.daily_budget_sek}
                onChange={(v) =>
                  setSettings({ ...settings, daily_budget_sek: v })
                }
                min={1}
                max={20}
                step={0.5}
                unit="kr"
              />

              <Slider
                label="Max samtalslängd"
                value={settings.session_max_minutes}
                onChange={(v) =>
                  setSettings({ ...settings, session_max_minutes: v })
                }
                min={5}
                max={60}
                step={5}
                unit="min"
              />
            </div>

            {/* Save */}
            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" loading={saving} icon={Check}>
                {saving ? "Sparar..." : "Spara inställningar"}
              </Button>
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Sparat!
                </span>
              )}
            </div>
          </div>
        </Card>
      </form>

      {/* Usage History */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-night-400" />
          <h2 className="font-heading text-xl font-bold text-night-900">
            Kostnadshistorik
          </h2>
        </div>

        {usage.length === 0 ? (
          <p className="text-night-400 text-sm">
            Inga samtal registrerade ännu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 pr-4 text-xs font-medium text-night-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium text-night-500 uppercase tracking-wider">
                    Samtal
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium text-night-500 uppercase tracking-wider">
                    Whisper
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium text-night-500 uppercase tracking-wider">
                    Claude
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium text-night-500 uppercase tracking-wider">
                    ElevenLabs
                  </th>
                  <th className="pb-3 text-xs font-medium text-night-500 uppercase tracking-wider">
                    Totalt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-night-50">
                {usage.map((log) => (
                  <tr
                    key={log.date}
                    className="hover:bg-night-50/50 transition-colors"
                  >
                    <td className="py-3 pr-4 text-night-700">{log.date}</td>
                    <td className="py-3 pr-4 text-night-600">
                      {log.interactions}
                    </td>
                    <td className="py-3 pr-4 text-night-400">
                      {log.whisper_cost.toFixed(2)} kr
                    </td>
                    <td className="py-3 pr-4 text-night-400">
                      {log.claude_cost.toFixed(2)} kr
                    </td>
                    <td className="py-3 pr-4 text-night-400">
                      {log.elevenlabs_cost.toFixed(2)} kr
                    </td>
                    <td className="py-3 font-semibold text-night-900">
                      {log.total_sek.toFixed(2)} kr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Device Information */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-night-400" />
          <h2 className="font-heading text-lg font-bold text-night-900">
            Enhetsinformation
          </h2>
        </div>
        <div className="space-y-2 text-sm text-night-400">
          <p>
            Enhet-ID:{" "}
            <span className="font-mono text-xs bg-night-100 px-2 py-0.5 rounded text-night-600">
              {device.id}
            </span>
          </p>
          {device.paired_at && (
            <p>
              Parkopplad:{" "}
              {new Date(device.paired_at).toLocaleString("sv-SE")}
            </p>
          )}
          {device.last_seen_at && (
            <p>
              Senast online:{" "}
              {new Date(device.last_seen_at).toLocaleString("sv-SE")}
            </p>
          )}
        </div>

        <div className="gold-divider mt-4 mb-4" />

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={rotatingKey}
            onClick={handleRotateKey}
          >
            Rotera API-nyckel
          </Button>
        </div>

        {newApiKey && (
          <div className="mt-3 bg-glow-50 border border-glow-400/30 rounded-xl p-3">
            <p className="text-xs text-glow-700 font-medium mb-1">
              Ny API-nyckel (visas bara en gång):
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-glow-200 text-night-700 flex-1 break-all">
                {newApiKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newApiKey);
                  toast.success("API-nyckel kopierad!");
                }}
                className="text-glow-600 hover:text-glow-500 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* WiFi */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="h-5 w-5 text-night-400" />
          <h2 className="font-heading text-lg font-bold text-night-900">
            WiFi
          </h2>
        </div>

        {wifiSetupRequested ? (
          <div className="space-y-3">
            <div className="bg-glow-50 border border-glow-400/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-glow-700 mb-2">
                WiFi-setup begärd!
              </p>
              <p className="text-sm text-night-500">
                Nästa gång din Uggly startar om eller hämtar inställningar går
                den in i setup-läge. Anslut din telefon till Ugglys
                WiFi-nätverk och följ instruktionerna.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-night-400">
              Byt WiFi-nätverk om du har flyttat eller bytt router.
              Uggly skapar ett eget WiFi-nätverk som du ansluter till med
              din telefon.
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={Wifi}
              loading={requestingWifiSetup}
              onClick={handleWifiSetup}
            >
              Byt WiFi-nätverk
            </Button>
          </div>
        )}
      </Card>

      {/* Danger Zone */}
      <Card padding="md">
        <h2 className="font-heading text-lg font-bold text-night-900 mb-2">
          Avkoppla Uggly
        </h2>
        <p className="text-sm text-night-400 mb-4">
          Avkopplar enheten från ditt konto. All användningsdata raderas.
          Enheten kan parkopplas igen med sin kod.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            size="sm"
            icon={Unlink}
            loading={unpairing}
            onClick={handleUnpair}
          >
            {unpairing
              ? "Avkopplar..."
              : confirmUnpair
                ? "Tryck igen för att bekräfta"
                : "Avkoppla Uggly"}
          </Button>
          {confirmUnpair && !unpairing && (
            <button
              onClick={() => setConfirmUnpair(false)}
              className="text-sm text-night-400 hover:text-night-600 transition-colors"
            >
              Avbryt
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

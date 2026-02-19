"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  { id: "zrHiDhphv9ZnVXBqCLjz", name: "Mimi (standard)" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel" },
];

export default function OwlSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const deviceId = params.id as string;

  const [device, setDevice] = useState<Device | null>(null);
  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [usage, setUsage] = useState<UsageLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

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
        .select("date, total_sek, interactions, whisper_cost, claude_cost, elevenlabs_cost")
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

    await supabase
      .from("device_settings")
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", deviceId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleDeviceNameSave(newName: string) {
    await supabase
      .from("devices")
      .update({ device_name: newName })
      .eq("id", deviceId);
  }

  if (loading) {
    return <p className="text-gray-500">Laddar...</p>;
  }

  if (!device || !settings) {
    return <p className="text-gray-500">Din Uggly hittades inte.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-amber-600 hover:text-amber-800">
          &larr; Tillbaka
        </Link>
        <h1 className="text-3xl font-bold text-amber-900">{device.device_name}</h1>
        <span className={`text-xs px-2 py-1 rounded-full ${
          device.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}>
          {device.is_active ? "Aktiv" : "Inaktiv"}
        </span>
      </div>

      {/* Inställningsformulär */}
      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold text-amber-900">Inställningar</h2>

        {/* Enhetens namn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ugglys namn</label>
          <input
            type="text"
            value={device.device_name}
            onChange={(e) => setDevice({ ...device, device_name: e.target.value })}
            onBlur={(e) => handleDeviceNameSave(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Barnets namn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barnets namn</label>
          <input
            type="text"
            value={settings.child_name}
            onChange={(e) => setSettings({ ...settings, child_name: e.target.value })}
            placeholder="T.ex. Emil"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Barnets ålder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Barnets ålder: <span className="font-bold text-amber-700">{settings.child_age} år</span>
          </label>
          <input
            type="range"
            min={4}
            max={10}
            value={settings.child_age}
            onChange={(e) => setSettings({ ...settings, child_age: parseInt(e.target.value) })}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4 år</span>
            <span>10 år</span>
          </div>
        </div>

        {/* Röst */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Röst</label>
          <select
            value={settings.voice_id}
            onChange={(e) => setSettings({ ...settings, voice_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Daglig budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daglig budget: <span className="font-bold text-amber-700">{settings.daily_budget_sek} kr</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={settings.daily_budget_sek}
            onChange={(e) => setSettings({ ...settings, daily_budget_sek: parseFloat(e.target.value) })}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 kr</span>
            <span>20 kr</span>
          </div>
        </div>

        {/* Session-timeout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max samtalslängd: <span className="font-bold text-amber-700">{settings.session_max_minutes} min</span>
          </label>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={settings.session_max_minutes}
            onChange={(e) => setSettings({ ...settings, session_max_minutes: parseInt(e.target.value) })}
            className="w-full accent-amber-600"
          />
        </div>

        {/* Spara-knapp */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 font-medium"
          >
            {saving ? "Sparar..." : "Spara inställningar"}
          </button>
          {saved && <span className="text-green-600 text-sm">Sparat!</span>}
        </div>
      </form>

      {/* Kostnadshistorik */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-amber-900 mb-4">Kostnadshistorik</h2>

        {usage.length === 0 ? (
          <p className="text-gray-500">Inga samtal registrerade ännu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-4">Datum</th>
                  <th className="pb-2 pr-4">Samtal</th>
                  <th className="pb-2 pr-4">Whisper</th>
                  <th className="pb-2 pr-4">Claude</th>
                  <th className="pb-2 pr-4">ElevenLabs</th>
                  <th className="pb-2">Totalt</th>
                </tr>
              </thead>
              <tbody>
                {usage.map((log) => (
                  <tr key={log.date} className="border-b border-gray-50">
                    <td className="py-2 pr-4">{log.date}</td>
                    <td className="py-2 pr-4">{log.interactions}</td>
                    <td className="py-2 pr-4">{log.whisper_cost.toFixed(2)} kr</td>
                    <td className="py-2 pr-4">{log.claude_cost.toFixed(2)} kr</td>
                    <td className="py-2 pr-4">{log.elevenlabs_cost.toFixed(2)} kr</td>
                    <td className="py-2 font-medium">{log.total_sek.toFixed(2)} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enhetsinformation */}
      <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-500">
        <h2 className="text-xl font-semibold text-amber-900 mb-4">Enhetsinformation</h2>
        <div className="space-y-1">
          <p>Enhet-ID: <span className="font-mono">{device.id}</span></p>
          {device.paired_at && <p>Parkopplad: {new Date(device.paired_at).toLocaleString("sv-SE")}</p>}
          {device.last_seen_at && <p>Senast online: {new Date(device.last_seen_at).toLocaleString("sv-SE")}</p>}
        </div>
      </div>
    </div>
  );
}

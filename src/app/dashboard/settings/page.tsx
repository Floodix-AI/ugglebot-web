"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, Check, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Name
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Delete
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setName(profile?.name || "");
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ name: name.trim() })
      .eq("id", user.id);

    setNameSaving(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 3000);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (newPassword.length < 6) {
      setPasswordError("Lösenordet måste vara minst 6 tecken.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Lösenorden matchar inte.");
      return;
    }

    setPasswordSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
      setPasswordSaving(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaving(false);
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await fetch("/api/account", { method: "DELETE" });
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-night-200 border-t-glow-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <PageHeader title="Kontoinställningar" backHref="/dashboard" />

      {/* Profile */}
      <Card padding="lg">
        <h2 className="font-heading text-lg font-bold text-night-900 mb-6">
          Profil
        </h2>
        <form onSubmit={handleNameSave} className="space-y-4">
          <Input
            label="Namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ditt namn"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-night-700 font-heading">
              E-post
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-night-50 border border-night-200 rounded-xl text-night-500 text-sm">
              <Mail className="h-4 w-4 text-night-400" />
              {email}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" loading={nameSaving} size="sm" icon={Check}>
              {nameSaving ? "Sparar..." : "Spara"}
            </Button>
            {nameSaved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Sparat!
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Password */}
      <Card padding="lg">
        <h2 className="font-heading text-lg font-bold text-night-900 mb-6">
          Byt lösenord
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Nytt lösenord"
            icon={Lock}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minst 6 tecken"
          />

          <Input
            label="Bekräfta lösenord"
            icon={Lock}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Skriv lösenordet igen"
            error={passwordError || undefined}
          />

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              loading={passwordSaving}
              size="sm"
              icon={Check}
              disabled={!newPassword || !confirmPassword}
            >
              {passwordSaving ? "Sparar..." : "Byt lösenord"}
            </Button>
            {passwordSaved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Lösenord uppdaterat!
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Delete account */}
      <Card padding="lg">
        <h2 className="font-heading text-lg font-bold text-night-900 mb-2">
          Ta bort konto
        </h2>
        <p className="text-sm text-night-400 mb-6">
          Detta raderar ditt konto, alla Ugglys och all data permanent. Denna
          åtgärd kan inte ångras.
        </p>
        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          loading={deleting}
          icon={Trash2}
          size="sm"
        >
          {deleting
            ? "Tar bort..."
            : confirmDelete
              ? "Tryck igen för att bekräfta"
              : "Ta bort mitt konto"}
        </Button>
        {confirmDelete && !deleting && (
          <button
            onClick={() => setConfirmDelete(false)}
            className="ml-3 text-sm text-night-400 hover:text-night-600 transition-colors"
          >
            Avbryt
          </button>
        )}
      </Card>
    </div>
  );
}

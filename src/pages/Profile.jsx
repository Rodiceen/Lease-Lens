import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { JURISDICTIONS } from "@/lib/leaseOptions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Scale, Loader2, Check, ChevronDown } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].label);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    base44
      .auth.me()
      .then((u) => {
        setUser(u);
        const dj = u?.data?.default_jurisdiction;
        if (dj) setJurisdiction(dj);
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ default_jurisdiction: jurisdiction });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and default analysis preferences.</p>
      </div>

      {/* Account */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Account</h2>
        {loadingUser ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {user?.email || "—"}
              </div>
              <p className="text-[11px] text-muted-foreground">Your email is managed by the platform and can't be changed here.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Password</Label>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" /> ••••••••
                </span>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Reset password
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Default jurisdiction */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Default jurisdiction</h2>
        <p className="text-xs text-muted-foreground">
          We'll pre-select this country when you analyze a new lease. You can still change it per analysis.
        </p>
        <div className="space-y-2">
          <Label htmlFor="default-jurisdiction" className="text-xs text-muted-foreground">
            Country / jurisdiction
          </Label>
          <div className="relative">
            <Scale className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              id="default-jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {JURISDICTIONS.map((j) => (
                <option key={j.label} value={j.label}>
                  {j.flag}  {j.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved" : saving ? "Saving…" : "Save default"}
        </Button>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { FileText, Upload, ClipboardPaste, Loader2, Scale, ShieldAlert, Building2, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import { LEASE_TYPES, LANGUAGES, JURISDICTIONS, getJurisdiction, getLanguage } from "@/lib/leaseOptions";

export default function LeaseInput({ onResults }) {
  const [mode, setMode] = useState("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [leaseType, setLeaseType] = useState(LEASE_TYPES[0]);
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].label);
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth.me().then((u) => {
      const dj = u?.data?.default_jurisdiction;
      if (dj) setJurisdiction(dj);
    }).catch(() => {});
  }, []);

  const jur = getJurisdiction(jurisdiction);
  const lang = getLanguage(language);

  const handleAnalyze = async () => {
    setError("");
    if (mode === "paste" && !text.trim()) {
      setError("Please paste your lease text first.");
      return;
    }
    if (mode === "upload" && !file) {
      setError("Please upload a lease document first.");
      return;
    }
    setLoading(true);
    try {
      let file_url = null;
      if (mode === "upload" && file) {
        const res = await base44.integrations.Core.UploadPublicFile({ file });
        file_url = res.file_url;
      }
      const response = await base44.functions.invoke("analyzeLease", {
        text: mode === "paste" ? text : null,
        file_url,
        jurisdiction,
        lease_type: leaseType,
        language: lang.code,
      });
      onResults(response.data);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Something went wrong while analyzing the lease.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  // group jurisdictions by region for optgroups
  const grouped = JURISDICTIONS.reduce((acc, j) => {
    (acc[j.group] = acc[j.group] || []).push(j);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Mode tabs */}
        <div className="grid grid-cols-2 gap-1 p-1.5 bg-muted/40">
          <button
            onClick={() => setMode("paste")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              mode === "paste" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ClipboardPaste className="w-4 h-4" />
            Paste text
          </button>
          <button
            onClick={() => setMode("upload")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              mode === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="w-4 h-4" />
            Upload file
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {mode === "paste" ? (
            <div className="space-y-2">
              <Label htmlFor="lease-text" className="text-sm font-medium">
                Lease text
              </Label>
              <Textarea
                id="lease-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full text of your lease agreement here..."
                className="min-h-[220px] resize-y font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                {text.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lease document</Label>
              <label
                htmlFor="lease-file"
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 px-6 text-center cursor-pointer transition-colors",
                  dragActive ? "border-foreground bg-muted/50 scale-[1.01]" : "border-border hover:border-foreground/30 hover:bg-muted/30"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                {fileName ? (
                  <div>
                    <p className="text-sm font-medium text-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Click to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PDF, DOCX, TXT or image</p>
                  </div>
                )}
              </label>
              <input
                id="lease-file"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.html"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setFileName(f.name);
                  }
                }}
              />
            </div>
          )}

          {/* Lease type + Language row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lease-type" className="text-sm font-medium">
                Lease type
              </Label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  id="lease-type"
                  value={leaseType}
                  onChange={(e) => setLeaseType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {LEASE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Output language
              </Label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag}  {l.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Jurisdiction + flag */}
          <div className="space-y-2">
            <Label htmlFor="jurisdiction" className="text-sm font-medium">
              Country / jurisdiction of the lease
            </Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Scale className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  id="jurisdiction"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(grouped).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((j) => (
                        <option key={j.label} value={j.label}>{j.flag}  {j.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg border border-border bg-muted/40 text-2xl"
                title={jur.label}
              >
                <span className="leading-none">{jur.flag}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              We map flagged clauses to the tenant-rights laws of this location.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={loading} className="w-full h-12 text-base font-medium">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing lease...
              </>
            ) : (
              `Analyze my ${leaseType.toLowerCase().replace(" / not sure", "")}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
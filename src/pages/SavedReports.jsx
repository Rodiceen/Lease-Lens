import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getJurisdiction } from "@/lib/leaseOptions";
import { generateReportPdf } from "@/lib/generateReportPdf";
import { Loader2, FileText, Download, Trash2, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

function scoreBadge(score) {
  if (score >= 70) return "bg-red-50 text-red-700 border-red-200";
  if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default function SavedReports() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.LeaseAnalysis.list("-created_date", 100)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saved report? This can't be undone.")) return;
    setBusy(id);
    try {
      await base44.entities.LeaseAnalysis.delete(id);
      toast({ title: "Report deleted" });
      load();
    } catch (e) {
      toast({ title: "Could not delete", description: e.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const handleDownload = (it) => {
    try {
      generateReportPdf(it);
      toast({ title: "Report downloaded" });
    } catch (e) {
      toast({ title: "Could not generate PDF", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View, download as PDF, or delete your saved lease analysis reports.
        </p>
      </div>

      {!items || items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No saved reports yet</p>
          <p className="text-xs text-muted-foreground mt-1">Analyze a lease to generate your first report.</p>
          <Link to="/" className="inline-flex mt-4 text-sm font-medium text-primary hover:underline">
            Analyze a lease →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const jur = getJurisdiction(it.jurisdiction);
            const flags = (it.clauses || []).length;
            return (
              <div key={it.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl leading-none shrink-0">{jur.flag}</div>
                  <Link to={`/analysis/${it.id}`} className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate hover:underline">
                      {it.title || "Untitled lease"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {it.jurisdiction} · {it.lease_type || "Lease"} · {flags} flag{flags === 1 ? "" : "s"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {new Date(it.created_date).toLocaleDateString()}
                    </p>
                  </Link>
                  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium shrink-0", scoreBadge(Number(it.overall_risk_score) || 0))}>
                    {Math.round(Number(it.overall_risk_score) || 0)}/100
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => handleDownload(it)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                  <Link
                    to={`/analysis/${it.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <FileWarning className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(it.id)}
                    disabled={busy === it.id}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    {busy === it.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
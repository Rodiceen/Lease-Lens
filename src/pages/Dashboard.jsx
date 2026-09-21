import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { getJurisdiction } from "@/lib/leaseOptions";
import { Loader2, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function scoreBadge(score) {
  if (score >= 70) return { label: "High", cls: "bg-red-50 text-red-700 border-red-200" };
  if (score >= 40) return { label: "Moderate", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Low", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

export default function Dashboard() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.LeaseAnalysis.list("-created_date", 50)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-2xl font-bold tracking-tight">Lease dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A summary of every lease you've analyzed, with its overall risk score.
        </p>
      </div>

      {!items || items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No analyses yet</p>
          <p className="text-xs text-muted-foreground mt-1">Once you analyze a lease, it'll appear here.</p>
          <Link to="/" className="inline-flex mt-4 text-sm font-medium text-primary hover:underline">
            Analyze a lease →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const jur = getJurisdiction(it.jurisdiction);
            const sb = scoreBadge(Number(it.overall_risk_score) || 0);
            const flags = (it.clauses || []).length;
            return (
              <Link
                key={it.id}
                to={`/analysis/${it.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl leading-none shrink-0">{jur.flag}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{it.title || "Untitled lease"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {it.jurisdiction} · {it.lease_type || "Lease"} · {flags} flag{flags === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", sb.cls)}>
                    {Math.round(Number(it.overall_risk_score) || 0)}/100
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {new Date(it.created_date).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
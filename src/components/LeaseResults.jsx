import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, RotateCcw, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClauseCard from "./ClauseCard";
import { cn } from "@/lib/utils";
import { getJurisdiction, getLanguage } from "@/lib/leaseOptions";

function scoreColor(score) {
  if (score >= 70) return { text: "text-red-600", ring: "text-red-500", label: "High risk" };
  if (score >= 40) return { text: "text-amber-600", ring: "text-amber-500", label: "Moderate risk" };
  return { text: "text-emerald-600", ring: "text-emerald-500", label: "Low risk" };
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export default function LeaseResults({ results, onReset }) {
  const { summary, overall_risk_score, jurisdiction, clauses } = results;
  const jur = getJurisdiction(jurisdiction);
  const lang = getLanguage(results.language);
  const score = Number(overall_risk_score) || 0;
  const sc = scoreColor(score);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => ({
    all: clauses.length,
    high: clauses.filter((c) => c.risk_level === "high").length,
    medium: clauses.filter((c) => c.risk_level === "medium").length,
    low: clauses.filter((c) => c.risk_level === "low").length,
  }), [clauses]);

  const filtered = filter === "all" ? clauses : clauses.filter((c) => c.risk_level === filter);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Score header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-muted" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                stroke="currentColor"
                className={sc.ring}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.9s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-3xl font-bold", sc.text)}>{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <ShieldCheck className={cn("w-5 h-5", sc.text)} />
              <span className={cn("text-lg font-semibold", sc.text)}>{sc.label}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{summary}</p>
            <p className="text-xs text-muted-foreground mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base leading-none">{jur.flag}</span>
                <span className="font-medium text-foreground">{jurisdiction}</span>
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span>{clauses.length} flag{clauses.length === 1 ? "" : "s"}</span>
              {results.lease_type && (<><span className="text-muted-foreground/50">·</span><span>{results.lease_type}</span></>)}
              {results.language && results.language !== "English" && (<><span className="text-muted-foreground/50">·</span><span>{lang.flag} {lang.label}</span></>)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Clauses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-1">
            <FileSearch className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Flagged clauses {clauses.length > 0 && `(${clauses.length})`}
            </h2>
          </div>

          {clauses.length > 0 && (
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              {FILTERS.map((f) => {
                const active = filter === f.key;
                const disabled = counts[f.key] === 0;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    disabled={disabled}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                      active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                      disabled && "opacity-40 cursor-not-allowed hover:text-muted-foreground"
                    )}
                  >
                    {f.label}
                    <span className={cn("ml-1", active ? "text-background/70" : "text-muted-foreground/70")}>
                      {counts[f.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {clauses.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
            <p className="text-sm font-medium text-foreground">No dangerous or non-standard clauses found</p>
            <p className="text-xs text-muted-foreground mt-1">This lease appears fair under {jurisdiction} tenant law.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No {filter}-risk clauses in this lease.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((c, i) => (
              <ClauseCard key={i} clause={c} index={i} defaultOpen={c.risk_level === "high"} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Analyze another lease
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground max-w-xl mx-auto leading-relaxed">
        This analysis is generated by AI and is for general information only. It is not legal advice. For binding guidance, consult a qualified tenant-rights attorney in {jurisdiction}.
      </p>
    </div>
  );
}
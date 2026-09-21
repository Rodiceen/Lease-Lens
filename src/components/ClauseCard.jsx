import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  Copy,
  Check,
  Scale,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RISK = {
  high: {
    label: "High risk",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    accent: "border-l-red-500",
    Icon: AlertTriangle,
  },
  medium: {
    label: "Medium risk",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    accent: "border-l-amber-500",
    Icon: AlertCircle,
  },
  low: {
    label: "Low risk",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    accent: "border-l-emerald-500",
    Icon: Info,
  },
};

export default function ClauseCard({ clause, index, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const r = RISK[clause.risk_level] || RISK.medium;
  const Icon = r.Icon;

  const copyClause = () => {
    navigator.clipboard?.writeText(clause.clause_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
      className={cn(
        "group rounded-xl border border-border border-l-4 bg-card shadow-sm hover:shadow-md transition-shadow",
        r.accent
      )}
    >
      {/* Header — clickable to toggle */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
        className="w-full text-left p-5 sm:p-6 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <span className={cn("w-1.5 h-1.5 rounded-full", r.dot)} />
              {clause.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", r.badge)}>
              <Icon className="w-3.5 h-3.5" />
              {r.label}
            </span>
            <ChevronDown
              className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
            />
          </div>
        </div>

        <blockquote className="mt-3.5 border-l-2 border-border pl-3.5 text-sm text-muted-foreground italic leading-relaxed line-clamp-3">
          {clause.clause_text}
        </blockquote>
        <p className="mt-3 text-sm text-foreground leading-relaxed">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plain language: </span>
          {clause.plain_language}
        </p>
      </div>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 space-y-3.5">
              <div className="border-t border-border pt-4 space-y-3.5">
                <Field label="Why it matters" value={clause.why_it_matters} />

                <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 border border-slate-200 p-3.5">
                  <Scale className="w-4 h-4 mt-0.5 shrink-0 text-slate-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-0.5">Relevant law</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{clause.legal_mapping}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-foreground/5 p-3.5">
                  <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">Recommendation</p>
                    <p className="text-sm text-foreground leading-relaxed">{clause.recommendation}</p>
                  </div>
                </div>

                <button
                  onClick={copyClause}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy clause text
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}
import React, { useState } from "react";
import { ScanText, ShieldCheck, FileSearch, Scale } from "lucide-react";
import LeaseInput from "@/components/LeaseInput";
import LeaseResults from "@/components/LeaseResults";
import LivelyBackground from "@/components/LivelyBackground";
import { base44 } from "@/api/base44Client";

export default function Home() {
  const [results, setResults] = useState(null);

  const handleResults = async (res) => {
    setResults(res);
    try {
      await base44.entities.LeaseAnalysis.create({
        title: `${res.lease_type || "Lease"} — ${res.jurisdiction}`,
        summary: res.summary,
        overall_risk_score: res.overall_risk_score,
        jurisdiction: res.jurisdiction,
        lease_type: res.lease_type,
        language: res.language,
        clauses: res.clauses || [],
      });
    } catch (e) {
      /* save is best-effort; results still display */
    }
  };

  return (
    <>
      <LivelyBackground />
      {!results ? (
          <div className="space-y-10">
            {/* Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                Know what you're signing
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                Decode your lease before you sign it
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Paste or upload your lease. We flag dangerous and non-standard clauses, translate the legalese into plain language, and map each one to your local tenant-rights laws.
              </p>
            </div>

            {/* Feature row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              <Feature icon={ScanText} title="Parse" desc="We read the full document" />
              <Feature icon={FileSearch} title="Flag" desc="Spot risky, non-standard clauses" />
              <Feature icon={Scale} title="Map" desc="Match to local tenant law" />
            </div>

            <LeaseInput onResults={handleResults} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your lease analysis</h1>
              <p className="text-sm text-muted-foreground">Review each flagged clause below before signing.</p>
            </div>
            <LeaseResults results={results} onReset={() => setResults(null)} />
            </div>
            )}
            </>
            );
            }

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="w-9 h-9 rounded-lg bg-muted mx-auto mb-2.5 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5 text-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  );
}
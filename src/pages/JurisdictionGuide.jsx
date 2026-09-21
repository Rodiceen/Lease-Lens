import React from "react";
import { Scale } from "lucide-react";

const GUIDE = [
  {
    flag: "🇺🇸",
    name: "United States",
    points: [
      "Implied warranty of habitability — landlords must keep the rental safe and livable.",
      "Security deposit limits and return deadlines vary by state (often 1–2 months' rent).",
      "Landlords generally must give 24–48 hours' notice before entering.",
      "Eviction requires a court process; self-help evictions (lockouts) are illegal.",
    ],
  },
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    points: [
      "Tenancy deposits must be protected in a government-approved scheme (DPS, TDS, mydeposits).",
      "Landlords must give at least 24 hours' notice to enter (assured shorthold tenancies).",
      "Section 21 (no-fault) and Section 8 (fault) eviction routes apply, with notice periods.",
      "Tenants have the right to a safe, well-maintained home (Homes (Fitness for Human Habitation) Act).",
    ],
  },
  {
    flag: "🇳🇬",
    name: "Nigeria",
    points: [
      "Lagos Tenancy Law 2011 limits advance rent to 6 months for new tenants (1 year is common but challengeable).",
      "Tenants are entitled to quiet enjoyment of the property.",
      "Recovery of premises requires notice and a court order; forced eviction is unlawful.",
      "Landlords must maintain the structure and external repairs; tenants handle minor internal repairs.",
    ],
  },
  {
    flag: "🇨🇦",
    name: "Canada",
    points: [
      "Each province has its own Residential Tenancy Act setting deposit limits and rules.",
      "Rent increases usually require written notice (often 3 months) and caps apply in some provinces.",
      "Disputes go through provincial tribunals (e.g., Landlord and Tenant Board in Ontario).",
      "Landlords must maintain the unit and give notice before entry (often 24 hours).",
    ],
  },
  {
    flag: "🇦🇺",
    name: "Australia",
    points: [
      "State laws govern tenancies (e.g., NSW Residential Tenancies Act).",
      "Rental bonds must be lodged with a state bond authority.",
      "A condition report is completed at the start and end of the tenancy.",
      "Notice periods for entry, rent increases, and termination are set by each state.",
    ],
  },
  {
    flag: "🇩🇪",
    name: "Germany",
    points: [
      "The BGB sets tenant protections; leases are usually open-ended.",
      "Operating costs (Nebenkosten) must be broken down annually.",
      "Notice periods for the landlord rise with tenancy length (3 months up to 9 months).",
      "Rent increases are capped and must follow the local comparative rent (Mietspiegel).",
    ],
  },
  {
    flag: "🇫🇷",
    name: "France",
    points: [
      "Loi ALUR sets lease terms, deposit caps (often 1 month unfurnished), and notice periods.",
      "Rent controls apply in high-demand areas (Paris, Lille, etc.).",
      "Notice periods vary by zone and tenant situation (1–3 months, reduced in some cases).",
      "Landlords must provide decent housing (decency criteria).",
    ],
  },
  {
    flag: "🇮🇳",
    name: "India",
    points: [
      "Rent control is state-specific (e.g., Maharashtra Rent Control Act); the Transfer of Property Act also applies.",
      "Security deposit caps vary by state (e.g., 2–6 months' rent).",
      "Landlords must give notice before termination; eviction requires court proceedings.",
      "Tenants have a right to essential repairs being addressed by the landlord.",
    ],
  },
  {
    flag: "🇦🇪",
    name: "United Arab Emirates",
    points: [
      "Tenancies in Dubai must be registered with Ejari and regulated by RERA.",
      "Rent increases are capped by the RERA Rent Index.",
      "Eviction requires notice (typically 12 months) and valid grounds.",
      "Landlords must hand over the property in habitable condition.",
    ],
  },
  {
    flag: "🇿🇦",
    name: "South Africa",
    points: [
      "The Rental Housing Act governs landlord-tenant relations.",
      "Deposits are capped and must be refunded with interest minus repairs within 7–14 days.",
      "Landlords must maintain the property; tenants have a right to privacy.",
      "Unfair practices can be challenged at the Rental Housing Tribunal.",
    ],
  },
];

export default function JurisdictionGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jurisdiction guide</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A plain-language reference to the tenant-rights laws LeaseLens uses when analyzing leases across regions.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-2.5">
        <Scale className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
        <p className="text-xs text-amber-800 leading-relaxed">
          This guide is a general overview, not legal advice. Laws change and vary by state, province, or city — always
          confirm the current rules for your specific location before signing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GUIDE.map((g) => (
          <div key={g.name} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">{g.flag}</span>
              <h2 className="text-sm font-semibold text-foreground">{g.name}</h2>
            </div>
            <ul className="space-y-2">
              {g.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
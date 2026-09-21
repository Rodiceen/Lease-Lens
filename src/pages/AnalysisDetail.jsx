import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import LeaseResults from "@/components/LeaseResults";
import { Loader2 } from "lucide-react";

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    base44.entities.LeaseAnalysis.get(id)
      .then((r) => setRecord(r))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="text-center py-20 space-y-2">
        <p className="text-sm text-muted-foreground">We couldn't find that analysis.</p>
        <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-primary hover:underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  return <LeaseResults results={record} onReset={() => navigate("/dashboard")} />;
}
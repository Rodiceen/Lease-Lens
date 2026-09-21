import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const MAX_TEXT = 60000;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    let user;
    try { user = await base44.auth.me(); } catch (e) { user = null; }
    if (!user) return Response.json({ error: 'Please sign in to analyze a lease.' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { text, file_url, jurisdiction, lease_type, language } = body || {};
    let leaseText = (text || '').trim();
    const leaseType = lease_type || 'Residential lease';
    const languageChoice = language || 'English';

    if (!leaseText && !file_url) {
      return Response.json({ error: 'Please provide lease text or upload a document.' }, { status: 400 });
    }
    if (!jurisdiction) {
      return Response.json({ error: 'Please select a jurisdiction.' }, { status: 400 });
    }

    if (file_url) {
      const extracted = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: 'object',
          properties: { content: { type: 'string' } },
          required: ['content']
        }
      });
      const out = extracted?.output;
      if (typeof out === 'string') leaseText = out;
      else if (out && typeof out === 'object') leaseText = out.content || out.text || JSON.stringify(out);
    }

    if (!leaseText) {
      return Response.json({ error: 'Could not extract any text from the document.' }, { status: 400 });
    }
    if (leaseText.length > MAX_TEXT) leaseText = leaseText.slice(0, MAX_TEXT);

    const prompt = `You are a tenant-rights legal analyst. Analyze the ${leaseType} text below and identify clauses that are dangerous, non-standard, unfair, one-sided, or potentially illegal under the tenant-protection laws of: ${jurisdiction}.

For each problematic clause:
1. Quote the exact clause text (or a faithful short excerpt).
2. Classify it into a category (e.g. Rent & Fees, Security Deposit, Repairs & Maintenance, Eviction & Termination, Liability & Insurance, Entry & Privacy, Subletting, Renewal, Late Fees, Default).
3. Rate the risk: "high", "medium", or "low".
4. Translate the clause into plain, non-technical language a non-lawyer can understand.
5. Explain why it matters and how it could harm the tenant.
6. Map it to the specific local tenant-rights law, statute, or regulation that applies in ${jurisdiction} (cite the name/section when known).
7. Give a practical, actionable recommendation for the tenant (what to negotiate, ask, or do).

Also provide: an overall summary of the lease's fairness, an overall risk score from 0 (very safe) to 100 (very risky), and confirm the jurisdiction you referenced.

Only flag genuinely problematic or non-standard clauses. If the lease is fair, return an empty clauses array and say so in the summary.

IMPORTANT: Write the summary, plain_language, why_it_matters, legal_mapping, and recommendation entirely in ${languageChoice}. Keep the quoted clause_text in the original language of the lease (do not translate the quoted clause). Also set the "jurisdiction" field to ${jurisdiction}.

Lease text:
"""
${leaseText}
"""`;

    const schema = {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        overall_risk_score: { type: 'number' },
        jurisdiction: { type: 'string' },
        clauses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              clause_text: { type: 'string' },
              category: { type: 'string' },
              risk_level: { type: 'string', enum: ['high', 'medium', 'low'] },
              plain_language: { type: 'string' },
              why_it_matters: { type: 'string' },
              legal_mapping: { type: 'string' },
              recommendation: { type: 'string' }
            },
            required: ['clause_text', 'category', 'risk_level', 'plain_language', 'why_it_matters', 'legal_mapping', 'recommendation']
          }
        }
      },
      required: ['summary', 'overall_risk_score', 'jurisdiction', 'clauses']
    };

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_8_flash',
      response_json_schema: schema
    });

    return Response.json({ ...result, lease_type: leaseType, language: languageChoice });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to analyze lease.' }, { status: 500 });
  }
}
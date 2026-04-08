import type { BackendAnalysisResponse, AnalysisResult, SubScore } from "@/types/analysis";

/**
 * Transforms the snake_case backend response into the camelCase
 * shape consumed by frontend components.
 */
export function transformBackendResponse(raw: BackendAnalysisResponse): AnalysisResult {
  const subScores: SubScore[] = [
    { category: "financials", label: "Financials", score: raw.scores.financial, maxScore: raw.max_score },
    { category: "risk", label: "Risk", score: raw.scores.risk, maxScore: raw.max_score },
    { category: "businessModel", label: "Business Model", score: raw.scores.business_model, maxScore: raw.max_score },
    { category: "moat", label: "Moat", score: raw.scores.moat, maxScore: raw.max_score },
    { category: "geopolitics", label: "Geopolitics", score: raw.scores.geopolitical, maxScore: raw.max_score },
  ];

  return {
    companyName: raw.company_name,
    ticker: raw.ticker,
    overallScore: raw.overall_score,
    maxScore: raw.max_score,
    subScores,
    strengths: raw.strengths,
    weaknesses: raw.weaknesses,
    recentChanges: raw.recent_changes,
    summary: raw.summary,
    analyzedAt: raw.analyzed_at,
  };
}

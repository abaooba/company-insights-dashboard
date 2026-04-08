import type { BackendAnalysisResponse, AnalysisResult, SubScore, AnalysisFormData } from "@/types/analysis";

const MAX_SCORE = 100;

/**
 * Transforms the snake_case backend response into the camelCase
 * shape consumed by frontend components. Enriches with form data
 * (company name / ticker) since the backend doesn't echo those back.
 */
export function transformBackendResponse(
  raw: BackendAnalysisResponse,
  formData: AnalysisFormData,
): AnalysisResult {
  const subScores: SubScore[] = [
    { category: "financials", label: "Financials", score: raw.scores.financial, maxScore: MAX_SCORE },
    { category: "risk", label: "Risk", score: raw.scores.risk, maxScore: MAX_SCORE },
    { category: "businessModel", label: "Business Model", score: raw.scores.business_model, maxScore: MAX_SCORE },
    { category: "moat", label: "Moat", score: raw.scores.moat, maxScore: MAX_SCORE },
    { category: "geopolitics", label: "Geopolitics", score: raw.scores.geopolitical, maxScore: MAX_SCORE },
  ];

  return {
    companyName: formData.companyName,
    ticker: formData.ticker || null,
    overallScore: raw.overall_score,
    maxScore: MAX_SCORE,
    subScores,
    strengths: raw.strengths,
    weaknesses: raw.weaknesses,
    recentChanges: raw.recent_changes,
    summary: raw.summary,
    analyzedAt: new Date().toISOString(),
  };
}

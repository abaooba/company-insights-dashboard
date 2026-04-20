import type { BackendAnalysisResponse, AnalysisResult, SubScore, AnalysisFormData } from "@/types/analysis";

const MAX_SCORE = 100;

/**
 * Transforms the snake_case backend response into the camelCase
 * shape consumed by frontend components. Uses company_name/ticker
 * from the backend response, falling back to form data.
 */
export function transformBackendResponse(
  raw: BackendAnalysisResponse,
  formData: AnalysisFormData,
): AnalysisResult {
  const subScores: SubScore[] = [
    { category: "financials", label: "financial", score: raw.scores.financial, maxScore: MAX_SCORE },
    { category: "risk", label: "risk", score: raw.scores.risk, maxScore: MAX_SCORE },
    { category: "businessModel", label: "business_model", score: raw.scores.business_model, maxScore: MAX_SCORE },
    { category: "moat", label: "moat", score: raw.scores.moat, maxScore: MAX_SCORE },
    { category: "geopolitics", label: "geopolitical", score: raw.scores.geopolitical, maxScore: MAX_SCORE },
  ];

  return {
    companyCik: raw.company_cik,
    companyName: raw.company_name || formData.companyName,
    ticker: raw.ticker || formData.ticker || null,
    overallScore: raw.overall_score,
    maxScore: MAX_SCORE,
    subScores,
    strengths: raw.strengths,
    weaknesses: raw.weaknesses,
    recentChanges: raw.recent_changes,
    summary: raw.summary,
    details: raw.details,
    llmAnalysis: raw.llm_analysis ?? null,
    analyzedAt: new Date().toISOString(),
  };
}

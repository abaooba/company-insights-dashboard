import type {
  BackendAnalysisResponse,
  BackendConfidence,
  BackendForensic,
  BackendScoreTrajectory,
  AnalysisResult,
  Confidence,
  ForensicReport,
  ForensicFinding,
  ScoreTrajectory,
  TrajectoryPoint,
  TrajectoryTrend,
  TrajectoryDimension,
  SubScore,
  AnalysisFormData,
} from "@/types/analysis";
import { FORENSIC_FLAG_LABELS, TRAJECTORY_DIMENSION_LABELS } from "@/types/analysis";

const MAX_SCORE = 100;

/** camelCase trajectory dimension → its snake_case key in the backend trends object. */
const TRAJECTORY_BACKEND_KEYS: Record<TrajectoryDimension, keyof BackendScoreTrajectory["trends"]> = {
  risk: "risk",
  businessModel: "business_model",
  moat: "moat",
};

/** T4: data-backing confidence. Absent backend field → null. */
function mapConfidence(raw: BackendConfidence | undefined): Confidence | null {
  if (!raw) return null;
  const f = raw.factors ?? ({} as BackendConfidence["factors"]);
  return {
    score: raw.score ?? 0,
    level: raw.level ?? "low",
    factors: {
      riskFactorsText: Boolean(f.risk_factors_text),
      businessText: Boolean(f.business_text),
      mdnaText: Boolean(f.mdna_text),
      financialMetricsPresent: f.financial_metrics_present ?? 0,
      yearOverYearData: Boolean(f.year_over_year_data),
      newsArticlesAnalyzed: f.news_articles_analyzed ?? 0,
    },
  };
}

/**
 * T4: forensic red flags. Absent backend field → null (distinct from a
 * present-but-clean report, which keeps an empty findings list). Each fired
 * flag becomes a finding with a human label and its quoted evidence.
 */
function mapForensic(raw: BackendForensic | undefined): ForensicReport | null {
  if (!raw) return null;
  const evidence = raw.evidence_sentences ?? {};
  const findings: ForensicFinding[] = (raw.flags ?? []).map((flag) => ({
    flag,
    label: FORENSIC_FLAG_LABELS[flag] ?? flag,
    evidence: evidence[flag] ?? [],
  }));
  return { totalScore: raw.total_forensic_score ?? 0, findings };
}

/**
 * T4: multi-year score trajectory. Absent backend field → null. Points are
 * mapped to camelCase; trends become an ordered array (risk, business model,
 * moat) carrying display labels — empty when fewer than 2 filings compared.
 */
function mapTrajectory(raw: BackendScoreTrajectory | undefined): ScoreTrajectory | null {
  if (!raw) return null;
  const points: TrajectoryPoint[] = (raw.points ?? []).map((p) => ({
    filingDate: p.filing_date,
    form: p.form,
    risk: p.risk,
    businessModel: p.business_model,
    moat: p.moat,
  }));
  const rawTrends = raw.trends ?? {};
  const trends = (Object.keys(TRAJECTORY_DIMENSION_LABELS) as TrajectoryDimension[]).reduce<TrajectoryTrend[]>(
    (acc, dimension) => {
      const t = rawTrends[TRAJECTORY_BACKEND_KEYS[dimension]];
      if (t) {
        acc.push({
          dimension,
          label: TRAJECTORY_DIMENSION_LABELS[dimension],
          change: t.change,
          direction: t.direction,
        });
      }
      return acc;
    },
    [],
  );
  return { points, filingsCompared: raw.filings_compared ?? points.length, trends };
}

/**
 * Transforms the snake_case backend response into the camelCase
 * shape consumed by frontend components. Uses company_name/ticker
 * from the backend response, falling back to form data. The T4 fields
 * (confidence, forensic, score_trajectory, contradictions) are additive
 * and may be absent — mapped defensively to null / [].
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
    confidence: mapConfidence(raw.confidence),
    forensic: mapForensic(raw.forensic),
    scoreTrajectory: mapTrajectory(raw.score_trajectory),
    contradictions: raw.contradictions ?? [],
    strengths: raw.strengths,
    weaknesses: raw.weaknesses,
    recentChanges: raw.recent_changes,
    summary: raw.summary,
    details: raw.details,
    llmAnalysis: raw.llm_analysis ?? null,
    analyzedAt: new Date().toISOString(),
  };
}

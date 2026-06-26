// ── Frontend types (camelCase) ──────────────────────────────────

export interface AnalysisFormData {
  companyName: string;
  ticker: string;
}

export type ScoreCategory =
  | "financials"
  | "risk"
  | "businessModel"
  | "moat"
  | "geopolitics";

export interface SubScore {
  category: ScoreCategory;
  label: string;
  score: number;
  maxScore: number;
}

export interface LlmAnalysis {
  investment_thesis?: string;
  enhanced_summary?: string;
  key_strengths?: string[];
  key_risks?: string[];
  red_flags?: string[];
  score_commentary?: string;
}

// ── T4 view-model types (camelCase) ──

/** "high" | "moderate" | "low" — how much real data backs the analysis. */
export type ConfidenceLevel = "high" | "moderate" | "low";

export interface ConfidenceFactors {
  riskFactorsText: boolean;
  businessText: boolean;
  mdnaText: boolean;
  /** Count of non-null XBRL metrics that loaded. */
  financialMetricsPresent: number;
  yearOverYearData: boolean;
  /** Count of news articles pulled for the geopolitics signal. */
  newsArticlesAnalyzed: number;
}

export interface Confidence {
  /** 0–100. */
  score: number;
  level: ConfidenceLevel;
  factors: ConfidenceFactors;
}

/** Accounting/disclosure red-flag categories that can fire. */
export type ForensicFlag =
  | "going_concern"
  | "restatement"
  | "material_weakness"
  | "impairment"
  | "related_party"
  | "liquidity_covenant"
  | "sec_investigation"
  | "auditor_change";

/** One fired forensic flag, with a human-readable label and its quoted evidence. */
export interface ForensicFinding {
  flag: ForensicFlag;
  label: string;
  evidence: string[];
}

/** Forensic red flags — informational, deliberately NOT part of overallScore. */
export interface ForensicReport {
  /** 0–100, higher = more/heavier flags. */
  totalScore: number;
  /** One per fired flag (empty when nothing detected). */
  findings: ForensicFinding[];
}

export type TrendDirection = "up" | "down" | "flat";

/** The three text-based dimensions that have a multi-year trajectory. */
export type TrajectoryDimension = "risk" | "businessModel" | "moat";

export interface TrajectoryPoint {
  /** ISO date string, e.g. "2023-11-03". */
  filingDate: string;
  /** "10-K" | "20-F" | "40-F". */
  form: string;
  risk: number;
  businessModel: number;
  moat: number;
}

export interface TrajectoryTrend {
  dimension: TrajectoryDimension;
  label: string;
  /** Signed delta of the latest point vs. the prior one. */
  change: number;
  direction: TrendDirection;
}

export interface ScoreTrajectory {
  /** Oldest → newest. */
  points: TrajectoryPoint[];
  filingsCompared: number;
  /** Empty when fewer than 2 filings were compared. */
  trends: TrajectoryTrend[];
}

export interface AnalysisResult {
  companyCik: string;
  companyName: string;
  ticker: string | null;
  overallScore: number;
  maxScore: number;
  subScores: SubScore[];
  /** T4: data-backing confidence; null when the backend omits it. */
  confidence: Confidence | null;
  /** T4: forensic red flags; null when omitted ("present but clean" keeps an empty findings list). */
  forensic: ForensicReport | null;
  /** T4: multi-year score trajectory; null when omitted. */
  scoreTrajectory: ScoreTrajectory | null;
  /** T4: internal-tension notes; [] when none or omitted. */
  contradictions: string[];
  strengths: string[];
  weaknesses: string[];
  recentChanges: string[];
  summary: string;
  details: BackendDetails;
  llmAnalysis: LlmAnalysis | null;
  analyzedAt: string;
}

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export const SCORE_CATEGORIES: Record<ScoreCategory, string> = {
  financials: "Financials",
  risk: "Risk",
  businessModel: "Business Model",
  moat: "Moat",
  geopolitics: "Geopolitics",
};

/** Human-readable labels for the forensic red-flag categories. */
export const FORENSIC_FLAG_LABELS: Record<ForensicFlag, string> = {
  going_concern: "Going concern",
  restatement: "Restatement",
  material_weakness: "Material weakness",
  impairment: "Impairment",
  related_party: "Related-party transactions",
  liquidity_covenant: "Liquidity / covenant",
  sec_investigation: "SEC investigation",
  auditor_change: "Auditor change",
};

/** Display labels for the trajectory dimensions (order = chart/series order). */
export const TRAJECTORY_DIMENSION_LABELS: Record<TrajectoryDimension, string> = {
  risk: "Risk",
  businessModel: "Business Model",
  moat: "Moat",
};

// ── Backend request / response types (snake_case, mirrors Python API) ──

export interface BackendAnalysisRequest {
  company_name: string;
  ticker: string | null;
}

export interface BackendScores {
  financial: number;
  risk: number;
  business_model: number;
  moat: number;
  geopolitical: number;
}

// ── Detail sub-types ──

export interface KeywordHitDetail {
  raw_total_hits: number;
  softened_total_hits: number;
  keyword_hits: Record<string, number>;
}

export interface FinancialDetails {
  total_financial_score: number;
  category_scores: Record<string, number>;
  metrics_used: Record<string, number>;
  notes: Record<string, string[]>;
}

export interface RiskCategoryDetail extends KeywordHitDetail {}

export interface RiskDetails {
  total_risk_score: number;
  category_scores: Record<string, number>;
  matched_keywords: Record<string, Record<string, number>>;
  details: Record<string, RiskCategoryDetail>;
  evidence_sentences: Record<string, string[]>;
}

export interface BusinessModelDetails {
  total_business_model_score: number;
  category_scores: Record<string, number>;
  matched_keywords: Record<string, Record<string, number>>;
  evidence_sentences: Record<string, string[]>;
  details: Record<string, KeywordHitDetail>;
  positive_contribution: number;
  negative_contribution: number;
}

export interface MoatDetails {
  total_moat_score: number;
  category_scores: Record<string, number>;
  matched_keywords: Record<string, Record<string, number>>;
  evidence_sentences: Record<string, string[]>;
  details: Record<string, KeywordHitDetail>;
}

export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  published: string;
}

export interface GeopoliticalDetails {
  total_geopolitical_score: number;
  category_scores: Record<string, number>;
  news_category_counts: Record<string, number>;
  news_evidence: Record<string, NewsArticle[]>;
  filing_exposure: Record<string, KeywordHitDetail>;
  filing_form_used: string;
  filing_date_used: string;
  article_count: number;
}

export interface SectionLength {
  current_length: number;
  previous_length: number;
  length_change: number;
}

export interface ScoreChange {
  current: number;
  previous: number;
  change: number;
}

export interface ChangeDetectionDetails {
  current_filing_date: string;
  previous_filing_date: string;
  current_filing_path: string;
  previous_filing_path: string;
  section_lengths: Record<string, SectionLength>;
  score_changes: Record<string, ScoreChange>;
  new_sentences: Record<string, string[]>;
}

export interface BackendDetails {
  financial: FinancialDetails;
  risk: RiskDetails;
  business_model: BusinessModelDetails;
  moat: MoatDetails;
  geopolitical: GeopoliticalDetails;
  change_detection: ChangeDetectionDetails;
}

// ── T4 backend additions (snake_case, all optional / may be absent or empty) ──

export interface BackendConfidence {
  score: number;
  level: ConfidenceLevel;
  factors: {
    risk_factors_text: boolean;
    business_text: boolean;
    mdna_text: boolean;
    financial_metrics_present: number;
    year_over_year_data: boolean;
    news_articles_analyzed: number;
  };
}

export interface BackendForensic {
  total_forensic_score: number;
  flags: ForensicFlag[];
  category_scores: Record<string, number>;
  matched_keywords: Record<string, Record<string, number>>;
  /** Up to ~2 quoted filing sentences per fired flag. */
  evidence_sentences: Partial<Record<ForensicFlag, string[]>>;
}

export interface BackendTrajectoryPoint {
  filing_date: string;
  form: string;
  risk: number;
  business_model: number;
  moat: number;
}

export interface BackendTrend {
  change: number;
  direction: TrendDirection;
}

export interface BackendScoreTrajectory {
  /** Oldest → newest. */
  points: BackendTrajectoryPoint[];
  filings_compared: number;
  /** Empty when < 2 filings compared. */
  trends: {
    risk?: BackendTrend;
    business_model?: BackendTrend;
    moat?: BackendTrend;
  };
}

export interface BackendAnalysisResponse {
  company_cik: string;
  company_name: string;
  ticker: string;
  overall_score: number;
  scores: BackendScores;

  // ── T4 additions (purely additive; absent on older/thin responses) ──
  confidence?: BackendConfidence;
  forensic?: BackendForensic;
  score_trajectory?: BackendScoreTrajectory;
  contradictions?: string[];

  strengths: string[];
  weaknesses: string[];
  recent_changes: string[];
  summary: string;
  details: BackendDetails;
  llm_analysis?: LlmAnalysis | null;
}

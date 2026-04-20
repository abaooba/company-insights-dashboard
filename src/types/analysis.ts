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

export interface AnalysisResult {
  companyCik: string;
  companyName: string;
  ticker: string | null;
  overallScore: number;
  maxScore: number;
  subScores: SubScore[];
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

export interface BackendAnalysisResponse {
  company_cik: string;
  company_name: string;
  ticker: string;
  overall_score: number;
  scores: BackendScores;
  strengths: string[];
  weaknesses: string[];
  recent_changes: string[];
  summary: string;
  details: BackendDetails;
}

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

export interface AnalysisResult {
  companyName: string;
  ticker: string | null;
  overallScore: number;
  maxScore: number;
  subScores: SubScore[];
  strengths: string[];
  weaknesses: string[];
  recentChanges: string[];
  summary: string;
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

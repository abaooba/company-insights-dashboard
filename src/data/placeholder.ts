import type { AnalysisResult } from "@/types/analysis";

export const PLACEHOLDER_RESULT: AnalysisResult = {
  companyName: "Acme Corp",
  ticker: "ACME",
  overallScore: 78,
  maxScore: 100,
  subScores: [
    { category: "financials", label: "Financials", score: 82, maxScore: 100 },
    { category: "risk", label: "Risk", score: 65, maxScore: 100 },
    { category: "businessModel", label: "Business Model", score: 88, maxScore: 100 },
    { category: "moat", label: "Moat", score: 74, maxScore: 100 },
    { category: "geopolitics", label: "Geopolitics", score: 71, maxScore: 100 },
  ],
  strengths: [
    "Strong recurring revenue with 95% retention rate",
    "Market leader in core segment with 34% share",
    "Robust balance sheet with low debt-to-equity ratio",
    "Patented technology creates significant barriers to entry",
  ],
  weaknesses: [
    "Geographic concentration risk — 78% revenue from North America",
    "Key-person dependency on founding team",
    "Margin compression from rising input costs",
  ],
  recentChanges: [
    "Q4 earnings beat consensus by 12% — driven by enterprise expansion",
    "New CFO appointment signals strategic shift toward M&A",
    "Regulatory review initiated in EU market",
  ],
  summary:
    "Acme Corp demonstrates strong fundamentals with a defensible market position and healthy financials. The company's moat is built on proprietary technology and high switching costs. Key risks include geographic concentration and emerging regulatory headwinds in the EU. Recent earnings momentum and leadership changes suggest an inflection point in corporate strategy.",
  analyzedAt: new Date().toISOString(),
};

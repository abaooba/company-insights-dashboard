import type { BackendAnalysisResponse } from "@/types/analysis";

/**
 * Mock API response matching the exact shape returned by the Python
 * analysis engine. Replace the fetch call in analyzeCompany() once the
 * backend is live.
 */
export const MOCK_BACKEND_RESPONSE: BackendAnalysisResponse = {
  overall_score: 78,
  scores: {
    financial: 82,
    risk: 65,
    business_model: 88,
    moat: 74,
    geopolitical: 71,
  },
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
  recent_changes: [
    "Q4 earnings beat consensus by 12% — driven by enterprise expansion",
    "New CFO appointment signals strategic shift toward M&A",
    "Regulatory review initiated in EU market",
  ],
  summary:
    "Acme Corp demonstrates strong fundamentals with a defensible market position and healthy financials. The company's moat is built on proprietary technology and high switching costs. Key risks include geographic concentration and emerging regulatory headwinds in the EU. Recent earnings momentum and leadership changes suggest an inflection point in corporate strategy.",
};

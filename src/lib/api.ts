import type { AnalysisFormData, AnalysisResult, BackendAnalysisResponse } from "@/types/analysis";
import { transformBackendResponse } from "@/lib/transformAnalysis";
import { MOCK_BACKEND_RESPONSE } from "@/data/mockApiResponse";

// TODO: Replace with real API base URL
// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/**
 * Calls the analysis backend. Currently returns mock data.
 * When the Python backend is ready, uncomment the fetch block below.
 */
export async function analyzeCompany(data: AnalysisFormData): Promise<AnalysisResult> {
  /*
  // ── Real implementation (uncomment when backend is ready) ──
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company_name: data.companyName, ticker: data.ticker || null }),
  });

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.status}`);
  }

  const raw: BackendAnalysisResponse = await res.json();
  return transformBackendResponse(raw);
  */

  // ── Mock implementation ──
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const raw: BackendAnalysisResponse = {
    ...MOCK_BACKEND_RESPONSE,
    company_name: data.companyName,
    ticker: data.ticker || null,
    analyzed_at: new Date().toISOString(),
  };

  return transformBackendResponse(raw);
}

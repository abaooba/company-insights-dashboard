import type {
  AnalysisFormData,
  AnalysisResult,
  BackendAnalysisRequest,
  BackendAnalysisResponse,
} from "@/types/analysis";
import { transformBackendResponse } from "@/lib/transformAnalysis";
import { MOCK_BACKEND_RESPONSE } from "@/data/mockApiResponse";

// TODO: Replace with real API base URL
// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/** Maps frontend form data to the snake_case request the backend expects. */
function buildRequest(data: AnalysisFormData): BackendAnalysisRequest {
  return { company_name: data.companyName, ticker: data.ticker || null };
}

/**
 * Calls the analysis backend. Currently returns mock data.
 * When the Python backend is ready, uncomment the fetch block below.
 */
export async function analyzeCompany(data: AnalysisFormData): Promise<AnalysisResult> {
  const _request = buildRequest(data);

  /*
  // ── Real implementation (uncomment when backend is ready) ──
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_request),
  });

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.status}`);
  }

  const raw: BackendAnalysisResponse = await res.json();
  return transformBackendResponse(raw, data);
  */

  // ── Mock implementation ──
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return transformBackendResponse(MOCK_BACKEND_RESPONSE, data);
}

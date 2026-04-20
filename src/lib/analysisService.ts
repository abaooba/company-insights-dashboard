import type {
  AnalysisFormData,
  AnalysisResult,
  BackendAnalysisRequest,
  BackendAnalysisResponse,
} from "@/types/analysis";
import { transformBackendResponse } from "@/lib/transformAnalysis";

const API_BASE = "https://sec-analyzer-g9m4.onrender.com";

function buildRequest(data: AnalysisFormData): BackendAnalysisRequest {
  return { company_name: data.companyName, ticker: data.ticker || null };
}

export async function analyzeCompany(data: AnalysisFormData): Promise<AnalysisResult> {
  const request = buildRequest(data);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.status}`);
  }

  const raw: BackendAnalysisResponse = await res.json();
  return transformBackendResponse(raw, data);
}

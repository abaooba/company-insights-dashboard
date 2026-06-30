import { API_BASE } from "@/lib/apiConfig";
import { transformFactorResponse } from "@/lib/transformFactors";
import {
  isBackendFactorError,
  type BackendFactorAttributionRequest,
  type BackendFactorAttributionResponse,
  type FactorAttributionInput,
  type FactorAttributionResult,
} from "@/types/factors";

/** Maps the camelCase form input to the snake_case request body the API expects. */
function buildRequest(input: FactorAttributionInput): BackendFactorAttributionRequest {
  const body: BackendFactorAttributionRequest = {};

  if (input.mode === "portfolio") {
    body.holdings = input.holdings
      .filter((h) => h.ticker.trim())
      .map((h) => ({ ticker: h.ticker.trim().toUpperCase(), weight: h.weight }));
  } else {
    body.ticker = input.ticker.trim().toUpperCase();
  }

  if (input.startDate) body.start_date = input.startDate;
  if (input.endDate) body.end_date = input.endDate;
  if (input.rollingWindow) body.rolling_window = input.rollingWindow;

  return body;
}

/**
 * Runs a factor-attribution analysis. The endpoint returns a `{ error }` union
 * on any data problem (unknown tickers, too little overlapping history); we
 * surface that as a thrown Error carrying the backend's own message so the UI
 * can show it verbatim.
 */
export async function runFactorAttribution(
  input: FactorAttributionInput,
): Promise<FactorAttributionResult> {
  const res = await fetch(`${API_BASE}/factor-attribution`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildRequest(input)),
  });

  if (!res.ok) {
    throw new Error(`Factor attribution failed: ${res.status}`);
  }

  const raw: BackendFactorAttributionResponse = await res.json();
  if (isBackendFactorError(raw)) {
    throw new Error(raw.error);
  }
  return transformFactorResponse(raw);
}

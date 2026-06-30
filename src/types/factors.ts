// ── Factor-attribution types ────────────────────────────────────
//
// Mirrors the backend `POST /factor-attribution` contract (verified against
// backend/app/factors/{service,regression,attribution}.py — not just the docs).
// The endpoint decomposes a portfolio's (or single ticker's) returns against the
// Fama-French 5 + Momentum model. All returns are *decimals* (0.12 = 12%).

/** The six regression factors. `RF` is excluded — it defines the excess return. */
export type FactorKey = "Mkt-RF" | "SMB" | "HML" | "RMW" | "CMA" | "Mom";

/** Conventional FF5 + Momentum order — used to render betas/series deterministically. */
export const FACTOR_ORDER: FactorKey[] = ["Mkt-RF", "SMB", "HML", "RMW", "CMA", "Mom"];

/** Human-readable factor labels (mirrors backend FACTOR_LABELS). */
export const FACTOR_LABELS: Record<FactorKey, string> = {
  "Mkt-RF": "Market",
  SMB: "Size (SMB)",
  HML: "Value (HML)",
  RMW: "Profitability (RMW)",
  CMA: "Investment (CMA)",
  Mom: "Momentum",
};

/** Default rolling-beta window in trading days (mirrors backend DEFAULT_ROLLING_WINDOW). */
export const DEFAULT_ROLLING_WINDOW = 126;

// ── Frontend form input (camelCase) ──

export type FactorInputMode = "single" | "portfolio";

export interface HoldingInput {
  ticker: string;
  /** Relative weight; the backend renormalizes, so values need not sum to 1. */
  weight: number;
}

/** What the form collects and hands to the service. */
export interface FactorAttributionInput {
  mode: FactorInputMode;
  /** Used when mode === "single". */
  ticker: string;
  /** Used when mode === "portfolio". */
  holdings: HoldingInput[];
  startDate?: string;
  endDate?: string;
  rollingWindow?: number;
}

// ── Frontend view-model (camelCase) ──

export interface CoefficientStats {
  /** Point estimate (slope). */
  beta: number;
  /** Human-readable factor name, e.g. "Value (HML)". */
  label: string;
  stdErr: number;
  tStat: number;
  pValue: number;
  /** 95% CI [low, high]. */
  confInt: [number, number];
  /** p_value < 0.05. */
  significant: boolean;
}

/** Alpha = the intercept: average return unexplained by factor exposure. */
export interface AlphaStats {
  /** Daily alpha (decimal). */
  daily: number;
  /** daily × 252 (decimal). */
  annualized: number;
  stdErr: number;
  tStat: number;
  pValue: number;
  confIntDaily: [number, number];
  significant: boolean;
}

/** One factor's static beta, paired with its key (ordered by FACTOR_ORDER). */
export interface FactorBeta {
  factor: FactorKey;
  stats: CoefficientStats;
}

/** Full-sample (static) regression over the whole window. */
export interface FullSampleRegression {
  alpha: AlphaStats;
  betas: FactorBeta[];
  rSquared: number;
  adjRSquared: number;
  nObs: number;
}

/** One factor's rolling beta series (parallel to RollingRegression.dates). */
export interface RollingSeries {
  factor: FactorKey;
  values: number[];
}

/**
 * Rolling-window regression — how exposures drift over time. All arrays share
 * the `dates` axis (oldest → newest). `available` is false (and arrays empty)
 * when history is shorter than one window.
 */
export interface RollingRegression {
  window: number;
  available: boolean;
  observations: number;
  dates: string[];
  betas: RollingSeries[];
  alphaAnnualized: number[];
  rSquared: Array<number | null>;
}

/** One slice of the attribution waterfall. The final slice is `factor: "alpha"`. */
export interface AttributionComponent {
  factor: FactorKey | "alpha";
  label: string;
  /** null for the alpha slice. */
  beta: number | null;
  /** null for the alpha slice. */
  factorAvgReturnAnnualized: number | null;
  /** beta × factor return (annualized decimal). */
  contributionAnnualized: number;
  /** Share of total; null when total ≈ 0. */
  pctOfTotal: number | null;
}

/**
 * Return-attribution waterfall (annualized decimal returns). The components plus
 * alpha reconcile to `totalExcessReturnAnnualized`; `residualAnnualized` is the
 * (≈0) rounding gap.
 */
export interface Attribution {
  basis: string;
  totalExcessReturnAnnualized: number;
  explainedByFactorsAnnualized: number;
  alphaAnnualized: number;
  residualAnnualized: number;
  components: AttributionComponent[];
}

export interface PortfolioHolding {
  ticker: string;
  /** Renormalized to sum to 1. */
  weight: number;
}

export interface PortfolioMeta {
  holdings: PortfolioHolding[];
  /** Requested tickers with no usable price history. */
  droppedTickers: string[];
  startDate: string;
  endDate: string;
  observations: number;
  firstDate: string;
  lastDate: string;
}

export interface FactorAttributionResult {
  portfolio: PortfolioMeta;
  factorModel: string;
  factors: FactorKey[];
  fullSample: FullSampleRegression;
  rolling: RollingRegression;
  attribution: Attribution;
  analyzedAt: string;
}

export type FactorAttributionStatus = "idle" | "loading" | "success" | "error";

// ── Backend request / response types (snake_case, mirrors the API) ──

export interface BackendFactorAttributionRequest {
  holdings?: Array<{ ticker: string; weight?: number }>;
  ticker?: string;
  start_date?: string;
  end_date?: string;
  rolling_window?: number;
}

export interface BackendCoefficientStats {
  beta: number;
  label: string;
  std_err: number;
  t_stat: number;
  p_value: number;
  conf_int: [number, number];
  significant: boolean;
}

export interface BackendAlphaStats {
  daily: number;
  annualized: number;
  std_err: number;
  t_stat: number;
  p_value: number;
  conf_int_daily: [number, number];
  significant: boolean;
}

export interface BackendFullSampleRegression {
  alpha: BackendAlphaStats;
  betas: Partial<Record<FactorKey, BackendCoefficientStats>>;
  r_squared: number;
  adj_r_squared: number;
  n_obs: number;
}

export interface BackendRollingRegression {
  window: number;
  available: boolean;
  observations: number;
  dates: string[];
  betas: Partial<Record<FactorKey, number[]>>;
  alpha_annualized: number[];
  r_squared: Array<number | null>;
}

export interface BackendAttributionComponent {
  factor: FactorKey | "alpha";
  label: string;
  beta: number | null;
  factor_avg_return_annualized: number | null;
  contribution_annualized: number;
  pct_of_total: number | null;
}

export interface BackendAttribution {
  basis: string;
  total_excess_return_annualized: number;
  explained_by_factors_annualized: number;
  alpha_annualized: number;
  residual_annualized: number;
  components: BackendAttributionComponent[];
}

export interface BackendPortfolioMeta {
  holdings: Array<{ ticker: string; weight: number }>;
  dropped_tickers: string[];
  start_date: string;
  end_date: string;
  observations: number;
  first_date: string;
  last_date: string;
}

export interface BackendFactorAttributionSuccess {
  portfolio: BackendPortfolioMeta;
  factor_model: string;
  factors: FactorKey[];
  full_sample: BackendFullSampleRegression;
  rolling: BackendRollingRegression;
  attribution: BackendAttribution;
}

export interface BackendFactorAttributionError {
  error: string;
}

export type BackendFactorAttributionResponse =
  | BackendFactorAttributionSuccess
  | BackendFactorAttributionError;

export function isBackendFactorError(
  response: BackendFactorAttributionResponse,
): response is BackendFactorAttributionError {
  return "error" in response;
}

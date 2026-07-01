// Formatting helpers + label maps for the scoring-breakdown / evidence UI.
// Every scorer's raw output (financial metrics, per-category scores, matched
// keywords, evidence sentences, YoY changes) is surfaced verbatim here, so the
// maps below mirror the backend keys exactly (see sec_analyzer scoring configs).

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const numberCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

/** Big money value → compact currency, e.g. 143756000000 → "$143.76B". */
export const formatUsd = (value: number): string => usdCompact.format(value);

/** Plain count → compact, e.g. 14810356000 → "14.81B". */
export const formatCompact = (value: number): string => numberCompact.format(value);

/** Decimal ratio → percent, e.g. 0.3537 → "35.4%". */
export const formatRatioPct = (value: number): string => percent.format(value);

/** Signed integer/decimal, e.g. 5 → "+5", -2 → "-2", 0 → "0". */
export const formatSigned = (value: number): string =>
  `${value > 0 ? "+" : ""}${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** snake_case / kebab key → Title Case, used as a fallback for unmapped keys. */
export const humanizeKey = (key: string): string =>
  key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// ── Per-category caps (from backend keywords.toml) ──
export const FINANCIAL_CATEGORY_CAP = 20;
export const TEXT_CATEGORY_CAP = 15; // risk / moat / geopolitics per-category cap
export const BUSINESS_POSITIVE_CAP = 15;
export const BUSINESS_NEGATIVE_CAP = 12;

export const MOAT_BASE_SCORE = 35;
export const BUSINESS_MODEL_BASE_SCORE = 50;

/** An ordered (key, label) pair for a scorer category. */
export interface LabeledKey {
  key: string;
  label: string;
}

// Ordered so the UI renders categories in a stable, sensible sequence.
export const FINANCIAL_CATEGORIES: LabeledKey[] = [
  { key: "profitability", label: "Profitability" },
  { key: "cash_generation", label: "Cash generation" },
  { key: "leverage", label: "Leverage" },
  { key: "balance_sheet_strength", label: "Balance-sheet strength" },
  { key: "capital_efficiency", label: "Capital efficiency" },
];

export const RISK_CATEGORIES: LabeledKey[] = [
  { key: "macroeconomic", label: "Macroeconomic" },
  { key: "supply_chain", label: "Supply chain" },
  { key: "geopolitical", label: "Geopolitical" },
  { key: "regulatory_legal", label: "Regulatory / legal" },
  { key: "cybersecurity", label: "Cybersecurity" },
  { key: "concentration", label: "Concentration" },
];

export const BUSINESS_MODEL_CATEGORIES: LabeledKey[] = [
  { key: "recurring_revenue", label: "Recurring revenue" },
  { key: "diversification", label: "Diversification" },
  { key: "scalability", label: "Scalability" },
  { key: "ecosystem_strength", label: "Ecosystem strength" },
  { key: "operational_intensity", label: "Operational intensity" },
  { key: "customer_dependency", label: "Customer dependency" },
];

/** Business-model categories that DEDUCT from the base score (rest add to it). */
export const BUSINESS_MODEL_NEGATIVE = new Set<string>([
  "operational_intensity",
  "customer_dependency",
]);

export const MOAT_CATEGORIES: LabeledKey[] = [
  { key: "brand_strength", label: "Brand strength" },
  { key: "switching_costs", label: "Switching costs" },
  { key: "ecosystem_lock_in", label: "Ecosystem lock-in" },
  { key: "scale_advantages", label: "Scale advantages" },
  { key: "distribution_advantages", label: "Distribution advantages" },
  { key: "intellectual_property", label: "Intellectual property" },
  { key: "customer_dependency_lock_in", label: "Customer lock-in" },
  { key: "technology_leadership", label: "Technology leadership" },
];

export const GEOPOLITICAL_CATEGORIES: LabeledKey[] = [
  { key: "tariffs_trade", label: "Tariffs & trade" },
  { key: "sanctions_export_controls", label: "Sanctions & export controls" },
  { key: "war_conflict", label: "War & conflict" },
  { key: "supply_chain_disruption", label: "Supply-chain disruption" },
  { key: "china_exposure", label: "China exposure" },
  { key: "regulation_antitrust", label: "Regulation & antitrust" },
  { key: "macro_demand", label: "Macro demand" },
  { key: "middle_east_energy_shipping", label: "Mideast energy & shipping" },
];

// ── Financial snapshot metrics (details.financial.metrics_used) ──
export type MetricFormat = "usd" | "percent" | "count";

export interface MetricMeta {
  key: string;
  label: string;
  format: MetricFormat;
}

// Ordered for display; only metrics actually present (non-null) are rendered.
export const FINANCIAL_METRICS: MetricMeta[] = [
  { key: "revenue", label: "Revenue", format: "usd" },
  { key: "operating_income", label: "Operating income", format: "usd" },
  { key: "net_income", label: "Net income", format: "usd" },
  { key: "operating_margin", label: "Operating margin", format: "percent" },
  { key: "roe_proxy", label: "Return on equity (proxy)", format: "percent" },
  { key: "operating_cash_flow", label: "Operating cash flow", format: "usd" },
  { key: "capex", label: "Capital expenditure", format: "usd" },
  { key: "free_cash_flow_proxy", label: "Free cash flow (proxy)", format: "usd" },
  { key: "assets", label: "Total assets", format: "usd" },
  { key: "liabilities", label: "Total liabilities", format: "usd" },
  { key: "equity", label: "Shareholders' equity", format: "usd" },
  { key: "net_assets", label: "Net assets", format: "usd" },
  { key: "long_term_debt", label: "Long-term debt", format: "usd" },
  { key: "diluted_shares", label: "Diluted shares", format: "count" },
];

/** Format one financial metric by its declared format. */
export const formatMetric = (value: number, format: MetricFormat): string => {
  switch (format) {
    case "percent":
      return formatRatioPct(value);
    case "count":
      return formatCompact(value);
    case "usd":
    default:
      return formatUsd(value);
  }
};

// ── Section labels for change-detection (details.change_detection) ──
export const FILING_SECTION_LABELS: Record<string, string> = {
  business: "Business",
  risk_factors: "Risk Factors",
  mdna: "MD&A",
};

export const TRAJECTORY_SCORE_LABELS: Record<string, string> = {
  risk: "Risk",
  business_model: "Business model",
  moat: "Moat",
};

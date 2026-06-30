import type { FactorKey } from "@/types/factors";

/** Decimal return → percent string, e.g. 0.1234 → "12.3%". */
export const formatPct = (decimal: number, digits = 1): string => `${(decimal * 100).toFixed(digits)}%`;

/** Decimal return → signed percent, e.g. 0.023 → "+2.3%", -0.01 → "-1.0%". */
export const formatSignedPct = (decimal: number, digits = 1): string => {
  const pct = decimal * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(digits)}%`;
};

/** `pct_of_total` is already in percent units (or null when total ≈ 0). */
export const formatShare = (pct: number | null, digits = 1): string =>
  pct == null ? "—" : `${pct.toFixed(digits)}%`;

/** A regression coefficient (not a percentage), e.g. 1.02. */
export const formatBeta = (value: number, digits = 2): string => value.toFixed(digits);

/** Distinct line/bar colors per factor, shared by the static and rolling charts. */
export const FACTOR_COLORS: Record<FactorKey, string> = {
  "Mkt-RF": "hsl(217 91% 60%)",
  SMB: "hsl(160 84% 39%)",
  HML: "hsl(38 92% 50%)",
  RMW: "hsl(280 65% 60%)",
  CMA: "hsl(0 84% 60%)",
  Mom: "hsl(190 90% 55%)",
};

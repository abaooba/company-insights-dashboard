import CategoryBars, { type CategoryBarEntry } from "./CategoryBars";
import {
  FINANCIAL_CATEGORIES,
  FINANCIAL_CATEGORY_CAP,
  FINANCIAL_METRICS,
  formatCompact,
  formatMetric,
  humanizeKey,
} from "@/lib/statsFormat";
import type { FinancialDetails } from "@/types/analysis";

interface FinancialBreakdownProps {
  financial: FinancialDetails;
}

const isNumeric = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Financial-quality breakdown: the real XBRL-derived snapshot numbers, the five
 * 0–20 category scores that sum to the total, and each category's plain-English
 * notes explaining the grade.
 */
const FinancialBreakdown = ({ financial }: FinancialBreakdownProps) => {
  const metrics = financial.metrics_used ?? {};
  const knownKeys = new Set(FINANCIAL_METRICS.map((m) => m.key));

  const knownRows = FINANCIAL_METRICS.filter((m) => isNumeric(metrics[m.key])).map((m) => ({
    key: m.key,
    label: m.label,
    value: formatMetric(metrics[m.key] as number, m.format),
  }));

  // Any metric the backend adds that we haven't mapped yet — still surface it.
  const extraRows = Object.entries(metrics)
    .filter(([key, value]) => !knownKeys.has(key) && isNumeric(value))
    .map(([key, value]) => ({ key, label: humanizeKey(key), value: formatCompact(value as number) }));

  const metricRows = [...knownRows, ...extraRows];

  const barEntries: CategoryBarEntry[] = FINANCIAL_CATEGORIES.filter(
    (c) => c.key in (financial.category_scores ?? {}),
  ).map((c) => ({
    key: c.key,
    label: c.label,
    score: financial.category_scores[c.key] ?? 0,
    cap: FINANCIAL_CATEGORY_CAP,
  }));

  const noteGroups = FINANCIAL_CATEGORIES.map((c) => ({
    label: c.label,
    notes: financial.notes?.[c.key] ?? [],
  })).filter((g) => g.notes.length > 0);

  return (
    <div className="space-y-5">
      {metricRows.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Financial snapshot
          </h5>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {metricRows.map((row) => (
              <div key={row.key} className="flex flex-col">
                <dt className="text-[11px] text-muted-foreground">{row.label}</dt>
                <dd className="font-mono text-sm tabular-nums text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {barEntries.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Category scores
          </h5>
          <CategoryBars entries={barEntries} tone="good" />
        </div>
      )}

      {noteGroups.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Notes
          </h5>
          <ul className="space-y-2">
            {noteGroups.map((group) => (
              <li key={group.label}>
                <p className="text-xs font-medium text-foreground">{group.label}</p>
                <ul className="ml-3 mt-0.5 space-y-0.5">
                  {group.notes.map((note, i) => (
                    <li key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                      <span className="text-muted-foreground/40">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FinancialBreakdown;

import { cn } from "@/lib/utils";

export type BarTone = "good" | "bad" | "neutral";

export interface CategoryBarEntry {
  key: string;
  label: string;
  score: number;
  /** Per-category maximum, used to size the bar. */
  cap: number;
  /** When true, this category counts against the score (rendered as a deduction). */
  negative?: boolean;
}

interface CategoryBarsProps {
  entries: CategoryBarEntry[];
  /** Fill color for non-negative rows. Negative rows always read as a deduction. */
  tone?: BarTone;
}

const TONE_FILL: Record<BarTone, string> = {
  good: "bg-emerald-500",
  bad: "bg-amber-500",
  neutral: "bg-sky-500",
};

const formatScore = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

/**
 * A compact list of per-category score bars (score / cap). Used by every
 * dimension's breakdown so the reader can see which categories drove the total.
 */
const CategoryBars = ({ entries, tone = "neutral" }: CategoryBarsProps) => {
  if (entries.length === 0) return null;

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const ratio = entry.cap > 0 ? Math.min(Math.abs(entry.score) / entry.cap, 1) : 0;
        const fill = entry.negative ? "bg-red-500/80" : TONE_FILL[tone];
        return (
          <li key={entry.key} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3">
            <span className="truncate text-xs text-muted-foreground" title={entry.label}>
              {entry.label}
              {entry.negative && <span className="ml-1 text-red-400/70">(−)</span>}
            </span>
            <span className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span
                className={cn("block h-full rounded-full", fill)}
                style={{ width: `${ratio * 100}%` }}
              />
            </span>
            <span className="w-16 text-right font-mono text-xs tabular-nums text-secondary-foreground">
              {formatScore(entry.score)}
              <span className="text-muted-foreground/50"> / {entry.cap}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoryBars;

import { ShieldCheck, ShieldQuestion, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Confidence, ConfidenceFactors, ConfidenceLevel } from "@/types/analysis";

interface ConfidenceBadgeProps {
  confidence: Confidence;
}

const LEVEL_STYLES: Record<
  ConfidenceLevel,
  { label: string; className: string; icon: typeof ShieldCheck }
> = {
  high: {
    label: "High",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    icon: ShieldCheck,
  },
  moderate: {
    label: "Moderate",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    icon: ShieldQuestion,
  },
  // Low confidence is styled loudly on purpose: a thin analysis should not read
  // as a strong one.
  low: {
    label: "Low",
    className: "border-red-500/40 bg-red-500/20 text-red-300 ring-1 ring-red-500/40",
    icon: ShieldAlert,
  },
};

const FACTOR_ROWS: { key: keyof ConfidenceFactors; label: string; kind: "bool" | "count" }[] = [
  { key: "riskFactorsText", label: "Risk Factors text", kind: "bool" },
  { key: "businessText", label: "Business text", kind: "bool" },
  { key: "mdnaText", label: "MD&A text", kind: "bool" },
  { key: "yearOverYearData", label: "Year-over-year data", kind: "bool" },
  { key: "financialMetricsPresent", label: "Financial metrics", kind: "count" },
  { key: "newsArticlesAnalyzed", label: "News articles", kind: "count" },
];

const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  const style = LEVEL_STYLES[confidence.level] ?? LEVEL_STYLES.low;
  const Icon = style.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            style.className,
          )}
          aria-label={`Analysis confidence: ${style.label}, ${confidence.score} out of 100`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            Confidence: {style.label}{" "}
            <span className="font-mono opacity-80">({confidence.score}/100)</span>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-3">
        <p className="mb-2 text-xs font-semibold text-foreground">What backs this analysis</p>
        <ul className="space-y-1">
          {FACTOR_ROWS.map((row) => {
            const value = confidence.factors[row.key];
            const present = row.kind === "bool" ? Boolean(value) : Number(value) > 0;
            return (
              <li key={row.key} className="flex items-center justify-between gap-6 text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={cn("font-mono", present ? "text-emerald-400" : "text-muted-foreground/60")}>
                  {row.kind === "bool" ? (value ? "yes" : "no") : String(value)}
                </span>
              </li>
            );
          })}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
};

export default ConfidenceBadge;

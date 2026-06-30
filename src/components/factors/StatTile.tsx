import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}

/** Small labelled metric tile used across the factor-attribution cards. */
const StatTile = ({ label, value, hint, tone = "default" }: StatTileProps) => (
  <div className="rounded-md border border-border bg-muted/40 px-3 py-2">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div
      className={cn(
        "font-mono text-lg font-semibold",
        tone === "positive" && "text-score-excellent",
        tone === "negative" && "text-score-bad",
        tone === "default" && "text-foreground",
      )}
    >
      {value}
    </div>
    {hint && <div className="text-[10px] text-muted-foreground/60">{hint}</div>}
  </div>
);

export default StatTile;

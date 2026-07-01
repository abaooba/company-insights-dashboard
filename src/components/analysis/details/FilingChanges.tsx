import { ArrowDown, ArrowUp, Minus, Quote } from "lucide-react";
import {
  FILING_SECTION_LABELS,
  TRAJECTORY_SCORE_LABELS,
  formatCompact,
  formatSigned,
  humanizeKey,
} from "@/lib/statsFormat";
import type { ChangeDetectionDetails } from "@/types/analysis";

interface FilingChangesProps {
  change: ChangeDetectionDetails;
}

const DeltaArrow = ({ value }: { value: number }) => {
  if (value > 0) return <ArrowUp className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
  if (value < 0) return <ArrowDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
  return <Minus className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />;
};

const label = (map: Record<string, string>, key: string) => map[key] ?? humanizeKey(key);

/**
 * Year-over-year change detection: the exact filings compared, how the three
 * text scores moved, how much each section grew or shrank, and the sentences
 * that are new in the latest filing.
 */
const FilingChanges = ({ change }: FilingChangesProps) => {
  const scoreRows = Object.entries(change.score_changes ?? {});
  const lengthRows = Object.entries(change.section_lengths ?? {}).filter(
    ([, v]) => v.current_length > 0 || v.previous_length > 0,
  );
  const sentenceRows = Object.entries(change.new_sentences ?? {}).filter(
    ([, sentences]) => sentences.length > 0,
  );

  return (
    <div className="space-y-5">
      {(change.previous_filing_date || change.current_filing_date) && (
        <p className="text-[11px] font-mono text-muted-foreground/70">
          {change.previous_filing_date ?? "—"} → {change.current_filing_date ?? "—"}
        </p>
      )}

      {scoreRows.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Score changes
          </h5>
          <ul className="space-y-1.5">
            {scoreRows.map(([key, sc]) => (
              <li key={key} className="flex items-center gap-2 text-xs">
                <span className="w-28 shrink-0 text-muted-foreground">{label(TRAJECTORY_SCORE_LABELS, key)}</span>
                <span className="font-mono tabular-nums text-muted-foreground/70">{sc.previous}</span>
                <DeltaArrow value={sc.change} />
                <span className="font-mono tabular-nums text-foreground">{sc.current}</span>
                <span className="font-mono text-muted-foreground/60">({formatSigned(sc.change)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lengthRows.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Section length (characters)
          </h5>
          <ul className="space-y-1.5">
            {lengthRows.map(([key, len]) => (
              <li key={key} className="flex items-center gap-2 text-xs">
                <span className="w-28 shrink-0 text-muted-foreground">{label(FILING_SECTION_LABELS, key)}</span>
                <span className="font-mono tabular-nums text-muted-foreground/70">
                  {formatCompact(len.previous_length)}
                </span>
                <DeltaArrow value={len.length_change} />
                <span className="font-mono tabular-nums text-foreground">{formatCompact(len.current_length)}</span>
                <span className="font-mono text-muted-foreground/60">({formatSigned(len.length_change)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sentenceRows.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            New language this filing
          </h5>
          <ul className="space-y-3">
            {sentenceRows.map(([key, sentences]) => (
              <li key={key}>
                <p className="mb-1 text-xs font-medium text-foreground">{label(FILING_SECTION_LABELS, key)}</p>
                <ul className="space-y-1">
                  {sentences.map((sentence, i) => (
                    <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                      <Quote className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                      <span className="italic">&ldquo;{sentence}&rdquo;</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {scoreRows.length === 0 && lengthRows.length === 0 && sentenceRows.length === 0 && (
        <p className="text-xs italic text-muted-foreground/70">
          No year-over-year changes were detected.
        </p>
      )}
    </div>
  );
};

export default FilingChanges;

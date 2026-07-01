import { Quote } from "lucide-react";
import type { LabeledKey } from "@/lib/statsFormat";

interface KeywordEvidenceProps {
  /** Ordered category (key, label) pairs for this dimension. */
  categories: LabeledKey[];
  /** category → { keyword → hit count }. */
  matchedKeywords: Record<string, Record<string, number>>;
  /** category → quoted filing sentences (optional; not every scorer has these). */
  evidenceSentences?: Record<string, string[]>;
  /** Shown when no category has any keyword hits or evidence. */
  emptyNote: string;
}

/**
 * Per-category "why" for a text scorer: the keywords that matched the filing
 * (with hit counts) and the quoted sentences behind them. Only categories with
 * a signal are shown; when nothing matched, a single muted note explains why.
 */
const KeywordEvidence = ({
  categories,
  matchedKeywords,
  evidenceSentences,
  emptyNote,
}: KeywordEvidenceProps) => {
  const rows = categories
    .map(({ key, label }) => {
      const keywords = Object.entries(matchedKeywords?.[key] ?? {}).filter(([, count]) => count > 0);
      const sentences = evidenceSentences?.[key] ?? [];
      return { key, label, keywords, sentences };
    })
    .filter((row) => row.keywords.length > 0 || row.sentences.length > 0);

  if (rows.length === 0) {
    return <p className="text-xs italic text-muted-foreground/70">{emptyNote}</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.key}>
          <p className="mb-1.5 text-xs font-medium text-foreground">{row.label}</p>
          {row.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {row.keywords.map(([keyword, count]) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-secondary-foreground"
                >
                  <span className="font-mono">{keyword}</span>
                  <span className="text-muted-foreground/70">×{count}</span>
                </span>
              ))}
            </div>
          )}
          {row.sentences.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {row.sentences.map((sentence, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <Quote className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                  <span className="italic">&ldquo;{sentence}&rdquo;</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default KeywordEvidence;

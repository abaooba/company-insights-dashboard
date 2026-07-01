import { ExternalLink } from "lucide-react";
import CategoryBars, { type CategoryBarEntry } from "./CategoryBars";
import KeywordEvidence from "./KeywordEvidence";
import { GEOPOLITICAL_CATEGORIES, TEXT_CATEGORY_CAP } from "@/lib/statsFormat";
import type { GeopoliticalDetails } from "@/types/analysis";

interface GeopoliticalBreakdownProps {
  geo: GeopoliticalDetails;
}

/**
 * Geopolitics is a blend of two evidence streams: live news (what's happening
 * now) and filing language (structural exposure). Both are surfaced here, plus
 * the per-category scores and the filing metadata the signal was drawn from.
 */
const GeopoliticalBreakdown = ({ geo }: GeopoliticalBreakdownProps) => {
  const barEntries: CategoryBarEntry[] = GEOPOLITICAL_CATEGORIES.filter(
    (c) => c.key in (geo.category_scores ?? {}),
  ).map((c) => ({
    key: c.key,
    label: c.label,
    score: geo.category_scores[c.key] ?? 0,
    cap: TEXT_CATEGORY_CAP,
  }));

  const newsRows = GEOPOLITICAL_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    count: geo.news_category_counts?.[c.key] ?? 0,
    articles: geo.news_evidence?.[c.key] ?? [],
  })).filter((row) => row.count > 0 || row.articles.length > 0);

  // filing_exposure is category → KeywordHitDetail; reshape to keyword→count for reuse.
  const filingKeywords = Object.fromEntries(
    Object.entries(geo.filing_exposure ?? {}).map(([cat, detail]) => [cat, detail?.keyword_hits ?? {}]),
  );

  const meta = [
    geo.filing_form_used && `Filing: ${geo.filing_form_used}`,
    geo.filing_date_used && `Filed ${geo.filing_date_used}`,
    typeof geo.article_count === "number" && `${geo.article_count} articles scanned`,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5">
      {meta.length > 0 && (
        <p className="text-[11px] font-mono text-muted-foreground/70">{meta.join(" · ")}</p>
      )}

      {barEntries.length > 0 && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Category scores <span className="normal-case text-muted-foreground/50">(higher = worse)</span>
          </h5>
          <CategoryBars entries={barEntries} tone="bad" />
        </div>
      )}

      <div>
        <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Recent news signal
        </h5>
        {newsRows.length === 0 ? (
          <p className="text-xs italic text-muted-foreground/70">
            No recent news matched the geopolitical categories.
          </p>
        ) : (
          <ul className="space-y-3">
            {newsRows.map((row) => (
              <li key={row.key}>
                <p className="mb-1 text-xs font-medium text-foreground">
                  {row.label}
                  <span className="ml-1.5 font-normal text-muted-foreground/70">
                    {row.count} {row.count === 1 ? "mention" : "mentions"}
                  </span>
                </p>
                {row.articles.length > 0 && (
                  <ul className="space-y-1">
                    {row.articles.map((article, i) => (
                      <li key={i} className="text-xs leading-relaxed">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-1 text-sky-400 hover:text-sky-300 hover:underline"
                        >
                          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                          <span>{article.title}</span>
                        </a>
                        <span className="ml-1 text-muted-foreground/60">
                          {article.source}
                          {article.published ? ` · ${article.published}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Filing exposure language
        </h5>
        <KeywordEvidence
          categories={GEOPOLITICAL_CATEGORIES}
          matchedKeywords={filingKeywords}
          emptyNote="No geopolitical exposure language matched in the filing text."
        />
      </div>
    </div>
  );
};

export default GeopoliticalBreakdown;

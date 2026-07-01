import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CategoryBars, { type CategoryBarEntry } from "./CategoryBars";
import KeywordEvidence from "./KeywordEvidence";
import FinancialBreakdown from "./FinancialBreakdown";
import GeopoliticalBreakdown from "./GeopoliticalBreakdown";
import FilingChanges from "./FilingChanges";
import {
  RISK_CATEGORIES,
  BUSINESS_MODEL_CATEGORIES,
  BUSINESS_MODEL_NEGATIVE,
  BUSINESS_POSITIVE_CAP,
  BUSINESS_NEGATIVE_CAP,
  BUSINESS_MODEL_BASE_SCORE,
  MOAT_CATEGORIES,
  MOAT_BASE_SCORE,
  TEXT_CATEGORY_CAP,
  type LabeledKey,
} from "@/lib/statsFormat";
import type { BackendDetails } from "@/types/analysis";

interface ScoringBreakdownProps {
  details: BackendDetails;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** The score shown on the right of each accordion trigger. */
const ScoreTag = ({ score }: { score: number }) => (
  <span className="ml-auto mr-3 font-mono text-xs tabular-nums text-muted-foreground">
    {Number.isInteger(score) ? score : score.toFixed(2)}
    <span className="text-muted-foreground/40"> / 100</span>
  </span>
);

const TriggerLabel = ({ title, score }: { title: string; score: number }) => (
  <span className="flex flex-1 items-center">
    <span className="text-sm font-medium text-foreground">{title}</span>
    <ScoreTag score={score} />
  </span>
);

/** Build per-category bar entries for a text scorer with a single cap. */
const textEntries = (
  categories: LabeledKey[],
  scores: Record<string, number>,
  cap: number,
): CategoryBarEntry[] =>
  categories
    .filter((c) => c.key in (scores ?? {}))
    .map((c) => ({ key: c.key, label: c.label, score: scores[c.key] ?? 0, cap }));

const ScoringBreakdown = ({ details }: ScoringBreakdownProps) => {
  const { financial, risk, business_model, moat, geopolitical, change_detection } = details;

  const businessEntries: CategoryBarEntry[] = BUSINESS_MODEL_CATEGORIES.filter(
    (c) => c.key in (business_model?.category_scores ?? {}),
  ).map((c) => {
    const negative = BUSINESS_MODEL_NEGATIVE.has(c.key);
    return {
      key: c.key,
      label: c.label,
      score: business_model.category_scores[c.key] ?? 0,
      cap: negative ? BUSINESS_NEGATIVE_CAP : BUSINESS_POSITIVE_CAP,
      negative,
    };
  });

  const hasChanges =
    !!change_detection &&
    (!!change_detection.current_filing_date ||
      Object.keys(change_detection.score_changes ?? {}).length > 0 ||
      Object.values(change_detection.new_sentences ?? {}).some((s) => s.length > 0));

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Scoring Breakdown &amp; Evidence
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Every score traces back to the financials, filing language, and news it was built from. Expand a
            dimension to see the category-by-category math and the evidence behind it.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["financial"]} className="w-full">
            {financial && (
              <AccordionItem value="financial">
                <AccordionTrigger>
                  <TriggerLabel title="Financials" score={financial.total_financial_score} />
                </AccordionTrigger>
                <AccordionContent>
                  <FinancialBreakdown financial={financial} />
                </AccordionContent>
              </AccordionItem>
            )}

            {risk && (
              <AccordionItem value="risk">
                <AccordionTrigger>
                  <TriggerLabel title="Risk" score={risk.total_risk_score} />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <CategoryBars
                      entries={textEntries(RISK_CATEGORIES, risk.category_scores, TEXT_CATEGORY_CAP)}
                      tone="bad"
                    />
                    <KeywordEvidence
                      categories={RISK_CATEGORIES}
                      matchedKeywords={risk.matched_keywords}
                      evidenceSentences={risk.evidence_sentences}
                      emptyNote="No risk keywords matched the analyzed filing text — this dimension scored at its floor."
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {business_model && (
              <AccordionItem value="business_model">
                <AccordionTrigger>
                  <TriggerLabel title="Business model" score={business_model.total_business_model_score} />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-[11px] font-mono text-muted-foreground/70">
                      Base {BUSINESS_MODEL_BASE_SCORE} · +{business_model.positive_contribution ?? 0} strengths · −
                      {business_model.negative_contribution ?? 0} drags
                    </p>
                    <CategoryBars entries={businessEntries} tone="good" />
                    <KeywordEvidence
                      categories={BUSINESS_MODEL_CATEGORIES}
                      matchedKeywords={business_model.matched_keywords}
                      evidenceSentences={business_model.evidence_sentences}
                      emptyNote={`No business-model keywords matched — the score stayed at its ${BUSINESS_MODEL_BASE_SCORE}-point baseline.`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {moat && (
              <AccordionItem value="moat">
                <AccordionTrigger>
                  <TriggerLabel title="Moat" score={moat.total_moat_score} />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-[11px] font-mono text-muted-foreground/70">
                      Base {MOAT_BASE_SCORE} + competitive-advantage signals
                    </p>
                    <CategoryBars
                      entries={textEntries(MOAT_CATEGORIES, moat.category_scores, TEXT_CATEGORY_CAP)}
                      tone="good"
                    />
                    <KeywordEvidence
                      categories={MOAT_CATEGORIES}
                      matchedKeywords={moat.matched_keywords}
                      evidenceSentences={moat.evidence_sentences}
                      emptyNote={`No moat keywords matched — the score stayed at its ${MOAT_BASE_SCORE}-point baseline.`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {geopolitical && (
              <AccordionItem value="geopolitical">
                <AccordionTrigger>
                  <TriggerLabel title="Geopolitics" score={geopolitical.total_geopolitical_score} />
                </AccordionTrigger>
                <AccordionContent>
                  <GeopoliticalBreakdown geo={geopolitical} />
                </AccordionContent>
              </AccordionItem>
            )}

            {hasChanges && (
              <AccordionItem value="change_detection" className="border-b-0">
                <AccordionTrigger>
                  <span className="flex flex-1 items-center">
                    <span className="text-sm font-medium text-foreground">Since last filing</span>
                    <span className="ml-auto mr-3 font-mono text-xs text-muted-foreground/60">year-over-year</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <FilingChanges change={change_detection} />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoringBreakdown;

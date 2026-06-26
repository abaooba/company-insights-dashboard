import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, Quote, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { ForensicReport } from "@/types/analysis";

interface ForensicFlagsProps {
  forensic: ForensicReport;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ForensicFlags = ({ forensic }: ForensicFlagsProps) => {
  const { findings } = forensic;
  const hasFlags = findings.length > 0;

  return (
    <motion.div variants={item}>
      <Card className={cn("bg-card", hasFlags ? "border-amber-500/30" : "border-border")}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className={cn("h-4 w-4", hasFlags ? "text-amber-500" : "text-muted-foreground")} />
            Forensic Red Flags
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Accounting &amp; disclosure signals from the filing text — informational, and{" "}
            <span className="font-medium text-muted-foreground">not blended into the overall score</span>.
          </p>
        </CardHeader>
        <CardContent>
          {!hasFlags ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-score-excellent" aria-hidden="true" />
              No forensic red flags detected.
            </div>
          ) : (
            <ul className="space-y-2">
              {findings.map((finding) => {
                const hasEvidence = finding.evidence.length > 0;
                return (
                  <li key={finding.flag}>
                    <Collapsible>
                      <CollapsibleTrigger
                        disabled={!hasEvidence}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left transition-colors",
                          hasEvidence ? "hover:bg-amber-500/15" : "cursor-default",
                        )}
                      >
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                        <span className="text-sm font-medium text-foreground">{finding.label}</span>
                        {hasEvidence && (
                          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                            {finding.evidence.length} {finding.evidence.length === 1 ? "quote" : "quotes"}
                            <ChevronDown
                              className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </CollapsibleTrigger>
                      {hasEvidence && (
                        <CollapsibleContent>
                          <ul className="space-y-2 px-3 py-2">
                            {finding.evidence.map((sentence, i) => (
                              <li
                                key={i}
                                className="flex gap-2 text-xs leading-relaxed text-secondary-foreground"
                              >
                                <Quote className="mt-0.5 h-3 w-3 shrink-0 text-amber-500/60" aria-hidden="true" />
                                <span className="italic">&ldquo;{sentence}&rdquo;</span>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForensicFlags;

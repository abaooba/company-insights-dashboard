import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LlmAnalysis } from "@/types/analysis";

interface LlmAnalysisCardProps {
  analysis: LlmAnalysis;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface SectionProps {
  title: string;
  items: string[];
  colorClass: string;
  icon?: React.ReactNode;
  bullet?: string;
}

const ListSection = ({ title, items, colorClass, icon, bullet = "•" }: SectionProps) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${colorClass}`}>
        {icon}
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((text, idx) => (
          <li key={idx} className="text-sm text-secondary-foreground leading-relaxed flex gap-2">
            <span className={`${colorClass} shrink-0`}>{bullet}</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LlmAnalysisCard = ({ analysis }: LlmAnalysisCardProps) => {
  const {
    investment_thesis,
    enhanced_summary,
    key_strengths = [],
    key_risks = [],
    red_flags = [],
    score_commentary,
  } = analysis;

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {investment_thesis && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-primary">
                Investment Thesis
              </h4>
              <p className="text-sm text-secondary-foreground leading-relaxed">{investment_thesis}</p>
            </div>
          )}

          {enhanced_summary && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-foreground">
                Enhanced Summary
              </h4>
              <p className="text-sm text-secondary-foreground leading-relaxed">{enhanced_summary}</p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <ListSection
              title="Key Strengths"
              items={key_strengths}
              colorClass="text-emerald-500"
              icon={<TrendingUp className="h-3.5 w-3.5" />}
            />
            <ListSection
              title="Key Risks"
              items={key_risks}
              colorClass="text-red-500"
              icon={<ShieldAlert className="h-3.5 w-3.5" />}
            />
          </div>

          <ListSection
            title="Red Flags"
            items={red_flags}
            colorClass="text-yellow-500"
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            bullet="⚠"
          />

          {score_commentary && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                Score Commentary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{score_commentary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LlmAnalysisCard;

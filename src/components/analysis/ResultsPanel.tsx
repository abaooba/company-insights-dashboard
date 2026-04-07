import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreGauge from "./ScoreGauge";
import type { AnalysisResult } from "@/types/analysis";

interface ResultsPanelProps {
  result: AnalysisResult;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ListSection = ({
  title,
  items,
  icon: Icon,
  variant,
}: {
  title: string;
  items: string[];
  icon: React.ElementType;
  variant: "strength" | "weakness" | "change";
}) => {
  const colorMap = {
    strength: "text-score-excellent",
    weakness: "text-score-bad",
    change: "text-accent",
  };

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Icon className={`h-4 w-4 ${colorMap[variant]}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((text, i) => (
              <li key={i} className="text-sm text-secondary-foreground flex gap-2">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  variant === "strength" ? "bg-score-excellent" :
                  variant === "weakness" ? "bg-score-bad" : "bg-accent"
                }`} />
                {text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ResultsPanel = ({ result }: ResultsPanelProps) => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-baseline gap-3">
        <h2 className="text-2xl font-bold text-foreground">{result.companyName}</h2>
        {result.ticker && (
          <Badge variant="outline" className="font-mono text-primary border-primary/30">
            {result.ticker}
          </Badge>
        )}
      </motion.div>

      {/* Overall + Subscores */}
      <motion.div variants={item}>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreGauge score={result.overallScore} maxScore={result.maxScore} label="Overall" size="lg" />
              <div className="h-px sm:h-24 w-full sm:w-px bg-border" />
              <div className="flex flex-wrap justify-center gap-6 flex-1">
                {result.subScores.map((sub) => (
                  <ScoreGauge key={sub.category} score={sub.score} maxScore={sub.maxScore} label={sub.label} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <ListSection title="Strengths" items={result.strengths} icon={TrendingUp} variant="strength" />
        <ListSection title="Weaknesses" items={result.weaknesses} icon={TrendingDown} variant="weakness" />
      </div>

      <ListSection title="Recent Changes" items={result.recentChanges} icon={RefreshCw} variant="change" />

      {/* Summary */}
      <motion.div variants={item}>
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.p variants={item} className="text-xs text-muted-foreground/50 font-mono text-right">
        Analyzed {new Date(result.analyzedAt).toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default ResultsPanel;

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ScoreCardGrid from "./ScoreCardGrid";
import ConfidenceBadge from "./ConfidenceBadge";
import ScoreTrajectoryChart from "./ScoreTrajectoryChart";
import ContradictionsCallout from "./ContradictionsCallout";
import ForensicFlags from "./ForensicFlags";
import StrengthsList from "./StrengthsList";
import WeaknessesList from "./WeaknessesList";
import RecentChangesList from "./RecentChangesList";
import SummaryCard from "./SummaryCard";
import LlmAnalysisCard from "./LlmAnalysisCard";
import ScoringBreakdown from "./details/ScoringBreakdown";
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

const ResultsPanel = ({ result }: ResultsPanelProps) => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">{result.companyName}</h2>
        {result.ticker && (
          <Badge variant="outline" className="font-mono text-primary border-primary/30">
            {result.ticker}
          </Badge>
        )}
        {result.confidence && <ConfidenceBadge confidence={result.confidence} />}
      </motion.div>

      {/* Scores */}
      <ScoreCardGrid
        overallScore={result.overallScore}
        maxScore={result.maxScore}
        subScores={result.subScores}
      />

      {/* Score trajectory across recent annual filings */}
      {result.scoreTrajectory && <ScoreTrajectoryChart trajectory={result.scoreTrajectory} />}

      {/* Caveats: internal tensions + forensic red flags (kept out of the blended score) */}
      {result.contradictions.length > 0 && (
        <ContradictionsCallout contradictions={result.contradictions} />
      )}
      {result.forensic && <ForensicFlags forensic={result.forensic} />}

      {/* LLM Analysis */}
      {result.llmAnalysis && <LlmAnalysisCard analysis={result.llmAnalysis} />}

      {/* Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <StrengthsList items={result.strengths} />
        <WeaknessesList items={result.weaknesses} />
      </div>

      {result.recentChanges.length > 0 && (
        <RecentChangesList items={result.recentChanges} />
      )}

      {/* Summary */}
      <SummaryCard summary={result.summary} />

      {/* Full per-scorer breakdown: category math + evidence behind every score */}
      {result.details && <ScoringBreakdown details={result.details} />}

      <motion.p variants={item} className="text-xs text-muted-foreground/50 font-mono text-right">
        Analyzed {new Date(result.analyzedAt).toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default ResultsPanel;

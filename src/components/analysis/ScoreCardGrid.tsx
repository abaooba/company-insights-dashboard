import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import ScoreGauge from "./ScoreGauge";
import type { SubScore } from "@/types/analysis";

interface ScoreCardGridProps {
  overallScore: number;
  maxScore: number;
  subScores: SubScore[];
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ScoreCardGrid = ({ overallScore, maxScore, subScores }: ScoreCardGridProps) => {
  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ScoreGauge score={overallScore} maxScore={maxScore} label="Overall" size="lg" />
            <div className="h-px sm:h-24 w-full sm:w-px bg-border" />
            <div className="flex flex-wrap justify-center gap-6 flex-1">
              {subScores.map((sub) => (
                <ScoreGauge key={sub.category} score={sub.score} maxScore={sub.maxScore} label={sub.label} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoreCardGrid;

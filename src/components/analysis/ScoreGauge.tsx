import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  label: string;
  size?: "sm" | "lg";
}

const getScoreColor = (ratio: number): string => {
  if (ratio >= 0.8) return "text-score-excellent";
  if (ratio >= 0.65) return "text-score-good";
  if (ratio >= 0.5) return "text-score-neutral";
  if (ratio >= 0.35) return "text-score-poor";
  return "text-score-bad";
};

const getStrokeColor = (ratio: number): string => {
  if (ratio >= 0.8) return "hsl(var(--score-excellent))";
  if (ratio >= 0.65) return "hsl(var(--score-good))";
  if (ratio >= 0.5) return "hsl(var(--score-neutral))";
  if (ratio >= 0.35) return "hsl(var(--score-poor))";
  return "hsl(var(--score-bad))";
};

const ScoreGauge = ({ score, maxScore, label, size = "sm" }: ScoreGaugeProps) => {
  const ratio = score / maxScore;
  const isLarge = size === "lg";
  const svgSize = isLarge ? 140 : 80;
  const strokeWidth = isLarge ? 8 : 5;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(ratio)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono font-bold ${getScoreColor(ratio)} ${isLarge ? "text-3xl" : "text-lg"}`}>
            {score}
          </span>
        </div>
      </div>
      <span className={`text-muted-foreground font-medium ${isLarge ? "text-sm" : "text-xs"} uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  );
};

export default ScoreGauge;

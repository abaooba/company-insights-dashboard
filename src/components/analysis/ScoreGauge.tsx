import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  label: string;
  size?: "sm" | "lg";
  /**
   * When true, a high score is bad (e.g. risk, geopolitics). The color reflects
   * that inversion and a "higher = worse" hint is shown, while the arc still
   * fills to the true magnitude and the displayed number stays truthful.
   */
  higherIsWorse?: boolean;
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

const ScoreGauge = ({ score, maxScore, label, size = "sm", higherIsWorse = false }: ScoreGaugeProps) => {
  const ratio = score / maxScore;
  // Color encodes "goodness", which is inverted for higher-is-worse metrics; the
  // arc length below still tracks the true magnitude (ratio).
  const colorRatio = higherIsWorse ? 1 - ratio : ratio;
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
            stroke={getStrokeColor(colorRatio)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono font-bold ${getScoreColor(colorRatio)} ${isLarge ? "text-3xl" : "text-lg"}`}>
            {score}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className={`text-muted-foreground font-medium ${isLarge ? "text-sm" : "text-xs"} uppercase tracking-wider`}>
          {label}
        </span>
        {higherIsWorse && (
          <span className="text-[10px] font-medium leading-none tracking-normal normal-case text-muted-foreground/50">
            higher = worse
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreGauge;

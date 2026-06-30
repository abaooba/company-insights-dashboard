import { motion } from "framer-motion";
import PortfolioSummary from "./PortfolioSummary";
import FactorBetasCard from "./FactorBetasCard";
import RollingBetasChart from "./RollingBetasChart";
import AttributionWaterfall from "./AttributionWaterfall";
import type { FactorAttributionResult } from "@/types/factors";

interface FactorResultsPanelProps {
  result: FactorAttributionResult;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FactorResultsPanel = ({ result }: FactorResultsPanelProps) => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <PortfolioSummary portfolio={result.portfolio} factorModel={result.factorModel} />
      <FactorBetasCard fullSample={result.fullSample} />
      <RollingBetasChart rolling={result.rolling} />
      <AttributionWaterfall attribution={result.attribution} />

      <motion.p variants={item} className="text-xs text-muted-foreground/50 font-mono text-right">
        Analyzed {new Date(result.analyzedAt).toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default FactorResultsPanel;

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Fetching company data…",
  "Analyzing financials…",
  "Assessing risk factors…",
  "Evaluating business model…",
  "Scoring competitive moat…",
  "Reviewing geopolitical exposure…",
];

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <div className="space-y-2 text-center">
        {STEPS.map((step, i) => (
          <motion.p
            key={step}
            className="text-sm font-mono text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4] }}
            transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, repeatDelay: STEPS.length * 0.5 - 1.5 }}
          >
            {step}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;

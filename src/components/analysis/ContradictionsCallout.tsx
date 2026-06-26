import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContradictionsCalloutProps {
  contradictions: string[];
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ContradictionsCallout = ({ contradictions }: ContradictionsCalloutProps) => {
  if (contradictions.length === 0) return null;

  return (
    <motion.div variants={item}>
      <Alert className="border-amber-500/30 bg-amber-500/5 [&>svg]:text-amber-500">
        <Scale className="h-4 w-4" />
        <AlertTitle className="text-amber-200">Tensions to weigh</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-1.5">
            {contradictions.map((text, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-secondary-foreground">
                <span className="shrink-0 text-amber-500">•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default ContradictionsCallout;

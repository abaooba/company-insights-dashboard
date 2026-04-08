import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  message = "Analysis failed. Please try again.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-20 gap-5"
    >
      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-foreground">Something went wrong</p>
        <p className="text-sm font-mono text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 mt-2">
          <RotateCcw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;

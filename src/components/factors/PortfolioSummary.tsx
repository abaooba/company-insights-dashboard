import { motion } from "framer-motion";
import { AlertTriangle, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioMeta } from "@/types/factors";
import { formatPct } from "@/lib/formatFactors";

interface PortfolioSummaryProps {
  portfolio: PortfolioMeta;
  factorModel: string;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PortfolioSummary = ({ portfolio, factorModel }: PortfolioSummaryProps) => {
  const { holdings, droppedTickers, observations, firstDate, lastDate } = portfolio;

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            Portfolio
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Regressed against the {factorModel}.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {holdings.map((h) => (
              <li key={h.ticker} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono font-medium text-foreground">{h.ticker}</span>
                  <span className="font-mono text-muted-foreground">{formatPct(h.weight)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(h.weight * 100, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {droppedTickers.length > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
              <span>
                Dropped (no usable price history):{" "}
                <span className="font-mono">{droppedTickers.join(", ")}</span>
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
            <span>
              Window:{" "}
              <span className="font-mono text-foreground">
                {firstDate} → {lastDate}
              </span>
            </span>
            <span>
              Observations:{" "}
              <span className="font-mono text-foreground">{observations.toLocaleString()}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PortfolioSummary;

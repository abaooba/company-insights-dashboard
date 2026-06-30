import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, Cell, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import StatTile from "./StatTile";
import type { Attribution } from "@/types/factors";
import { formatBeta, formatPct, formatShare, formatSignedPct } from "@/lib/formatFactors";

interface AttributionWaterfallProps {
  attribution: Attribution;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const POSITIVE = "hsl(var(--score-excellent))";
const NEGATIVE = "hsl(var(--score-bad))";

const chartConfig = { contribution: { label: "Contribution (ann.)" } } satisfies ChartConfig;

const AttributionWaterfall = ({ attribution }: AttributionWaterfallProps) => {
  const {
    totalExcessReturnAnnualized: total,
    explainedByFactorsAnnualized: explained,
    alphaAnnualized: alpha,
    residualAnnualized: residual,
    components,
  } = attribution;

  const chartData = components.map((c) => ({
    key: c.factor,
    label: c.label,
    contribution: c.contributionAnnualized,
  }));

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Return Attribution
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Annualized excess return, split into each factor's contribution plus idiosyncratic alpha.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile
              label="Total excess (ann.)"
              value={formatSignedPct(total)}
              tone={total >= 0 ? "positive" : "negative"}
            />
            <StatTile
              label="Explained by factors"
              value={formatSignedPct(explained)}
              tone={explained >= 0 ? "positive" : "negative"}
            />
            <StatTile label="Alpha" value={formatSignedPct(alpha)} tone={alpha >= 0 ? "positive" : "negative"} />
          </div>
          {Math.abs(residual) >= 0.0005 && (
            <p className="text-xs text-muted-foreground/60">
              Residual (rounding gap): {formatSignedPct(residual, 2)}
            </p>
          )}

          <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
              <XAxis
                type="number"
                tickFormatter={(value) => formatPct(Number(value), 0)}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={130}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 11 }}
              />
              <ReferenceLine x={0} stroke="hsl(var(--border))" />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => formatSignedPct(Number(value))} />}
              />
              <Bar dataKey="contribution" radius={3}>
                {chartData.map((d) => (
                  <Cell key={d.key} fill={d.contribution >= 0 ? POSITIVE : NEGATIVE} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">β</TableHead>
                <TableHead className="text-right">Factor ret (ann.)</TableHead>
                <TableHead className="text-right">Contribution</TableHead>
                <TableHead className="text-right">% of total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((c) => (
                <TableRow key={c.factor}>
                  <TableCell className="font-medium">{c.label}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {c.beta == null ? "—" : formatBeta(c.beta)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {c.factorAvgReturnAnnualized == null ? "—" : formatSignedPct(c.factorAvgReturnAnnualized)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono",
                      c.contributionAnnualized >= 0 ? "text-score-excellent" : "text-score-bad",
                    )}
                  >
                    {formatSignedPct(c.contributionAnnualized)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatShare(c.pctOfTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AttributionWaterfall;

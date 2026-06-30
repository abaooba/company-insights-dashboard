import { motion } from "framer-motion";
import { Activity, Check } from "lucide-react";
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
import StatTile from "./StatTile";
import type { FullSampleRegression } from "@/types/factors";
import { FACTOR_COLORS, formatBeta, formatSignedPct } from "@/lib/formatFactors";

interface FactorBetasCardProps {
  fullSample: FullSampleRegression;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const chartConfig = { beta: { label: "Beta" } } satisfies ChartConfig;

const FactorBetasCard = ({ fullSample }: FactorBetasCardProps) => {
  const { alpha, betas, rSquared, adjRSquared, nObs } = fullSample;

  const chartData = betas.map((b) => ({
    factor: b.factor,
    label: b.stats.label,
    beta: b.stats.beta,
    significant: b.stats.significant,
  }));

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Factor Exposures
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Static betas over the full window. Bars fade when not statistically significant (p ≥ 0.05).
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              label="Alpha (ann.)"
              value={formatSignedPct(alpha.annualized)}
              hint={alpha.significant ? "significant" : "not significant"}
              tone={alpha.annualized >= 0 ? "positive" : "negative"}
            />
            <StatTile label="R²" value={rSquared.toFixed(2)} />
            <StatTile label="Adj. R²" value={adjRSquared.toFixed(2)} />
            <StatTile label="Obs." value={nObs.toLocaleString()} />
          </div>

          <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
              <XAxis type="number" tickLine={false} axisLine={false} tickMargin={4} />
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
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="beta" radius={3}>
                {chartData.map((d) => (
                  <Cell key={d.factor} fill={FACTOR_COLORS[d.factor]} fillOpacity={d.significant ? 1 : 0.35} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead className="text-right">β</TableHead>
                <TableHead className="text-right">t</TableHead>
                <TableHead className="text-right">p</TableHead>
                <TableHead className="text-right">95% CI</TableHead>
                <TableHead className="text-center">Sig.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {betas.map((b) => (
                <TableRow key={b.factor}>
                  <TableCell className="font-medium">{b.stats.label}</TableCell>
                  <TableCell className="text-right font-mono">{formatBeta(b.stats.beta)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {b.stats.tStat.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {b.stats.pValue.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    [{formatBeta(b.stats.confInt[0])}, {formatBeta(b.stats.confInt[1])}]
                  </TableCell>
                  <TableCell className="text-center">
                    {b.stats.significant ? (
                      <Check className="inline h-3.5 w-3.5 text-score-excellent" aria-label="significant" />
                    ) : (
                      <span className="text-muted-foreground/40" aria-label="not significant">
                        —
                      </span>
                    )}
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

export default FactorBetasCard;

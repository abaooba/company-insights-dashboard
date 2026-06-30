import { motion } from "framer-motion";
import { Info, Waves } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { RollingRegression } from "@/types/factors";
import { FACTOR_LABELS } from "@/types/factors";
import { FACTOR_COLORS } from "@/lib/formatFactors";

interface RollingBetasChartProps {
  rolling: RollingRegression;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

const RollingBetasChart = ({ rolling }: RollingBetasChartProps) => {
  const canShow = rolling.available && rolling.dates.length > 0 && rolling.betas.length > 0;

  // Reshape the parallel arrays into one row per date with a column per factor.
  const data = canShow
    ? rolling.dates.map((date, i) => {
        const row: Record<string, string | number> = { date };
        rolling.betas.forEach((series) => {
          row[series.factor] = series.values[i];
        });
        return row;
      })
    : [];

  const chartConfig = rolling.betas.reduce<ChartConfig>((acc, series) => {
    acc[series.factor] = { label: FACTOR_LABELS[series.factor], color: FACTOR_COLORS[series.factor] };
    return acc;
  }, {});

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Waves className="h-4 w-4 text-primary" />
            Rolling Exposures
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            {rolling.window}-day rolling betas — how the factor tilts drift over time.
          </p>
        </CardHeader>
        <CardContent>
          {!canShow ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              Not enough history for a {rolling.window}-day rolling window.
            </div>
          ) : (
            <>
              <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
                <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                  />
                  <YAxis width={32} tickLine={false} axisLine={false} tickMargin={4} />
                  <ChartTooltip
                    content={<ChartTooltipContent labelFormatter={(value) => formatDate(String(value))} />}
                  />
                  {rolling.betas.map((series) => (
                    <Line
                      key={series.factor}
                      dataKey={series.factor}
                      stroke={FACTOR_COLORS[series.factor]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ChartContainer>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {rolling.betas.map((series) => (
                  <div key={series.factor} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: FACTOR_COLORS[series.factor] }}
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{FACTOR_LABELS[series.factor]}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RollingBetasChart;

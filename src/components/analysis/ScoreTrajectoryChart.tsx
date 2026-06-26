import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, Info, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { ScoreTrajectory, TrajectoryDimension, TrendDirection } from "@/types/analysis";

interface ScoreTrajectoryChartProps {
  trajectory: ScoreTrajectory;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DIMENSION_COLOR: Record<TrajectoryDimension, string> = {
  risk: "hsl(var(--score-poor))",
  businessModel: "hsl(var(--primary))",
  moat: "hsl(var(--score-excellent))",
};

const chartConfig = {
  risk: { label: "Risk", color: DIMENSION_COLOR.risk },
  businessModel: { label: "Business Model", color: DIMENSION_COLOR.businessModel },
  moat: { label: "Moat", color: DIMENSION_COLOR.moat },
} satisfies ChartConfig;

const DIRECTION_ICON: Record<TrendDirection, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: ArrowRight,
};

const formatChange = (change: number): string => (change > 0 ? `+${change}` : `${change}`);

const formatFilingDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

const ScoreTrajectoryChart = ({ trajectory }: ScoreTrajectoryChartProps) => {
  // A trend needs at least two comparable annual filings and computed deltas.
  const canShowTrend =
    trajectory.filingsCompared >= 2 && trajectory.points.length >= 2 && trajectory.trends.length > 0;

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Score Trajectory
          </CardTitle>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Risk, business model &amp; moat across recent annual filings.
          </p>
        </CardHeader>
        <CardContent>
          {!canShowTrend ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              Not enough annual filings for a trend yet.
            </div>
          ) : (
            <>
              <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
                <LineChart data={trajectory.points} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="filingDate"
                    tickFormatter={formatFilingDate}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={16}
                  />
                  <YAxis domain={[0, 100]} width={28} tickLine={false} axisLine={false} tickMargin={4} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent labelFormatter={(value) => formatFilingDate(String(value))} />
                    }
                  />
                  <Line dataKey="risk" stroke="var(--color-risk)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                  <Line
                    dataKey="businessModel"
                    stroke="var(--color-businessModel)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line dataKey="moat" stroke="var(--color-moat)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {trajectory.trends.map((trend) => {
                  const DirectionIcon = DIRECTION_ICON[trend.direction];
                  return (
                    <div key={trend.dimension} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: DIMENSION_COLOR[trend.dimension] }}
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{trend.label}</span>
                      <DirectionIcon
                        className={cn(
                          "h-3.5 w-3.5",
                          trend.direction === "flat" ? "text-muted-foreground" : "text-foreground",
                        )}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-foreground">{formatChange(trend.change)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoreTrajectoryChart;

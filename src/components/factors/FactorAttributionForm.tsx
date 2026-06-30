import { useState } from "react";
import { Loader2, LineChart, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { DEFAULT_ROLLING_WINDOW, type FactorAttributionInput, type FactorInputMode } from "@/types/factors";

interface FactorAttributionFormProps {
  onSubmit: (input: FactorAttributionInput) => void;
  isLoading: boolean;
}

/** Local row state — weight is a string while editing, parsed on submit. */
interface HoldingRow {
  ticker: string;
  weight: string;
}

const labelCls = "text-sm font-medium text-muted-foreground uppercase tracking-wider";
const inputCls =
  "bg-muted border-border h-12 text-foreground placeholder:text-muted-foreground/50 font-mono";

const FactorAttributionForm = ({ onSubmit, isLoading }: FactorAttributionFormProps) => {
  const [mode, setMode] = useState<FactorInputMode>("single");
  const [ticker, setTicker] = useState("");
  const [holdings, setHoldings] = useState<HoldingRow[]>([
    { ticker: "", weight: "" },
    { ticker: "", weight: "" },
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rollingWindow, setRollingWindow] = useState("");

  const validHoldings = holdings.filter((h) => h.ticker.trim());
  const canSubmit =
    !isLoading && (mode === "single" ? ticker.trim().length > 0 : validHoldings.length > 0);

  const updateHolding = (index: number, patch: Partial<HoldingRow>) =>
    setHoldings((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  const addHolding = () => setHoldings((prev) => [...prev, { ticker: "", weight: "" }]);
  const removeHolding = (index: number) =>
    setHoldings((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const parsedWindow = Number.parseInt(rollingWindow, 10);
    onSubmit({
      mode,
      ticker: ticker.trim().toUpperCase(),
      holdings: validHoldings.map((h) => {
        const w = Number.parseFloat(h.weight);
        return {
          ticker: h.ticker.trim().toUpperCase(),
          weight: Number.isFinite(w) && w > 0 ? w : 1,
        };
      }),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      rollingWindow: Number.isFinite(parsedWindow) && parsedWindow > 0 ? parsedWindow : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as FactorInputMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single ticker</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "single" ? (
        <div className="space-y-2">
          <label htmlFor="fa-ticker" className={labelCls}>
            Ticker *
          </label>
          <Input
            id="fa-ticker"
            placeholder="e.g. AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className={cn(inputCls, "uppercase")}
            disabled={isLoading}
            maxLength={10}
            required
          />
          <p className="text-xs text-muted-foreground/60">
            A single stock or ETF, treated as a 100% position.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={labelCls}>Holdings *</span>
            <span className="text-xs text-muted-foreground/60">weights are relative</span>
          </div>
          <div className="space-y-2">
            {holdings.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Ticker"
                  value={h.ticker}
                  onChange={(e) => updateHolding(i, { ticker: e.target.value.toUpperCase() })}
                  className={cn(inputCls, "flex-1 uppercase")}
                  disabled={isLoading}
                  maxLength={10}
                  aria-label={`Holding ${i + 1} ticker`}
                />
                <Input
                  placeholder="Weight"
                  value={h.weight}
                  inputMode="decimal"
                  onChange={(e) => updateHolding(i, { weight: e.target.value })}
                  className={cn(inputCls, "w-24")}
                  disabled={isLoading}
                  aria-label={`Holding ${i + 1} weight`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeHolding(i)}
                  disabled={isLoading || holdings.length <= 1}
                  aria-label={`Remove holding ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addHolding}
            disabled={isLoading}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add holding
          </Button>
        </div>
      )}

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Advanced options
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="fa-start" className={labelCls}>
                Start date
              </label>
              <Input
                id="fa-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fa-end" className={labelCls}>
                End date
              </label>
              <Input
                id="fa-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="fa-window" className={labelCls}>
              Rolling window (days)
            </label>
            <Input
              id="fa-window"
              type="number"
              min={20}
              placeholder={String(DEFAULT_ROLLING_WINDOW)}
              value={rollingWindow}
              onChange={(e) => setRollingWindow(e.target.value)}
              className={inputCls}
              disabled={isLoading}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button type="submit" disabled={!canSubmit} className="h-12 w-full gap-2 text-base font-semibold">
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            <LineChart className="h-5 w-5" />
            Run attribution
          </>
        )}
      </Button>
    </form>
  );
};

export default FactorAttributionForm;

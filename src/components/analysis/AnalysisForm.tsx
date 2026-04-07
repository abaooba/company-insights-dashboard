import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AnalysisFormData } from "@/types/analysis";

interface AnalysisFormProps {
  onSubmit: (data: AnalysisFormData) => void;
  isLoading: boolean;
}

const AnalysisForm = ({ onSubmit, isLoading }: AnalysisFormProps) => {
  const [formData, setFormData] = useState<AnalysisFormData>({
    companyName: "",
    ticker: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="companyName" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Company Name *
        </label>
        <Input
          id="companyName"
          placeholder="e.g. Apple Inc."
          value={formData.companyName}
          onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
          className="bg-muted border-border h-12 text-foreground placeholder:text-muted-foreground/50 font-mono"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="ticker" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Ticker <span className="text-muted-foreground/50">(optional)</span>
        </label>
        <Input
          id="ticker"
          placeholder="e.g. AAPL"
          value={formData.ticker}
          onChange={(e) => setFormData((prev) => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
          className="bg-muted border-border h-12 text-foreground placeholder:text-muted-foreground/50 font-mono uppercase"
          disabled={isLoading}
          maxLength={10}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.companyName.trim()}
        className="w-full h-12 text-base font-semibold gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Analyze
          </>
        )}
      </Button>
    </form>
  );
};

export default AnalysisForm;

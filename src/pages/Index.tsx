import { useState, useCallback } from "react";
import { Activity } from "lucide-react";
import AnalysisForm from "@/components/analysis/AnalysisForm";
import ResultsPanel from "@/components/analysis/ResultsPanel";
import LoadingState from "@/components/analysis/LoadingState";
import { PLACEHOLDER_RESULT } from "@/data/placeholder";
import type { AnalysisFormData, AnalysisResult, AnalysisStatus } from "@/types/analysis";

const Index = () => {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback((data: AnalysisFormData) => {
    setStatus("loading");
    setResult(null);

    // Simulate API call — will be replaced with real backend call
    setTimeout(() => {
      setResult({
        ...PLACEHOLDER_RESULT,
        companyName: data.companyName,
        ticker: data.ticker || null,
        analyzedAt: new Date().toISOString(),
      });
      setStatus("success");
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl flex items-center gap-3 h-14 px-4">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Company Analysis Engine
          </h1>
          <span className="ml-auto text-xs font-mono text-muted-foreground/50 hidden sm:block">
            v0.1 — frontend only
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Sidebar — Form */}
          <aside className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                New Analysis
              </h2>
              <p className="text-sm text-muted-foreground/70">
                Enter a company to score across financials, risk, moat, and more.
              </p>
            </div>
            <AnalysisForm onSubmit={handleAnalyze} isLoading={status === "loading"} />
          </aside>

          {/* Results area */}
          <section className="min-h-[400px]">
            {status === "idle" && (
              <div className="flex items-center justify-center h-full text-muted-foreground/30">
                <p className="text-sm font-mono">Enter a company to begin analysis</p>
              </div>
            )}
            {status === "loading" && <LoadingState />}
            {status === "success" && result && <ResultsPanel result={result} />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;

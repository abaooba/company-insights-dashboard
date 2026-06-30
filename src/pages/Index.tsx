import SiteHeader from "@/components/SiteHeader";
import AnalyzeCompanyForm from "@/components/analysis/AnalyzeCompanyForm";
import ResultsPanel from "@/components/analysis/ResultsPanel";
import LoadingState from "@/components/analysis/LoadingState";
import ErrorState from "@/components/analysis/ErrorState";
import { useAnalysisJob } from "@/lib/backgroundJobs";

const Index = () => {
  // Job state is provided above the router, so an in-flight analysis survives
  // navigating to another tab and back.
  const { status, result, run, retry } = useAnalysisJob();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                New Analysis
              </h2>
              <p className="text-sm text-muted-foreground/70">
                Enter a company to score across financials, risk, moat, and more.
              </p>
            </div>
            <AnalyzeCompanyForm onSubmit={run} isLoading={status === "loading"} />
          </aside>

          <section className="min-h-[400px]">
            {status === "idle" && (
              <div className="flex items-center justify-center h-full text-muted-foreground/30">
                <p className="text-sm font-mono">Enter a company to begin analysis</p>
              </div>
            )}
            {status === "loading" && <LoadingState />}
            {status === "success" && result && <ResultsPanel result={result} />}
            {status === "error" && <ErrorState onRetry={retry} />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;

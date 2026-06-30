import SiteHeader from "@/components/SiteHeader";
import FactorAttributionForm from "@/components/factors/FactorAttributionForm";
import FactorResultsPanel from "@/components/factors/FactorResultsPanel";
import LoadingState from "@/components/analysis/LoadingState";
import ErrorState from "@/components/analysis/ErrorState";
import { useFactorJob } from "@/lib/backgroundJobs";

const FACTOR_STEPS = [
  "Downloading price history…",
  "Loading Fama-French factors…",
  "Aligning excess returns…",
  "Running factor regressions…",
  "Building return attribution…",
];

const Factors = () => {
  // Job state is provided above the router, so an in-flight attribution run
  // survives navigating to another tab and back.
  const { status, result, error, run, retry } = useFactorJob();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Factor Attribution
              </h2>
              <p className="text-sm text-muted-foreground/70">
                Decompose a portfolio or single ticker against the Fama-French 5 + Momentum model.
              </p>
            </div>
            <FactorAttributionForm onSubmit={run} isLoading={status === "loading"} />
          </aside>

          <section className="min-h-[400px]">
            {status === "idle" && (
              <div className="flex items-center justify-center h-full text-muted-foreground/30">
                <p className="text-sm font-mono">Enter a ticker or portfolio to run attribution</p>
              </div>
            )}
            {status === "loading" && <LoadingState steps={FACTOR_STEPS} />}
            {status === "success" && result && <FactorResultsPanel result={result} />}
            {status === "error" && <ErrorState message={error} onRetry={retry} />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Factors;

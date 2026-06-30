/* eslint-disable react-refresh/only-export-components --
   Context plumbing: each job's Provider + hook are intentionally colocated.
   This module isn't a fast-refreshable component file. */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { analyzeCompany } from "@/lib/analysisService";
import { runFactorAttribution } from "@/lib/factorService";
import type { AnalysisFormData, AnalysisResult } from "@/types/analysis";
import type { FactorAttributionInput, FactorAttributionResult } from "@/types/factors";

export type JobStatus = "idle" | "loading" | "success" | "error";

export interface JobController<TInput, TResult> {
  status: JobStatus;
  result: TResult | null;
  error?: string;
  lastInput: TInput | null;
  /**
   * Start a run. Safe to call and then navigate away — the request keeps going
   * and its result lands in this provider's state (which lives above the router).
   */
  run: (input: TInput) => void;
  /** Re-run the last input (e.g. from an error state). */
  retry: () => void;
  /** Clear back to idle. */
  reset: () => void;
}

/**
 * Builds a Provider + hook pair owning the lifecycle of one async job
 * (loading → success/error). Mounted above the router in App, this state
 * outlives page unmounts: switching tabs while a request is in flight doesn't
 * cancel it, and the finished result is still there when you come back.
 */
export function createJobContext<TInput, TResult>(
  runner: (input: TInput) => Promise<TResult>,
  name: string,
) {
  const Context = createContext<JobController<TInput, TResult> | null>(null);
  Context.displayName = name;

  const Provider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<JobStatus>("idle");
    const [result, setResult] = useState<TResult | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [lastInput, setLastInput] = useState<TInput | null>(null);
    // Tags each run so a stale request resolving after a newer run (or a reset)
    // can't overwrite current state.
    const runIdRef = useRef(0);

    const run = useCallback((input: TInput) => {
      const id = ++runIdRef.current;
      setStatus("loading");
      setResult(null);
      setError(undefined);
      setLastInput(input);

      runner(input)
        .then((res) => {
          if (runIdRef.current === id) {
            setResult(res);
            setStatus("success");
          }
        })
        .catch((err: unknown) => {
          if (runIdRef.current === id) {
            setError(err instanceof Error ? err.message : "Request failed.");
            setStatus("error");
          }
        });
    }, []);

    const retry = useCallback(() => {
      if (lastInput !== null) run(lastInput);
    }, [lastInput, run]);

    const reset = useCallback(() => {
      runIdRef.current += 1;
      setStatus("idle");
      setResult(null);
      setError(undefined);
      setLastInput(null);
    }, []);

    const value = useMemo<JobController<TInput, TResult>>(
      () => ({ status, result, error, lastInput, run, retry, reset }),
      [status, result, error, lastInput, run, retry, reset],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useJob = (): JobController<TInput, TResult> => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`use${name} must be used within <${name}Provider>`);
    return ctx;
  };

  return { Provider, useJob };
}

const analysisJob = createJobContext<AnalysisFormData, AnalysisResult>(analyzeCompany, "AnalysisJob");
export const AnalysisJobProvider = analysisJob.Provider;
export const useAnalysisJob = analysisJob.useJob;

const factorJob = createJobContext<FactorAttributionInput, FactorAttributionResult>(
  runFactorAttribution,
  "FactorJob",
);
export const FactorJobProvider = factorJob.Provider;
export const useFactorJob = factorJob.useJob;

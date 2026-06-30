import type {
  BackendFactorAttributionSuccess,
  FactorAttributionResult,
  FactorBeta,
  RollingSeries,
} from "@/types/factors";
import { FACTOR_ORDER } from "@/types/factors";

/**
 * Transforms the snake_case `/factor-attribution` success payload into the
 * camelCase view-model the dashboard renders. The `betas` records (keyed by
 * factor) become ordered arrays following FACTOR_ORDER so charts and tables
 * iterate deterministically. Returns are decimals throughout — formatting to
 * percent happens at the view layer.
 */
export function transformFactorResponse(
  raw: BackendFactorAttributionSuccess,
): FactorAttributionResult {
  const fs = raw.full_sample;
  const betas: FactorBeta[] = FACTOR_ORDER.filter((f) => fs.betas[f]).map((f) => {
    const b = fs.betas[f]!;
    return {
      factor: f,
      stats: {
        beta: b.beta,
        label: b.label,
        stdErr: b.std_err,
        tStat: b.t_stat,
        pValue: b.p_value,
        confInt: b.conf_int,
        significant: b.significant,
      },
    };
  });

  const rolling = raw.rolling;
  const rollingBetas: RollingSeries[] = FACTOR_ORDER.filter((f) => rolling.betas[f]).map((f) => ({
    factor: f,
    values: rolling.betas[f]!,
  }));

  return {
    portfolio: {
      holdings: raw.portfolio.holdings.map((h) => ({ ticker: h.ticker, weight: h.weight })),
      droppedTickers: raw.portfolio.dropped_tickers ?? [],
      startDate: raw.portfolio.start_date,
      endDate: raw.portfolio.end_date,
      observations: raw.portfolio.observations,
      firstDate: raw.portfolio.first_date,
      lastDate: raw.portfolio.last_date,
    },
    factorModel: raw.factor_model,
    factors: raw.factors,
    fullSample: {
      alpha: {
        daily: fs.alpha.daily,
        annualized: fs.alpha.annualized,
        stdErr: fs.alpha.std_err,
        tStat: fs.alpha.t_stat,
        pValue: fs.alpha.p_value,
        confIntDaily: fs.alpha.conf_int_daily,
        significant: fs.alpha.significant,
      },
      betas,
      rSquared: fs.r_squared,
      adjRSquared: fs.adj_r_squared,
      nObs: fs.n_obs,
    },
    rolling: {
      window: rolling.window,
      available: rolling.available,
      observations: rolling.observations,
      dates: rolling.dates ?? [],
      betas: rollingBetas,
      alphaAnnualized: rolling.alpha_annualized ?? [],
      rSquared: rolling.r_squared ?? [],
    },
    attribution: {
      basis: raw.attribution.basis,
      totalExcessReturnAnnualized: raw.attribution.total_excess_return_annualized,
      explainedByFactorsAnnualized: raw.attribution.explained_by_factors_annualized,
      alphaAnnualized: raw.attribution.alpha_annualized,
      residualAnnualized: raw.attribution.residual_annualized,
      components: raw.attribution.components.map((c) => ({
        factor: c.factor,
        label: c.label,
        beta: c.beta,
        factorAvgReturnAnnualized: c.factor_avg_return_annualized,
        contributionAnnualized: c.contribution_annualized,
        pctOfTotal: c.pct_of_total,
      })),
    },
    analyzedAt: new Date().toISOString(),
  };
}

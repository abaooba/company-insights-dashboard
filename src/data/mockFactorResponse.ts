import type { BackendFactorAttributionSuccess } from "@/types/factors";

/**
 * A representative `POST /factor-attribution` success payload (snake_case, as the
 * backend returns it). Mirrors the verified contract; betas are intentionally
 * out of canonical order so the transform's reordering is exercised.
 */
export const mockFactorApiResponse: BackendFactorAttributionSuccess = {
  portfolio: {
    holdings: [
      { ticker: "AAPL", weight: 0.6 },
      { ticker: "MSFT", weight: 0.4 },
    ],
    dropped_tickers: ["BADX"],
    start_date: "2019-01-02",
    end_date: "2024-01-02",
    observations: 1200,
    first_date: "2019-01-02",
    last_date: "2023-12-29",
  },
  factor_model: "Fama-French 5 Factor + Momentum",
  factors: ["Mkt-RF", "SMB", "HML", "RMW", "CMA", "Mom"],
  full_sample: {
    alpha: {
      daily: 0.0001,
      annualized: 0.0252,
      std_err: 0.0002,
      t_stat: 1.2,
      p_value: 0.23,
      conf_int_daily: [-0.0001, 0.0003],
      significant: false,
    },
    betas: {
      SMB: { beta: -0.12, label: "Size (SMB)", std_err: 0.05, t_stat: -2.4, p_value: 0.017, conf_int: [-0.22, -0.02], significant: true },
      "Mkt-RF": { beta: 1.05, label: "Market", std_err: 0.03, t_stat: 35, p_value: 0.0, conf_int: [0.99, 1.11], significant: true },
      HML: { beta: 0.08, label: "Value (HML)", std_err: 0.06, t_stat: 1.3, p_value: 0.19, conf_int: [-0.04, 0.2], significant: false },
      RMW: { beta: 0.2, label: "Profitability (RMW)", std_err: 0.07, t_stat: 2.9, p_value: 0.004, conf_int: [0.06, 0.34], significant: true },
      CMA: { beta: -0.05, label: "Investment (CMA)", std_err: 0.08, t_stat: -0.6, p_value: 0.55, conf_int: [-0.21, 0.11], significant: false },
      Mom: { beta: 0.03, label: "Momentum", std_err: 0.04, t_stat: 0.75, p_value: 0.45, conf_int: [-0.05, 0.11], significant: false },
    },
    r_squared: 0.91,
    adj_r_squared: 0.9,
    n_obs: 1200,
  },
  rolling: {
    window: 126,
    available: true,
    observations: 2,
    dates: ["2023-06-30", "2023-12-29"],
    betas: {
      "Mkt-RF": [1.0, 1.1],
      SMB: [-0.1, -0.13],
      HML: [0.05, 0.09],
      RMW: [0.18, 0.22],
      CMA: [-0.04, -0.06],
      Mom: [0.02, 0.04],
    },
    alpha_annualized: [0.02, 0.03],
    r_squared: [0.9, null],
  },
  attribution: {
    basis: "annualized_excess_return",
    total_excess_return_annualized: 0.12,
    explained_by_factors_annualized: 0.095,
    alpha_annualized: 0.0252,
    residual_annualized: -0.0002,
    components: [
      { factor: "Mkt-RF", label: "Market", beta: 1.05, factor_avg_return_annualized: 0.08, contribution_annualized: 0.084, pct_of_total: 70.0 },
      { factor: "alpha", label: "Alpha (idiosyncratic)", beta: null, factor_avg_return_annualized: null, contribution_annualized: 0.0252, pct_of_total: 21.0 },
    ],
  },
};

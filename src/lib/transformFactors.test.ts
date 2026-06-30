import { describe, it, expect } from "vitest";
import { transformFactorResponse } from "@/lib/transformFactors";
import { mockFactorApiResponse } from "@/data/mockFactorResponse";

describe("transformFactorResponse", () => {
  it("maps snake_case to camelCase and orders betas by FACTOR_ORDER", () => {
    const r = transformFactorResponse(mockFactorApiResponse);

    expect(r.factorModel).toBe("Fama-French 5 Factor + Momentum");
    expect(r.portfolio.droppedTickers).toEqual(["BADX"]);
    expect(r.portfolio.holdings[0]).toEqual({ ticker: "AAPL", weight: 0.6 });

    // betas arrive out of order in the payload; transform must canonicalize them.
    expect(r.fullSample.betas.map((b) => b.factor)).toEqual([
      "Mkt-RF",
      "SMB",
      "HML",
      "RMW",
      "CMA",
      "Mom",
    ]);
    expect(r.fullSample.betas[0].stats.beta).toBe(1.05);
    expect(r.fullSample.betas[0].stats.stdErr).toBe(0.03);
    expect(r.fullSample.alpha.annualized).toBeCloseTo(0.0252);
    expect(r.fullSample.alpha.confIntDaily).toEqual([-0.0001, 0.0003]);
  });

  it("reshapes the rolling series and preserves R² nulls", () => {
    const r = transformFactorResponse(mockFactorApiResponse);

    expect(r.rolling.available).toBe(true);
    expect(r.rolling.betas.map((s) => s.factor)).toEqual([
      "Mkt-RF",
      "SMB",
      "HML",
      "RMW",
      "CMA",
      "Mom",
    ]);
    expect(r.rolling.betas[0].values).toEqual([1.0, 1.1]);
    expect(r.rolling.rSquared).toEqual([0.9, null]);
  });

  it("maps the attribution waterfall including the alpha slice", () => {
    const r = transformFactorResponse(mockFactorApiResponse);

    expect(r.attribution.totalExcessReturnAnnualized).toBe(0.12);
    const alphaSlice = r.attribution.components.find((c) => c.factor === "alpha");
    expect(alphaSlice?.beta).toBeNull();
    expect(alphaSlice?.factorAvgReturnAnnualized).toBeNull();
    expect(alphaSlice?.contributionAnnualized).toBeCloseTo(0.0252);
  });
});

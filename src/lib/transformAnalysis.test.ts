import { describe, it, expect } from "vitest";
import { transformBackendResponse } from "@/lib/transformAnalysis";
import type { AnalysisFormData, BackendAnalysisResponse } from "@/types/analysis";

const formData: AnalysisFormData = { companyName: "Test Co", ticker: "TST" };

/** A minimal valid backend response with no T4 fields present. */
function baseResponse(): BackendAnalysisResponse {
  return {
    company_cik: "0000000000",
    company_name: "Test Co",
    ticker: "TST",
    overall_score: 50,
    scores: { financial: 50, risk: 50, business_model: 50, moat: 50, geopolitical: 50 },
    strengths: [],
    weaknesses: [],
    recent_changes: [],
    summary: "",
    details: {} as BackendAnalysisResponse["details"],
    llm_analysis: null,
  };
}

describe("transformBackendResponse — T4 fields", () => {
  it("maps absent T4 fields to null / empty array", () => {
    const result = transformBackendResponse(baseResponse(), formData);
    expect(result.confidence).toBeNull();
    expect(result.forensic).toBeNull();
    expect(result.scoreTrajectory).toBeNull();
    expect(result.contradictions).toEqual([]);
  });

  it("maps confidence factors from snake_case to camelCase", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      confidence: {
        score: 80,
        level: "high",
        factors: {
          risk_factors_text: true,
          business_text: false,
          mdna_text: true,
          financial_metrics_present: 5,
          year_over_year_data: true,
          news_articles_analyzed: 12,
        },
      },
    };
    expect(transformBackendResponse(raw, formData).confidence).toEqual({
      score: 80,
      level: "high",
      factors: {
        riskFactorsText: true,
        businessText: false,
        mdnaText: true,
        financialMetricsPresent: 5,
        yearOverYearData: true,
        newsArticlesAnalyzed: 12,
      },
    });
  });

  it("builds forensic findings with human labels and evidence, preserving flag order", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      forensic: {
        total_forensic_score: 6,
        flags: ["impairment", "related_party"],
        category_scores: {},
        matched_keywords: {},
        evidence_sentences: {
          impairment: ["Goodwill is tested for impairment annually.", "Recorded a write-down."],
          related_party: ["Transactions with related parties were on arm's-length terms."],
        },
      },
    };
    const { forensic } = transformBackendResponse(raw, formData);
    expect(forensic?.totalScore).toBe(6);
    expect(forensic?.findings).toEqual([
      {
        flag: "impairment",
        label: "Impairment",
        evidence: ["Goodwill is tested for impairment annually.", "Recorded a write-down."],
      },
      {
        flag: "related_party",
        label: "Related-party transactions",
        evidence: ["Transactions with related parties were on arm's-length terms."],
      },
    ]);
  });

  it("keeps a present-but-clean forensic report distinct from an absent one", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      forensic: {
        total_forensic_score: 0,
        flags: [],
        category_scores: {},
        matched_keywords: {},
        evidence_sentences: {},
      },
    };
    const { forensic } = transformBackendResponse(raw, formData);
    expect(forensic).not.toBeNull();
    expect(forensic?.findings).toEqual([]);
  });

  it("defaults missing evidence for a fired flag to an empty array", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      forensic: {
        total_forensic_score: 2,
        flags: ["going_concern"],
        category_scores: {},
        matched_keywords: {},
        evidence_sentences: {},
      },
    };
    expect(transformBackendResponse(raw, formData).forensic?.findings).toEqual([
      { flag: "going_concern", label: "Going concern", evidence: [] },
    ]);
  });

  it("maps trajectory points to camelCase and orders trends risk → businessModel → moat", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      score_trajectory: {
        points: [
          { filing_date: "2022-01-01", form: "10-K", risk: 1, business_model: 2, moat: 3 },
          { filing_date: "2023-01-01", form: "10-K", risk: 4, business_model: 5, moat: 6 },
        ],
        filings_compared: 2,
        // Deliberately out of order to prove the transform re-orders them.
        trends: {
          moat: { change: 3, direction: "up" },
          risk: { change: 3, direction: "up" },
          business_model: { change: 3, direction: "up" },
        },
      },
    };
    const { scoreTrajectory } = transformBackendResponse(raw, formData);
    expect(scoreTrajectory?.points[0]).toEqual({
      filingDate: "2022-01-01",
      form: "10-K",
      risk: 1,
      businessModel: 2,
      moat: 3,
    });
    expect(scoreTrajectory?.filingsCompared).toBe(2);
    expect(scoreTrajectory?.trends.map((t) => t.dimension)).toEqual(["risk", "businessModel", "moat"]);
    expect(scoreTrajectory?.trends[0]).toEqual({
      dimension: "risk",
      label: "Risk",
      change: 3,
      direction: "up",
    });
  });

  it("leaves trends empty for a single-filing trajectory", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      score_trajectory: {
        points: [{ filing_date: "2023-01-01", form: "10-K", risk: 4, business_model: 5, moat: 6 }],
        filings_compared: 1,
        trends: {},
      },
    };
    const { scoreTrajectory } = transformBackendResponse(raw, formData);
    expect(scoreTrajectory?.trends).toEqual([]);
    expect(scoreTrajectory?.points).toHaveLength(1);
  });

  it("passes contradictions through unchanged", () => {
    const raw: BackendAnalysisResponse = {
      ...baseResponse(),
      contradictions: ["Tension one.", "Tension two."],
    };
    expect(transformBackendResponse(raw, formData).contradictions).toEqual(["Tension one.", "Tension two."]);
  });
});

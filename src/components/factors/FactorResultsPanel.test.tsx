import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FactorResultsPanel from "@/components/factors/FactorResultsPanel";
import { transformFactorResponse } from "@/lib/transformFactors";
import { mockFactorApiResponse } from "@/data/mockFactorResponse";

describe("FactorResultsPanel", () => {
  const result = transformFactorResponse(mockFactorApiResponse);

  it("renders all four response blocks without throwing", () => {
    render(<FactorResultsPanel result={result} />);

    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Factor Exposures")).toBeInTheDocument();
    expect(screen.getByText("Rolling Exposures")).toBeInTheDocument();
    expect(screen.getByText("Return Attribution")).toBeInTheDocument();
  });

  it("surfaces portfolio holdings and the dropped ticker", () => {
    render(<FactorResultsPanel result={result} />);

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("MSFT")).toBeInTheDocument();
    expect(screen.getByText(/BADX/)).toBeInTheDocument();
  });
});

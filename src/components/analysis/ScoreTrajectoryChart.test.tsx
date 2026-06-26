import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreTrajectoryChart from "./ScoreTrajectoryChart";
import type { ScoreTrajectory } from "@/types/analysis";

const full: ScoreTrajectory = {
  points: [
    { filingDate: "2022-01-01", form: "10-K", risk: 1, businessModel: 2, moat: 3 },
    { filingDate: "2023-01-01", form: "10-K", risk: 4, businessModel: 2, moat: 6 },
  ],
  filingsCompared: 2,
  trends: [
    { dimension: "risk", label: "Risk", change: 3, direction: "up" },
    { dimension: "businessModel", label: "Business Model", change: 0, direction: "flat" },
    { dimension: "moat", label: "Moat", change: 3, direction: "up" },
  ],
};

describe("ScoreTrajectoryChart", () => {
  it("renders the per-dimension trend summary with signed changes", () => {
    render(<ScoreTrajectoryChart trajectory={full} />);
    expect(screen.getByText("Risk")).toBeInTheDocument();
    expect(screen.getByText("Business Model")).toBeInTheDocument();
    expect(screen.getByText("Moat")).toBeInTheDocument();
    // Risk and Moat both moved +3.
    expect(screen.getAllByText("+3")).toHaveLength(2);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows a fallback when there are too few filings to trend", () => {
    const thin: ScoreTrajectory = {
      points: [{ filingDate: "2023-01-01", form: "10-K", risk: 1, businessModel: 2, moat: 3 }],
      filingsCompared: 1,
      trends: [],
    };
    render(<ScoreTrajectoryChart trajectory={thin} />);
    expect(screen.getByText(/not enough annual filings/i)).toBeInTheDocument();
  });
});

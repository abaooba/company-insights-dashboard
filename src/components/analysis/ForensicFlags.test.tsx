import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ForensicFlags from "./ForensicFlags";
import type { ForensicReport } from "@/types/analysis";

describe("ForensicFlags", () => {
  it("shows a reassuring state when no flags fired", () => {
    render(<ForensicFlags forensic={{ totalScore: 0, findings: [] }} />);
    expect(screen.getByText(/no forensic red flags detected/i)).toBeInTheDocument();
  });

  it("renders a chip per finding and reveals evidence on expand", () => {
    const forensic: ForensicReport = {
      totalScore: 4,
      findings: [{ flag: "impairment", label: "Impairment", evidence: ["Goodwill is tested for impairment annually."] }],
    };
    render(<ForensicFlags forensic={forensic} />);

    expect(screen.getByText("Impairment")).toBeInTheDocument();
    // Evidence is collapsed initially.
    expect(screen.queryByText(/goodwill is tested for impairment/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /impairment/i }));
    expect(screen.getByText(/goodwill is tested for impairment/i)).toBeInTheDocument();
  });

  it("renders a non-expandable chip when a flag has no evidence", () => {
    render(
      <ForensicFlags
        forensic={{ totalScore: 2, findings: [{ flag: "going_concern", label: "Going concern", evidence: [] }] }}
      />,
    );
    expect(screen.getByRole("button", { name: /going concern/i })).toBeDisabled();
  });
});

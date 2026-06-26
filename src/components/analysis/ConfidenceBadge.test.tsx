import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConfidenceBadge from "./ConfidenceBadge";
import type { Confidence } from "@/types/analysis";

const base: Confidence = {
  score: 80,
  level: "high",
  factors: {
    riskFactorsText: true,
    businessText: true,
    mdnaText: true,
    financialMetricsPresent: 5,
    yearOverYearData: true,
    newsArticlesAnalyzed: 12,
  },
};

function renderBadge(confidence: Confidence) {
  return render(
    <TooltipProvider>
      <ConfidenceBadge confidence={confidence} />
    </TooltipProvider>,
  );
}

describe("ConfidenceBadge", () => {
  it("shows the level label and score", () => {
    renderBadge(base);
    const badge = screen.getByRole("button");
    expect(badge).toHaveTextContent("Confidence: High");
    expect(badge).toHaveTextContent("(80/100)");
    expect(badge).toHaveAttribute("aria-label", "Analysis confidence: High, 80 out of 100");
  });

  it("gives low confidence an accessible, distinct label", () => {
    renderBadge({ ...base, level: "low", score: 20 });
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Analysis confidence: Low, 20 out of 100",
    );
  });
});

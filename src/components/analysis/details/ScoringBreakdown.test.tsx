import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ScoringBreakdown from "./ScoringBreakdown";
import { MOCK_BACKEND_RESPONSE } from "@/data/mockApiResponse";

const details = MOCK_BACKEND_RESPONSE.details;

describe("ScoringBreakdown", () => {
  it("renders the section header and the default-open financial snapshot", () => {
    render(<ScoringBreakdown details={details} />);

    expect(screen.getByText(/scoring breakdown/i)).toBeInTheDocument();
    // Financials is open by default: its snapshot metrics + category bars show.
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$143.76B")).toBeInTheDocument();
    // "Profitability" is both a category-bar label and its notes-group heading.
    expect(screen.getAllByText("Profitability").length).toBeGreaterThan(0);
    expect(screen.getByText("Very high capital efficiency.")).toBeInTheDocument();
  });

  it("reveals geopolitics news articles with links when expanded", () => {
    render(<ScoringBreakdown details={details} />);

    // Collapsed by default.
    expect(screen.queryByText(/oil prices surge toward/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /geopolitics/i }));

    const article = screen.getByText(/oil prices surge toward/i);
    expect(article).toBeInTheDocument();
    expect(article.closest("a")).toHaveAttribute("href", "https://news.google.com/rss/articles/example5");
  });

  it("shows a baseline note for a dimension with no keyword matches", () => {
    render(<ScoringBreakdown details={details} />);

    fireEvent.click(screen.getByRole("button", { name: /moat/i }));
    expect(screen.getByText(/stayed at its 35-point baseline/i)).toBeInTheDocument();
  });
});

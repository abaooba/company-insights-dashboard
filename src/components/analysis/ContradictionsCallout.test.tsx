import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContradictionsCallout from "./ContradictionsCallout";

describe("ContradictionsCallout", () => {
  it("renders each tension when present", () => {
    render(<ContradictionsCallout contradictions={["Tension A", "Tension B"]} />);
    expect(screen.getByText("Tensions to weigh")).toBeInTheDocument();
    expect(screen.getByText("Tension A")).toBeInTheDocument();
    expect(screen.getByText("Tension B")).toBeInTheDocument();
  });

  it("renders nothing when there are no contradictions", () => {
    const { container } = render(<ContradictionsCallout contradictions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

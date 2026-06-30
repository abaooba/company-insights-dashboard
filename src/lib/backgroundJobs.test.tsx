import { describe, it, expect } from "vitest";
import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createJobContext } from "@/lib/backgroundJobs";

describe("createJobContext", () => {
  it("keeps a run alive and retains its result across consumer unmount/remount", async () => {
    // A runner whose promise we resolve manually, to simulate an in-flight request.
    let resolveRun!: () => void;
    const runner = (input: string) =>
      new Promise<string>((resolve) => {
        resolveRun = () => resolve(`done:${input}`);
      });

    const { Provider, useJob } = createJobContext<string, string>(runner, "Test");

    const Consumer = () => {
      const { status, result, run } = useJob();
      return (
        <div>
          <span data-testid="status">{status}</span>
          <span data-testid="result">{result ?? "none"}</span>
          <button onClick={() => run("AAPL")}>run</button>
        </div>
      );
    };

    // The Provider stays mounted; only the Consumer is toggled (mimics routing).
    const Harness = () => {
      const [mounted, setMounted] = useState(true);
      return (
        <Provider>
          <button onClick={() => setMounted((m) => !m)}>toggle</button>
          {mounted && <Consumer />}
        </Provider>
      );
    };

    render(<Harness />);

    fireEvent.click(screen.getByText("run"));
    expect(screen.getByTestId("status").textContent).toBe("loading");

    // Navigate away while the request is still in flight.
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.queryByTestId("status")).toBeNull();

    // The request completes in the background, with no consumer mounted.
    await act(async () => {
      resolveRun();
    });

    // Come back — the finished result is there, not lost.
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByTestId("status").textContent).toBe("success");
    expect(screen.getByTestId("result").textContent).toBe("done:AAPL");
  });

  it("ignores a stale run superseded by a newer one", async () => {
    const resolvers: Array<() => void> = [];
    const runner = (input: string) =>
      new Promise<string>((resolve) => {
        resolvers.push(() => resolve(input));
      });

    const { Provider, useJob } = createJobContext<string, string>(runner, "Test2");

    const Consumer = () => {
      const { status, result, run } = useJob();
      return (
        <div>
          <span data-testid="status">{status}</span>
          <span data-testid="result">{result ?? "none"}</span>
          <button onClick={() => run("first")}>first</button>
          <button onClick={() => run("second")}>second</button>
        </div>
      );
    };

    render(
      <Provider>
        <Consumer />
      </Provider>,
    );

    fireEvent.click(screen.getByText("first"));
    fireEvent.click(screen.getByText("second"));

    // Resolve the FIRST (now stale) request last; it must not clobber state.
    await act(async () => {
      resolvers[1]();
      resolvers[0]();
    });

    expect(screen.getByTestId("result").textContent).toBe("second");
  });
});

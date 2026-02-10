import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useThrottle } from "./index";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("keeps previous value until delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: "first", delay: 300 } },
    );

    expect(result.current).toBe("first");

    rerender({ value: "second", delay: 300 });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("second");
  });

  it("throttles multiple rapid changes to one update after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: "first", delay: 300 } },
    );

    rerender({ value: "second", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "third", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("third");
  });

  it("clears timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: "first", delay: 300 } },
    );
    rerender({ value: "second", delay: 300 });

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("updates when delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: "hello", delay: 500 } },
    );

    rerender({ value: "world", delay: 100 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("world");
  });
});

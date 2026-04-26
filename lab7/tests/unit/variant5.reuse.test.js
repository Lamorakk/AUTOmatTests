/**
 * Unit suite — reuses production code from lab3 (variant 5). Minimum five checks.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { random, round, trunc } from "../../../lab3/src/variant5.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Lab3 variant5 — round / trunc / random (lab7 unified suite)", () => {
  it("round: positive and negative non-half cases", () => {
    expect(round(2.4)).toBe(2);
    expect(round(-2.6)).toBe(-3);
  });

  it("round: ECMAScript half toward +Infinity", () => {
    expect(round(2.5)).toBe(3);
    expect(round(-3.5)).toBe(-3);
  });

  it("trunc: drops fractional part toward zero", () => {
    expect(trunc(3.9)).toBe(3);
    expect(trunc(-3.9)).toBe(-3);
  });

  it("round and trunc propagate NaN", () => {
    expect(Number.isNaN(round(Number.NaN))).toBe(true);
    expect(Number.isNaN(trunc(Number.NaN))).toBe(true);
  });

  it("random: delegates to Math.random when mocked", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.25);
    expect(random()).toBe(0.25);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("random: values stay in [0, 1) without mock", () => {
    vi.spyOn(Math, "random").mockRestore();
    const value = random();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});

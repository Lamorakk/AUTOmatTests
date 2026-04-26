import { afterEach, describe, expect, it, vi } from "vitest";
import { random, round, trunc } from "../src/variant5.js";

describe("variant 5 — round", () => {
  it("rounds toward nearest integer (non-half cases)", () => {
    expect(round(2.4)).toBe(2);
    expect(round(2.6)).toBe(3);
    expect(round(-2.4)).toBe(-2);
    expect(round(-2.6)).toBe(-3);
  });

  it("handles ties at .5 per ECMAScript (choose integer closer to +Infinity)", () => {
    expect(round(2.5)).toBe(3);
    expect(round(3.5)).toBe(4);
    expect(round(-2.5)).toBe(-2);
    expect(round(-3.5)).toBe(-3);
  });

  it("passes integers through unchanged", () => {
    expect(round(0)).toBe(0);
    expect(round(42)).toBe(42);
    expect(round(-7)).toBe(-7);
  });

  it("matches Math.round for edge cases", () => {
    expect(round(Number.EPSILON)).toBe(0);
    expect(round(-0)).toBe(-0);
    expect(Object.is(round(-0), -0)).toBe(true);
  });

  it("returns NaN for NaN input like Math.round", () => {
    expect(round(Number.NaN)).toBeNaN();
  });

  it("returns Infinity for infinite inputs", () => {
    expect(round(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(round(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
  });
});

describe("variant 5 — trunc", () => {
  it("removes fractional part toward zero", () => {
    expect(trunc(3.9)).toBe(3);
    expect(trunc(-3.9)).toBe(-3);
    expect(trunc(0.1)).toBe(0);
    expect(trunc(-0.1)).toBe(-0);
  });

  it("leaves integers unchanged", () => {
    expect(trunc(100)).toBe(100);
    expect(trunc(-100)).toBe(-100);
  });

  it("matches Math.trunc for edge cases", () => {
    expect(trunc(Number.EPSILON)).toBe(0);
    expect(Object.is(trunc(-0), -0)).toBe(true);
  });

  it("returns NaN for NaN input", () => {
    expect(trunc(Number.NaN)).toBeNaN();
  });

  it("returns Infinity for infinite inputs", () => {
    expect(trunc(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(trunc(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
  });
});

describe("variant 5 — random", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the same value Math.random returns when not mocked", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.375);
    expect(random()).toBe(0.375);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("produces values in [0, 1) across many samples", () => {
    vi.spyOn(Math, "random").mockRestore();
    const iterations = 500;
    for (let index = 0; index < iterations; index += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("can return values arbitrarily close to 0 and below 1 when mocked at boundaries", () => {
    const justBelowOne = 1 - Number.EPSILON;
    const spy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(Number.EPSILON)
      .mockReturnValueOnce(justBelowOne);
    expect(random()).toBe(0);
    expect(random()).toBe(Number.EPSILON);
    expect(random()).toBe(justBelowOne);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});

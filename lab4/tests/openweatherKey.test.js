import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldRunOpenWeatherLiveTests } from "./openweatherKey.mjs";

describe("shouldRunOpenWeatherLiveTests", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when integration flag is not 1", () => {
    vi.stubEnv("OPENWEATHER_RUN_INTEGRATION", "0");
    vi.stubEnv("OPENWEATHER_API_KEY", "a".repeat(40));
    expect(shouldRunOpenWeatherLiveTests()).toBe(false);
  });

  it("returns false when flag is 1 but key is empty", () => {
    vi.stubEnv("OPENWEATHER_RUN_INTEGRATION", "1");
    vi.stubEnv("OPENWEATHER_API_KEY", "   ");
    expect(shouldRunOpenWeatherLiveTests()).toBe(false);
  });

  it("returns true when flag is 1 and key is non-empty", () => {
    vi.stubEnv("OPENWEATHER_RUN_INTEGRATION", "1");
    vi.stubEnv("OPENWEATHER_API_KEY", "dummy-key-for-unit-test");
    expect(shouldRunOpenWeatherLiveTests()).toBe(true);
  });
});

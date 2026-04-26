import { describe, expect, it } from "vitest";
import { fetchCurrentWeatherByCity } from "../src/openWeatherService.js";
import { shouldRunOpenWeatherLiveTests } from "./openweatherKey.mjs";

const apiKey = process.env.OPENWEATHER_API_KEY?.trim() ?? "";
const runOwm = shouldRunOpenWeatherLiveTests();

describe.skipIf(!runOwm)("OpenWeatherMap GET — specific resource (current weather), five checks", () => {
  it("resolves Kyiv with coordinates and metric temperature", async () => {
    const data = await fetchCurrentWeatherByCity("Kyiv", apiKey);
    expect(String(data.name).toLowerCase()).toMatch(/kyiv|kiev/);
    expect(data.coord).toMatchObject({ lat: expect.any(Number), lon: expect.any(Number) });
    expect(data.main).toMatchObject({ temp: expect.any(Number) });
  });

  it("returns weather array with description for London", async () => {
    const data = await fetchCurrentWeatherByCity("London,uk", apiKey);
    expect(data.name).toBe("London");
    expect(Array.isArray(data.weather)).toBe(true);
    expect(data.weather[0]).toMatchObject({ description: expect.any(String) });
  });

  it("includes system country code for Berlin", async () => {
    const data = await fetchCurrentWeatherByCity("Berlin,de", apiKey);
    expect(data.sys?.country).toBe("DE");
  });

  it("reports wind object for Paris", async () => {
    const data = await fetchCurrentWeatherByCity("Paris,fr", apiKey);
    expect(data.wind).toMatchObject({ speed: expect.any(Number) });
  });

  it("returns numeric humidity for Warsaw", async () => {
    const data = await fetchCurrentWeatherByCity("Warsaw", apiKey);
    expect(data.main?.humidity).toEqual(expect.any(Number));
    expect(data.main.humidity).toBeGreaterThanOrEqual(0);
    expect(data.main.humidity).toBeLessThanOrEqual(100);
  });
});

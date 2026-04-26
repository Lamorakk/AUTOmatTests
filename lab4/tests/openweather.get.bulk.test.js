import { describe, expect, it } from "vitest";
import { fetchForecastByCity } from "../src/openWeatherService.js";
import { shouldRunOpenWeatherLiveTests } from "./openweatherKey.mjs";

const apiKey = process.env.OPENWEATHER_API_KEY?.trim() ?? "";
const runOwm = shouldRunOpenWeatherLiveTests();

describe.skipIf(!runOwm)("OpenWeatherMap GET — many records (5-day forecast list), five checks", () => {
  it("returns a non-empty list for Kyiv", async () => {
    const data = await fetchForecastByCity("Kyiv", apiKey);
    expect(Array.isArray(data.list)).toBe(true);
    expect(data.list.length).toBeGreaterThan(5);
  });

  it("each list entry has dt, main.temp, and weather", async () => {
    const data = await fetchForecastByCity("Berlin,de", apiKey);
    const sample = data.list[0];
    expect(sample).toMatchObject({
      dt: expect.any(Number),
      main: { temp: expect.any(Number) },
    });
    expect(Array.isArray(sample.weather)).toBe(true);
  });

  it("includes city metadata with name for London", async () => {
    const data = await fetchForecastByCity("London,uk", apiKey);
    expect(data.city?.name).toBe("London");
  });

  it("list entries are ordered by increasing time", async () => {
    const data = await fetchForecastByCity("Paris,fr", apiKey);
    const timestamps = data.list.map((entry) => entry.dt);
    const sorted = [...timestamps].sort((a, b) => a - b);
    expect(timestamps).toEqual(sorted);
  });

  it("returns cod 200 string on success payload", async () => {
    const data = await fetchForecastByCity("Warsaw", apiKey);
    expect(String(data.cod)).toBe("200");
  });
});

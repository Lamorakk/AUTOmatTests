/**
 * Live OpenWeatherMap calls are opt-in so clones and CI stay green when no key
 * or when a key is invalid. Set `OPENWEATHER_RUN_INTEGRATION=1` in `.env` together with a valid key.
 *
 * @returns {boolean}
 */
export function shouldRunOpenWeatherLiveTests() {
  try {
    if (process.env.OPENWEATHER_RUN_INTEGRATION !== "1") {
      return false;
    }
    const key = process.env.OPENWEATHER_API_KEY;
    return typeof key === "string" && key.trim().length > 0;
  } catch {
    return false;
  }
}

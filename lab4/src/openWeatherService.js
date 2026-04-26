import { createHttpClient } from "./axiosClient.js";

const OPEN_WEATHER_BASE = "https://api.openweathermap.org/data/2.5";

/**
 * @param {unknown} error
 * @returns {string}
 */
function formatAxiosError(error) {
  try {
    if (error && typeof error === "object" && "response" in error) {
      const response = /** @type {import('axios').AxiosError} */ (error).response;
      const status = response?.status;
      const data = response?.data;
      return `HTTP ${status ?? "?"}: ${typeof data === "object" ? JSON.stringify(data) : String(data)}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  } catch (nested) {
    return `formatAxiosError failed: ${nested instanceof Error ? nested.message : String(nested)}`;
  }
}

/**
 * Current weather for one city (GET — specific resource).
 *
 * @param {string} cityName - e.g. `"Kyiv"`, `"London,uk"`.
 * @param {string} apiKey - OpenWeatherMap API key (never commit real keys).
 * @returns {Promise<Record<string, unknown>>}
 */
export async function fetchCurrentWeatherByCity(cityName, apiKey) {
  try {
    const client = createHttpClient();
    const response = await client.get(`${OPEN_WEATHER_BASE}/weather`, {
      params: { q: cityName, appid: apiKey, units: "metric" },
    });
    if (response.status !== 200) {
      throw new Error(`OpenWeather current failed: ${response.status} ${JSON.stringify(response.data)}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(`fetchCurrentWeatherByCity failed: ${formatAxiosError(error)}`);
  }
}

/**
 * 5-day / 3-hour forecast (GET — collection of many time-step records in `list`).
 *
 * @param {string} cityName
 * @param {string} apiKey
 * @returns {Promise<Record<string, unknown>>}
 */
export async function fetchForecastByCity(cityName, apiKey) {
  try {
    const client = createHttpClient();
    const response = await client.get(`${OPEN_WEATHER_BASE}/forecast`, {
      params: { q: cityName, appid: apiKey, units: "metric" },
    });
    if (response.status !== 200) {
      throw new Error(`OpenWeather forecast failed: ${response.status} ${JSON.stringify(response.data)}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(`fetchForecastByCity failed: ${formatAxiosError(error)}`);
  }
}

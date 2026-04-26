import axios from "axios";

/**
 * Builds a shared Axios instance for outbound HTTP calls (timeouts, default headers).
 *
 * @returns {import('axios').AxiosInstance}
 * @example
 * const http = createHttpClient();
 * const { data } = await http.get('https://example.com');
 */
export function createHttpClient() {
  try {
    return axios.create({
      timeout: 20_000,
      validateStatus: () => true,
      headers: {
        Accept: "application/json",
        "User-Agent": "AUTOmatTests-lab4/1.0 (+https://github.com/)",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`createHttpClient failed: ${message}`);
  }
}

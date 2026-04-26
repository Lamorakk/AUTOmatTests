/**
 * Lab 7 — short load / performance smoke against a public JSON API (GET).
 * Configure with env: LOAD_TEST_URL, LOAD_DURATION_SEC, LOAD_CONNECTIONS, LOAD_MIN_2XX.
 */
import autocannon from "autocannon";
import { validateLoadResults } from "../src/validateLoadResults.js";

async function main() {
  try {
    const url = process.env.LOAD_TEST_URL ?? "https://jsonplaceholder.typicode.com/posts/1";
    const duration = Math.max(1, Number(process.env.LOAD_DURATION_SEC ?? 4));
    const connections = Math.max(1, Number(process.env.LOAD_CONNECTIONS ?? 5));
    const minCompleted2xx = Math.max(1, Number(process.env.LOAD_MIN_2XX ?? 20));

    console.info("Lab7 load smoke starting", { url, duration, connections, minCompleted2xx });

    const result = await autocannon({
      url,
      method: "GET",
      connections,
      duration,
    });

    console.info("Lab7 load smoke raw summary", {
      duration: result.duration,
      "2xx": result["2xx"],
      "4xx": result["4xx"],
      "5xx": result["5xx"],
      non2xx: result.non2xx,
      errors: result.errors,
      timeouts: result.timeouts,
      meanLatencyMs: result.latency?.mean,
    });

    const validation = validateLoadResults(result, { minCompleted2xx });
    if (!validation.ok) {
      console.error(validation.message);
      process.exitCode = 1;
      return;
    }
    console.info(validation.message);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`runLoadSmoke failed: ${message}`);
    process.exitCode = 1;
  }
}

await main();

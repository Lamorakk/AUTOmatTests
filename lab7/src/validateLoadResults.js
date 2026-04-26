/**
 * Checks an autocannon `results` object against simple quality gates for a lab smoke run.
 *
 * @param {Record<string, unknown>} result - Final object returned by `autocannon()` when the run finishes.
 * @param {{ minCompleted2xx?: number }} [options] - Thresholds (defaults are lenient for public APIs).
 * @returns {{ ok: boolean, message: string }}
 *
 * @example
 * const result = await autocannon({ url: "https://example.com", duration: 2, connections: 2 });
 * const { ok, message } = validateLoadResults(result, { minCompleted2xx: 5 });
 */
export function validateLoadResults(result, options = {}) {
  try {
    if (!result || typeof result !== "object") {
      return { ok: false, message: "validateLoadResults: result is missing or not an object." };
    }

    const minCompleted2xx = options.minCompleted2xx ?? 1;
    const twoXx = Number(result["2xx"] ?? 0);
    const fiveXx = Number(result["5xx"] ?? 0);
    const timeouts = Number(result.timeouts ?? 0);
    const errors = Number(result.errors ?? 0);

    if (fiveXx > 0) {
      return { ok: false, message: `validateLoadResults: received ${fiveXx} HTTP 5xx response(s).` };
    }
    if (timeouts > 0) {
      return { ok: false, message: `validateLoadResults: ${timeouts} connection timeout(s).` };
    }
    if (errors > 0) {
      return { ok: false, message: `validateLoadResults: ${errors} connection error(s).` };
    }
    if (twoXx < minCompleted2xx) {
      return {
        ok: false,
        message: `validateLoadResults: only ${twoXx} successful 2xx response(s) (need at least ${minCompleted2xx}).`,
      };
    }

    const duration = result.duration;
    const latencyMean = result.latency && typeof result.latency === "object" ? result.latency.mean : undefined;
    return {
      ok: true,
      message: `validateLoadResults: OK — ${twoXx} 2xx responses in ${duration}s` +
        (typeof latencyMean === "number" ? `, mean latency ${latencyMean.toFixed(1)} ms` : "") +
        ".",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `validateLoadResults: unexpected error — ${message}` };
  }
}

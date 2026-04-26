import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateLoadResults } from "../src/validateLoadResults.js";

describe("validateLoadResults", () => {
  it("rejects missing result", () => {
    const outcome = validateLoadResults(null);
    assert.equal(outcome.ok, false);
    assert.match(outcome.message, /missing/i);
  });

  it("fails when 5xx present", () => {
    const outcome = validateLoadResults({
      "2xx": 100,
      "5xx": 2,
      timeouts: 0,
      errors: 0,
      duration: 5,
    });
    assert.equal(outcome.ok, false);
    assert.match(outcome.message, /5xx/i);
  });

  it("fails when timeouts present", () => {
    const outcome = validateLoadResults({
      "2xx": 10,
      "5xx": 0,
      timeouts: 1,
      errors: 0,
      duration: 5,
    });
    assert.equal(outcome.ok, false);
    assert.match(outcome.message, /timeout/i);
  });

  it("fails when connection errors present", () => {
    const outcome = validateLoadResults({
      "2xx": 10,
      "5xx": 0,
      timeouts: 0,
      errors: 3,
      duration: 5,
    });
    assert.equal(outcome.ok, false);
    assert.match(outcome.message, /error/i);
  });

  it("fails when 2xx count below minimum", () => {
    const outcome = validateLoadResults(
      {
        "2xx": 2,
        "5xx": 0,
        timeouts: 0,
        errors: 0,
        duration: 5,
      },
      { minCompleted2xx: 10 },
    );
    assert.equal(outcome.ok, false);
    assert.match(outcome.message, /2xx/i);
  });

  it("passes on healthy-looking result", () => {
    const outcome = validateLoadResults(
      {
        "2xx": 500,
        "5xx": 0,
        timeouts: 0,
        errors: 0,
        duration: 5,
        latency: { mean: 42 },
      },
      { minCompleted2xx: 10 },
    );
    assert.equal(outcome.ok, true);
    assert.match(outcome.message, /OK/i);
  });
});

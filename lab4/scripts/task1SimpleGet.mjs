/**
 * Lab 4 — Task 1: one-off GET to OpenWeatherMap to verify axios + env.
 * Run: npm run task1:get (from lab4), after copying .env → .env and setting the key.
 */
import dotenv from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchCurrentWeatherByCity } from "../src/openWeatherService.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

dotenv.config({ path: resolve(__dirname, "..", ".env") });

async function main() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENWEATHER_API_KEY. Copy .env to .env and add your key.");
    }
    const data = await fetchCurrentWeatherByCity("Kyiv", apiKey);
    console.info("Task 1 — GET OK. Sample fields:", {
      name: data.name,
      country: data.sys?.country,
      tempC: data.main?.temp,
      description: data.weather?.[0]?.description,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Task 1 — GET failed:", message);
    process.exitCode = 1;
  }
}

await main();

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvFile(filename = ".env") {
  const envPath = resolve(process.cwd(), filename);

  try {
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      console.error("Failed to load .env file:", error);
    }
  }
}

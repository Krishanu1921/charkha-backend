import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(process.cwd(), ".env");
let config = dotenv.config({ path: envPath, encoding: "utf8" });

if (!config.parsed || Object.keys(config.parsed).length === 0) {
  const raw = fs.readFileSync(envPath);
  let encoding = "utf8";

  if (raw.length >= 2) {
    if (raw[0] === 0xff && raw[1] === 0xfe) {
      encoding = "utf16le";
    } else if (raw[0] === 0xfe && raw[1] === 0xff) {
      encoding = "utf16be";
    }
  }

  const content = raw.toString(encoding).replace(/^\uFEFF/, "");
  const parsed = dotenv.parse(Buffer.from(content, "utf8"));

  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  config = { parsed, error: config.error };
}

if (config.error) {
  console.error("Failed to load .env:", config.error);
}
export default config;

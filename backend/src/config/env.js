require("dotenv").config();

const requiredInProduction = ["JWT_SECRET", "MONGODB_URI"];
const env = {
  PORT: Number(process.env.PORT || 3000),
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://dipak:0d1mzxph9dhwoxCp@cluster0.9lusik1.mongodb.net/supportdesk",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "f98760f3cccf67c144e370bcd5361c19f70c7fa5d4d71a9bb88bae4bfaf54fb1",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
  UPLOAD_MAX_MB: Number(process.env.UPLOAD_MAX_MB || 10),
  SLA_HOURS: {
    low: Number(process.env.SLA_LOW_HOURS || 72),
    medium: Number(process.env.SLA_MEDIUM_HOURS || 48),
    high: Number(process.env.SLA_HIGH_HOURS || 24),
    urgent: Number(process.env.SLA_URGENT_HOURS || 8),
  },
  MISTRAL_API_KEY:
    process.env.MISTRAL_API_KEY ||
    "mstrl_ee2MoapXzO4LQvx7AgogHzrlhi0KKwss_4w4s0c",
  MISTRAL_MODEL: process.env.MISTRAL_MODEL || "mistral-small-latest",
  MISTRAL_MAX_QUESTION_LENGTH: Number(
    process.env.MISTRAL_MAX_QUESTION_LENGTH || 1200,
  ),
  MISTRAL_MAX_OUTPUT_TOKENS: Number(
    process.env.MISTRAL_MAX_OUTPUT_TOKENS || 500,
  ),
  MISTRAL_MAX_TOOL_RESULTS: Number(process.env.MISTRAL_MAX_TOOL_RESULTS || 5),
  MISTRAL_MAX_AGENT_STEPS: Number(process.env.MISTRAL_MAX_AGENT_STEPS || 3),
  MISTRAL_TIMEOUT_MS: Number(process.env.MISTRAL_TIMEOUT_MS || 20000),
};

if (env.NODE_ENV === "production") {
  const missing = requiredInProduction.filter((key) => !env[key]);
  if (missing.length)
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  if (env.JWT_SECRET.length < 32)
    throw new Error("JWT_SECRET must be at least 32 characters in production");
}
module.exports = env;

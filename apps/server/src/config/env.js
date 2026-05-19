import dotenv from "dotenv";
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction,
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "super-secret-development-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
};
if (isProduction && !env.mongoUri) {
  throw new Error("MONGODB_URI is required in production");
}
if (isProduction && env.jwtSecret === "super-secret-development-key") {
  throw new Error("JWT_SECRET must be configured in production");
}

import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8000",
  API_V1: `${process.env.API_BASE_URL || "http://localhost:8000"}/api/v1`,
  OLLAMA_AVAILABLE: process.env.OLLAMA_AVAILABLE === "true",
  TEST_CONCEPT_SLUG: process.env.TEST_CONCEPT_SLUG || "rag",
  TEST_USER_ID: process.env.TEST_USER_ID || "guest",
} as const;

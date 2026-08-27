import { test, expect } from "../../fixtures/app.fixture";
import { ENV } from "../../config/environments";

// @smoke @P0

test.describe("Health & Root Endpoints", () => {
  test("GET /health returns 200 with status ok @smoke", async ({ api }) => {
    const response = await api.health();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(typeof body.version).toBe("string");
    expect(typeof body.app).toBe("string");
  });

  test("GET / returns welcome message", async ({ request }) => {
    const response = await request.get(`${ENV.API_BASE_URL}/`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.message).toContain("AI Learning Hub");
  });

  test("FastAPI docs available at /docs", async ({ request }) => {
    const response = await request.get(`${ENV.API_BASE_URL}/docs`);
    expect(response.status()).toBe(200);
  });
});

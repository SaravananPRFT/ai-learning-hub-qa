import { test, expect } from "../../fixtures/app.fixture";
import { expectOkJson } from "../../helpers/assertions";

// @smoke @P1

test.describe("Roadmap API", () => {
  test("POST /roadmap/generate returns RoadmapResponse schema @smoke", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "learn rag" })
    );
    expect(typeof body.goal).toBe("string");
    expect(typeof body.total_weeks).toBe("number");
    expect(typeof body.experience_level).toBe("string");
    expect(Array.isArray(body.weeks)).toBeTruthy();
    expect(body.weeks.length).toBeGreaterThan(0);
    expect(Array.isArray(body.prerequisites)).toBeTruthy();
    expect(Array.isArray(body.tips)).toBeTruthy();
  });

  test("each roadmap week has required fields @regression", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "learn fastapi" })
    );
    for (const week of body.weeks) {
      expect(typeof week.week).toBe("number");
      expect(typeof week.title).toBe("string");
      expect(Array.isArray(week.concepts)).toBeTruthy();
      expect(typeof week.goal).toBe("string");
      expect(typeof week.estimated_hours).toBe("number");
    }
  });

  test("goal=rag uses template roadmap @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "rag" })
    );
    // Template has 8 weeks; result should have weeks
    expect(body.weeks.length).toBeGreaterThanOrEqual(4);
    expect(body.final_project).toBeTruthy();
  });

  test("goal=fastapi uses template roadmap @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "fastapi" })
    );
    expect(body.weeks.length).toBeGreaterThanOrEqual(4);
  });

  test("goal=kubernetes uses template roadmap @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "kubernetes" })
    );
    expect(body.weeks.length).toBeGreaterThanOrEqual(4);
  });

  test("unknown goal falls through to dynamic generator @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "learn quantum computing fundamentals" })
    );
    // Dynamic generator returns at least 1 week
    expect(body.weeks.length).toBeGreaterThanOrEqual(1);
    expect(body.experience_level).toBe("beginner");
  });

  test("experience_level=advanced skips early weeks for template goals @P2", async ({ api }) => {
    const beginnerBody = await expectOkJson(
      await api.generateRoadmap({ goal: "rag", experience_level: "beginner" })
    );
    const advancedBody = await expectOkJson(
      await api.generateRoadmap({ goal: "rag", experience_level: "advanced" })
    );
    // Advanced level has fewer weeks (skips foundation)
    expect(advancedBody.weeks.length).toBeLessThan(beginnerBody.weeks.length);
  });

  test("time_weeks parameter is respected for truncation @P2", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateRoadmap({ goal: "rag", time_weeks: 3 })
    );
    expect(body.total_weeks).toBeLessThanOrEqual(3);
  });
});

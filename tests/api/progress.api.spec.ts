import { test, expect } from "../../fixtures/app.fixture";
import {
  expectOkJson,
  expectStatus,
  assertUserStatsShape,
} from "../../helpers/assertions";
import { ASSESSMENT_ANSWERS, PRIMARY_SLUG } from "../../helpers/test-data";
import { ENV } from "../../config/environments";

// @smoke @P0

test.describe("Progress API", () => {
  test("GET /progress/{user_id} returns array @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.getUserProgress());
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("GET /progress/{user_id}/stats returns UserStats schema @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.getUserStats());
    assertUserStatsShape(body);
    expect(body.user_id).toBe(ENV.TEST_USER_ID);
  });

  test("POST /progress/update with action=view creates/updates record @smoke", async ({ api }) => {
    const body = await expectOkJson(
      await api.updateProgress({ concept_slug: PRIMARY_SLUG, action: "view" })
    );
    expect(body.concept_slug).toBe(PRIMARY_SLUG);
    expect(["in_progress", "completed"]).toContain(body.status);
    expect(typeof body.completion_pct).toBe("number");
    expect(body.completion_pct).toBeGreaterThanOrEqual(10);
  });

  test("POST /progress/update with action=complete_concept marks as completed @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.updateProgress({
        concept_slug: PRIMARY_SLUG,
        action: "complete_concept",
      })
    );
    expect(body.status).toBe("completed");
    expect(body.completion_pct).toBe(100);
  });

  test("POST /progress/update with action=quiz_score updates score @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.updateProgress({
        concept_slug: PRIMARY_SLUG,
        action: "quiz_score",
        score: 85.5,
      })
    );
    expect(body.quiz_score).toBe(85.5);
  });

  test("ConceptProgressSummary has all required fields @regression", async ({ api }) => {
    await api.updateProgress({ concept_slug: PRIMARY_SLUG, action: "view" });
    const progress = await expectOkJson(await api.getUserProgress());
    const found = progress.find((p: { concept_slug: string }) => p.concept_slug === PRIMARY_SLUG);
    expect(found).toBeDefined();
    expect(typeof found.concept_name).toBe("string");
    expect(typeof found.category).toBe("string");
    expect(typeof found.status).toBe("string");
    expect(typeof found.completion_pct).toBe("number");
    expect(Array.isArray(found.projects_completed)).toBeTruthy();
    expect(Array.isArray(found.experiments_completed)).toBeTruthy();
  });

  // ─── Assessment boundary conditions ──────────────────────────────────────

  test("POST /assessment/submit — 21-char answer is scored as correct @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.submitAssessment({
        concept_slug: PRIMARY_SLUG,
        answers: [
          { question_index: 0, answer: ASSESSMENT_ANSWERS.justAboveThreshold },
        ],
      })
    );
    expect(body.correct_answers).toBeGreaterThanOrEqual(1);
  });

  test("POST /assessment/submit — 20-char answer is scored as incorrect @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.submitAssessment({
        concept_slug: PRIMARY_SLUG,
        answers: [
          { question_index: 0, answer: ASSESSMENT_ANSWERS.justBelowThreshold },
        ],
      })
    );
    expect(body.correct_answers).toBe(0);
  });

  test("POST /assessment/submit returns AssessmentResult schema @smoke", async ({ api }) => {
    const body = await expectOkJson(
      await api.submitAssessment({
        concept_slug: PRIMARY_SLUG,
        answers: [
          { question_index: 0, answer: ASSESSMENT_ANSWERS.meaningful },
        ],
      })
    );
    expect(typeof body.score).toBe("number");
    expect(typeof body.total_questions).toBe("number");
    expect(typeof body.correct_answers).toBe("number");
    expect(typeof body.passed).toBe("boolean");
    expect(Array.isArray(body.feedback)).toBeTruthy();
    expect(Array.isArray(body.next_recommendations)).toBeTruthy();
  });

  test("assessment passes at 60% threshold @regression", async ({ api }) => {
    const body = await expectOkJson(
      await api.submitAssessment({
        concept_slug: PRIMARY_SLUG,
        answers: [
          { question_index: 0, answer: ASSESSMENT_ANSWERS.meaningful },
          { question_index: 1, answer: ASSESSMENT_ANSWERS.meaningful },
          { question_index: 2, answer: ASSESSMENT_ANSWERS.meaningful },
        ],
      })
    );
    expect(body.passed).toBe(true);
    expect(body.score).toBeGreaterThanOrEqual(60);
  });
});

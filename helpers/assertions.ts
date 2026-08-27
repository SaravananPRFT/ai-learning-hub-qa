import { expect, APIResponse } from "@playwright/test";

export async function expectOkJson(response: APIResponse) {
  expect(response.ok(), `Expected 200, got ${response.status()}: ${response.url()}`).toBeTruthy();
  const body = await response.json();
  expect(body).toBeDefined();
  return body;
}

export async function expectStatus(response: APIResponse, status: number) {
  expect(
    response.status(),
    `Expected ${status}, got ${response.status()}: ${response.url()}`
  ).toBe(status);
}

export function assertConceptSummaryShape(c: Record<string, unknown>) {
  expect(typeof c.id).toBe("string");
  expect(typeof c.slug).toBe("string");
  expect(typeof c.name).toBe("string");
  expect(typeof c.category).toBe("string");
  expect(typeof c.description).toBe("string");
  expect(typeof c.difficulty).toBe("string");
  expect(Array.isArray(c.tags)).toBeTruthy();
}

export function assertUserStatsShape(stats: Record<string, unknown>) {
  const numericFields = [
    "total_concepts_started",
    "total_concepts_completed",
    "total_quizzes_taken",
    "average_quiz_score",
    "total_projects_completed",
    "total_experiments_completed",
    "streak_days",
    "ai_engineer_score",
    "solution_architect_score",
    "developer_score",
  ];
  for (const field of numericFields) {
    expect(typeof stats[field], `UserStats.${field} should be number`).toBe("number");
  }
  expect(typeof stats.user_id).toBe("string");
  expect(Array.isArray(stats.categories_covered)).toBeTruthy();
}

export function assertInterviewEvaluationShape(ev: Record<string, unknown>) {
  expect(typeof ev.overall_score).toBe("number");
  expect(typeof ev.hiring_recommendation).toBe("string");
  expect(Array.isArray(ev.key_points_expected)).toBeTruthy();
  expect(Array.isArray(ev.follow_ups)).toBeTruthy();
  expect(Array.isArray(ev.done_well)).toBeTruthy();
  expect(Array.isArray(ev.missing_points)).toBeTruthy();
  expect(typeof ev.filler_word_count).toBe("number");
  expect(Array.isArray(ev.filler_words_found)).toBeTruthy();
  expect(typeof ev.response_assessment).toBe("string");
}

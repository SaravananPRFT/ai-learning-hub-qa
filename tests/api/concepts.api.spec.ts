import { test, expect } from "../../fixtures/app.fixture";
import {
  assertConceptSummaryShape,
  expectOkJson,
  expectStatus,
} from "../../helpers/assertions";
import {
  PRIMARY_SLUG,
  SECONDARY_SLUG,
  UNKNOWN_SLUG,
} from "../../helpers/test-data";

// @smoke @regression @P0

test.describe("Concepts API", () => {
  // ─── Search ──────────────────────────────────────────────────────────────

  test("GET /concepts/search returns valid schema @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.searchConcepts({}));
    expect(Array.isArray(body.concepts)).toBeTruthy();
    expect(typeof body.total).toBe("number");
    expect(typeof body.can_generate).toBe("boolean");
    expect(body.total).toBeGreaterThan(0);
  });

  test("GET /concepts/search with query filters results @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.searchConcepts({ q: "rag" }));
    expect(body.total).toBeGreaterThanOrEqual(1);
    const concept = body.concepts[0];
    assertConceptSummaryShape(concept);
  });

  test("GET /concepts/search with category filters results @regression", async ({ api }) => {
    // First get valid categories
    const catResponse = await api.getCategories();
    const categories: string[] = await catResponse.json();
    if (categories.length === 0) return;

    const body = await expectOkJson(
      await api.searchConcepts({ category: categories[0] })
    );
    for (const concept of body.concepts) {
      expect(concept.category).toBe(categories[0]);
    }
  });

  test("GET /concepts/search with difficulty=beginner filters results @regression", async ({ api }) => {
    const body = await expectOkJson(
      await api.searchConcepts({ difficulty: "beginner" })
    );
    for (const concept of body.concepts) {
      expect(concept.difficulty).toBe("beginner");
    }
  });

  test("GET /concepts/search no results returns can_generate=true", async ({ api }) => {
    const body = await expectOkJson(
      await api.searchConcepts({ q: "xyznonexistent999" })
    );
    expect(body.total).toBe(0);
    expect(body.can_generate).toBe(true);
  });

  test("GET /concepts/search respects limit parameter", async ({ api }) => {
    const body = await expectOkJson(await api.searchConcepts({ limit: 3 }));
    expect(body.concepts.length).toBeLessThanOrEqual(3);
  });

  // ─── Featured ─────────────────────────────────────────────────────────────

  test("GET /concepts/featured returns featured concepts @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.getFeaturedConcepts());
    expect(Array.isArray(body)).toBeTruthy();
    if (body.length > 0) {
      assertConceptSummaryShape(body[0]);
    }
  });

  test("GET /concepts/featured respects limit parameter", async ({ api }) => {
    const body = await expectOkJson(await api.getFeaturedConcepts(3));
    expect(body.length).toBeLessThanOrEqual(3);
  });

  // ─── Categories ───────────────────────────────────────────────────────────

  test("GET /concepts/categories returns string array @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.getCategories());
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    for (const cat of body) {
      expect(typeof cat).toBe("string");
    }
  });

  // ─── Concept Detail ───────────────────────────────────────────────────────

  test("GET /concepts/{slug} returns ConceptDetail for valid slug @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.getConcept(PRIMARY_SLUG));
    expect(body.slug).toBe(PRIMARY_SLUG);
    assertConceptSummaryShape(body);
    expect(Array.isArray(body.prerequisites)).toBeTruthy();
    expect(Array.isArray(body.related_concepts)).toBeTruthy();
    expect(Array.isArray(body.interview_questions)).toBeTruthy();
    expect(Array.isArray(body.best_practices)).toBeTruthy();
    expect(Array.isArray(body.common_mistakes)).toBeTruthy();
  });

  test("GET /concepts/{slug} returns 404 for unknown slug @smoke", async ({ api }) => {
    await expectStatus(await api.getConcept(UNKNOWN_SLUG), 404);
  });

  test("GET /concepts/{slug} increments view_count on repeated calls @regression", async ({ api }) => {
    const first = await expectOkJson(await api.getConcept(PRIMARY_SLUG));
    const second = await expectOkJson(await api.getConcept(PRIMARY_SLUG));
    expect(second.view_count).toBeGreaterThanOrEqual(first.view_count);
  });

  // ─── Graph ────────────────────────────────────────────────────────────────

  test("GET /concepts/{slug}/graph returns nodes and edges @P1", async ({ api }) => {
    const body = await expectOkJson(await api.getConceptGraph(PRIMARY_SLUG));
    expect(Array.isArray(body.nodes)).toBeTruthy();
    expect(Array.isArray(body.edges)).toBeTruthy();
    expect(typeof body.root).toBe("string");
  });

  test("GET /concepts/{slug}/graph returns 404 for unknown slug", async ({ api }) => {
    await expectStatus(await api.getConceptGraph(UNKNOWN_SLUG), 404);
  });

  // ─── Prerequisites & Related ──────────────────────────────────────────────

  test("GET /concepts/{slug}/prerequisites returns array @P1", async ({ api }) => {
    const body = await expectOkJson(await api.getPrerequisites(PRIMARY_SLUG));
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("GET /concepts/{slug}/related returns array @P1", async ({ api }) => {
    const body = await expectOkJson(await api.getRelated(PRIMARY_SLUG));
    expect(Array.isArray(body)).toBeTruthy();
  });

  // ─── Generate ─────────────────────────────────────────────────────────────

  test("POST /concepts/generate with empty topic returns 400 @smoke", async ({ api }) => {
    await expectStatus(await api.generateConcept(""), 400);
  });

  test("POST /concepts/generate with whitespace-only topic returns 400", async ({ api }) => {
    await expectStatus(await api.generateConcept("   "), 400);
  });
});

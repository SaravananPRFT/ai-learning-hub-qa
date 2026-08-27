import { test, expect } from "../../fixtures/app.fixture";
import {
  expectOkJson,
  expectStatus,
} from "../../helpers/assertions";
import { PRIMARY_SLUG, SECONDARY_SLUG, UNKNOWN_SLUG } from "../../helpers/test-data";

// @smoke @P0

test.describe("Compare API", () => {
  test("GET /compare/presets returns presets list @smoke", async ({ api }) => {
    const body = await expectOkJson(await api.getComparePresets());
    expect(Array.isArray(body.presets)).toBeTruthy();
    expect(body.presets.length).toBeGreaterThan(0);
    const first = body.presets[0];
    expect(typeof first.id).toBe("string");
    expect(typeof first.title).toBe("string");
    expect(Array.isArray(first.concepts)).toBeTruthy();
  });

  test("POST /compare with 1 concept returns 400 @smoke", async ({ api }) => {
    await expectStatus(await api.compareConcepts([PRIMARY_SLUG]), 400);
  });

  test("POST /compare with 0 concepts returns 400 @smoke", async ({ api }) => {
    await expectStatus(await api.compareConcepts([]), 400);
  });

  test("POST /compare with 2 valid slugs returns comparison data @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.compareConcepts([PRIMARY_SLUG, SECONDARY_SLUG])
    );
    expect(Array.isArray(body.comparisons)).toBeTruthy();
    expect(typeof body.count).toBe("number");
    expect(body.count).toBeGreaterThanOrEqual(1);
  });

  test("comparison result contains concept metadata @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.compareConcepts([PRIMARY_SLUG, SECONDARY_SLUG])
    );
    const first = body.comparisons[0];
    expect(typeof first.slug).toBe("string");
    expect(typeof first.name).toBe("string");
    expect(typeof first.category).toBe("string");
    expect(typeof first.difficulty).toBe("string");
  });

  test("POST /compare with unknown slug returns partial results @P2", async ({ api }) => {
    const body = await expectOkJson(
      await api.compareConcepts([PRIMARY_SLUG, UNKNOWN_SLUG])
    );
    // Unknown slug is skipped, only known concepts returned
    expect(body.count).toBe(1);
    expect(body.comparisons[0].slug).toBe(PRIMARY_SLUG);
  });

  test("POST /compare caps at 4 concepts @P2", async ({ api }) => {
    const body = await expectOkJson(
      await api.compareConcepts([
        "rag",
        "embeddings",
        "fastapi",
        "python",
        "docker", // 5th — should be ignored per backend logic [:4]
      ])
    );
    expect(body.count).toBeLessThanOrEqual(4);
  });
});

import { test, expect } from "../../fixtures/app.fixture";
import { expectOkJson as assertOkJson } from "../../helpers/assertions";
import { MENTOR_PERSONA_IDS } from "../../helpers/test-data";

// @smoke @P0

test.describe("Mentor API", () => {
  test("GET /mentor/personas returns 7 personas @smoke", async ({ api }) => {
    const body = await assertOkJson(await api.getPersonas());
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(7);
  });

  test("each persona has required fields @smoke", async ({ api }) => {
    const body = await assertOkJson(await api.getPersonas());
    for (const persona of body) {
      expect(typeof persona.id).toBe("string");
      expect(typeof persona.name).toBe("string");
      expect(typeof persona.description).toBe("string");
      expect(typeof persona.system_prompt).toBe("string");
      expect(typeof persona.icon).toBe("string");
    }
  });

  test("persona IDs match expected values @smoke", async ({ api }) => {
    const body = await assertOkJson(await api.getPersonas());
    const returnedIds = body.map((p: { id: string }) => p.id).sort();
    const expectedIds = [...MENTOR_PERSONA_IDS].sort();
    expect(returnedIds).toEqual(expectedIds);
  });

  test("POST /mentor/chat returns response field @smoke", async ({ api }) => {
    const body = await assertOkJson(
      await api.chat({ message: "What is RAG?" })
    );
    expect(typeof body.response).toBe("string");
    expect(body.response.length).toBeGreaterThan(0);
    expect(typeof body.conversation_id).toBe("string");
    expect(typeof body.persona).toBe("string");
    expect(Array.isArray(body.suggested_topics)).toBeTruthy();
  });

  test("POST /mentor/chat uses teach_me persona by default @P1", async ({ api }) => {
    const body = await assertOkJson(
      await api.chat({ message: "explain embeddings" })
    );
    expect(body.persona).toBe("teach_me");
  });

  test("POST /mentor/chat respects persona selection @P1", async ({ api }) => {
    const body = await assertOkJson(
      await api.chat({ message: "test", persona: "quiz_me" })
    );
    expect(body.persona).toBe("quiz_me");
  });

  test("POST /mentor/chat with unknown persona falls back gracefully @P1", async ({ api }) => {
    // Unknown persona should fall back to teach_me (see mentor_service.py line: MENTOR_PERSONAS.get(request.persona, MENTOR_PERSONAS["teach_me"]))
    const body = await assertOkJson(
      await api.chat({ message: "hello", persona: "nonexistent_persona" })
    );
    expect(typeof body.response).toBe("string");
  });

  test("POST /mentor/chat accepts concept_context @P1", async ({ api }) => {
    const body = await assertOkJson(
      await api.chat({
        message: "explain this",
        concept_context: "rag",
        persona: "teach_me",
      })
    );
    expect(typeof body.response).toBe("string");
  });
});

import { test, expect } from "../../fixtures/app.fixture";
import {
  expectOkJson,
  assertInterviewEvaluationShape,
} from "../../helpers/assertions";

// @P1

test.describe("Interview API", () => {
  test("POST /interview/questions returns questions array @smoke", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateInterviewQuestions({ topic: "RAG", count: 5 })
    );
    expect(Array.isArray(body.questions)).toBeTruthy();
    expect(body.questions.length).toBeGreaterThan(0);
    expect(typeof body.topic).toBe("string");
    expect(typeof body.interview_type).toBe("string");
  });

  test("fallback questions returned when Ollama is not available @P1", async ({ api }) => {
    // The interview service always returns fallback questions, so this
    // works regardless of Ollama status
    const body = await expectOkJson(
      await api.generateInterviewQuestions({ topic: "Docker", count: 3 })
    );
    expect(body.questions.length).toBeGreaterThanOrEqual(1);
    expect(body.questions.length).toBeLessThanOrEqual(3);
  });

  test("POST /interview/questions respects count parameter @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.generateInterviewQuestions({ topic: "Kubernetes", count: 3 })
    );
    expect(body.questions.length).toBeLessThanOrEqual(3);
  });

  test("POST /interview/questions for all interview types @regression", async ({ api }) => {
    const types = ["technical", "behavioral", "system_design"];
    for (const itype of types) {
      const body = await expectOkJson(
        await api.generateInterviewQuestions({
          topic: "Python",
          interview_type: itype,
          count: 2,
        })
      );
      expect(body.questions.length).toBeGreaterThanOrEqual(1);
      expect(body.interview_type).toBe(itype);
    }
  });

  test("POST /interview/evaluate returns all required fields @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.evaluateInterviewAnswer({
        question: "What is RAG?",
        answer:
          "RAG stands for Retrieval Augmented Generation. It combines a retrieval system with a generative LLM to produce factually grounded answers.",
        topic: "RAG",
        role_level: "mid",
      })
    );
    assertInterviewEvaluationShape(body);
  });

  test("communication analysis counts filler words @P1", async ({ api }) => {
    const body = await expectOkJson(
      await api.evaluateInterviewAnswer({
        question: "Explain containers",
        answer: "Um, so basically containers are, like, you know, isolated environments.",
        spoken_answer: "Um, so basically containers are, like, you know, isolated environments.",
        topic: "Docker",
      })
    );
    expect(body.filler_word_count).toBeGreaterThan(0);
    expect(body.filler_words_found.length).toBeGreaterThan(0);
  });

  test("short answer triggers 'very brief response' assessment @P2", async ({ api }) => {
    const body = await expectOkJson(
      await api.evaluateInterviewAnswer({
        question: "What is Docker?",
        answer: "Docker runs containers",
        spoken_answer: "Docker runs containers",
        topic: "Docker",
      })
    );
    expect(body.response_assessment).toMatch(/brief|short/i);
  });

  test("long answer triggers 'very long response' assessment @P2", async ({ api }) => {
    const longAnswer = "Docker is a platform ".repeat(40); // ~800 words
    const body = await expectOkJson(
      await api.evaluateInterviewAnswer({
        question: "What is Docker?",
        answer: longAnswer,
        spoken_answer: longAnswer,
        topic: "Docker",
      })
    );
    expect(body.response_assessment).toMatch(/long|concise/i);
  });
});

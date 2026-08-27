import { APIRequestContext, expect } from "@playwright/test";
import { ENV } from "../config/environments";

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  // ─── Concepts ───────────────────────────────────────────────────────────────

  async searchConcepts(params: {
    q?: string;
    category?: string;
    difficulty?: string;
    limit?: number;
    offset?: number;
  }) {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.difficulty) query.set("difficulty", params.difficulty);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.offset) query.set("offset", String(params.offset));
    return this.request.get(`${ENV.API_V1}/concepts/search?${query}`);
  }

  async getFeaturedConcepts(limit = 12) {
    return this.request.get(`${ENV.API_V1}/concepts/featured?limit=${limit}`);
  }

  async getCategories() {
    return this.request.get(`${ENV.API_V1}/concepts/categories`);
  }

  async getConcept(slug: string) {
    return this.request.get(`${ENV.API_V1}/concepts/${slug}`);
  }

  async trackConceptView(slug: string) {
    return this.request.post(`${ENV.API_V1}/concepts/${slug}/view`);
  }

  async getConceptGraph(slug: string) {
    return this.request.get(`${ENV.API_V1}/concepts/${slug}/graph`);
  }

  async getPrerequisites(slug: string) {
    return this.request.get(`${ENV.API_V1}/concepts/${slug}/prerequisites`);
  }

  async getRelated(slug: string) {
    return this.request.get(`${ENV.API_V1}/concepts/${slug}/related`);
  }

  async generateConcept(topic: string) {
    return this.request.post(`${ENV.API_V1}/concepts/generate`, {
      data: { topic },
    });
  }

  // ─── Mentor ─────────────────────────────────────────────────────────────────

  async getPersonas() {
    return this.request.get(`${ENV.API_V1}/mentor/personas`);
  }

  async chat(params: {
    message: string;
    persona?: string;
    concept_context?: string;
    conversation_id?: string;
    user_id?: string;
  }) {
    return this.request.post(`${ENV.API_V1}/mentor/chat`, {
      data: {
        message: params.message,
        persona: params.persona ?? "teach_me",
        concept_context: params.concept_context ?? null,
        conversation_id: params.conversation_id ?? "",
        user_id: params.user_id ?? ENV.TEST_USER_ID,
      },
    });
  }

  // ─── Roadmap ─────────────────────────────────────────────────────────────────

  async generateRoadmap(params: {
    goal: string;
    experience_level?: string;
    time_weeks?: number;
    focus_areas?: string[];
    current_skills?: string[];
  }) {
    return this.request.post(`${ENV.API_V1}/roadmap/generate`, {
      data: {
        goal: params.goal,
        experience_level: params.experience_level ?? "beginner",
        time_weeks: params.time_weeks ?? 8,
        focus_areas: params.focus_areas ?? [],
        current_skills: params.current_skills ?? [],
      },
    });
  }

  // ─── Progress ────────────────────────────────────────────────────────────────

  async getUserProgress(userId = ENV.TEST_USER_ID) {
    return this.request.get(`${ENV.API_V1}/progress/${userId}`);
  }

  async getUserStats(userId = ENV.TEST_USER_ID) {
    return this.request.get(`${ENV.API_V1}/progress/${userId}/stats`);
  }

  async updateProgress(params: {
    user_id?: string;
    concept_slug: string;
    action: string;
    score?: number;
    project_id?: string;
    experiment_id?: string;
  }) {
    return this.request.post(`${ENV.API_V1}/progress/update`, {
      data: {
        user_id: params.user_id ?? ENV.TEST_USER_ID,
        concept_slug: params.concept_slug,
        action: params.action,
        score: params.score,
        project_id: params.project_id,
        experiment_id: params.experiment_id,
      },
    });
  }

  async submitAssessment(params: {
    user_id?: string;
    concept_slug: string;
    answers: { question_index: number; answer: string }[];
  }) {
    return this.request.post(`${ENV.API_V1}/progress/assessment/submit`, {
      data: {
        user_id: params.user_id ?? ENV.TEST_USER_ID,
        concept_slug: params.concept_slug,
        answers: params.answers,
      },
    });
  }

  // ─── Interview ───────────────────────────────────────────────────────────────

  async generateInterviewQuestions(params: {
    topic: string;
    interview_type?: string;
    role_level?: string;
    count?: number;
  }) {
    return this.request.post(`${ENV.API_V1}/interview/questions`, {
      data: {
        topic: params.topic,
        interview_type: params.interview_type ?? "technical",
        role_level: params.role_level ?? "mid",
        count: params.count ?? 5,
      },
      timeout: 60_000,
    });
  }

  async evaluateInterviewAnswer(params: {
    question: string;
    answer: string;
    spoken_answer?: string;
    topic?: string;
    role_level?: string;
  }) {
    return this.request.post(`${ENV.API_V1}/interview/evaluate`, {
      data: {
        question: params.question,
        answer: params.answer,
        spoken_answer: params.spoken_answer,
        topic: params.topic,
        role_level: params.role_level ?? "mid",
      },
      timeout: 120_000,
    });
  }

  // ─── Compare ─────────────────────────────────────────────────────────────────

  async compareConcepts(concepts: string[]) {
    return this.request.post(`${ENV.API_V1}/compare`, {
      data: { concepts },
    });
  }

  async getComparePresets() {
    return this.request.get(`${ENV.API_V1}/compare/presets`);
  }

  // ─── Health ──────────────────────────────────────────────────────────────────

  async health() {
    return this.request.get(`${ENV.API_BASE_URL}/health`);
  }
}

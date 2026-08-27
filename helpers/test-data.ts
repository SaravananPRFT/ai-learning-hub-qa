// Stable seed data that exists in the application's initial database.
// These slugs are sourced from the roadmap templates and featured concepts.

export const KNOWN_SLUGS = [
  "rag",
  "embeddings",
  "transformers",
  "fastapi",
  "python",
  "llm-fundamentals",
  "chromadb",
  "docker",
  "kubernetes",
  "postgresql",
  "ollama",
] as const;

export type KnownSlug = (typeof KNOWN_SLUGS)[number];

export const PRIMARY_SLUG: KnownSlug = "rag";
export const SECONDARY_SLUG: KnownSlug = "embeddings";

export const UNKNOWN_SLUG = "this-concept-does-not-exist-xyz";

export const MENTOR_PERSONA_IDS = [
  "teach_me",
  "quiz_me",
  "challenge_me",
  "interview_me",
  "review_architecture",
  "eli5",
  "senior_engineer",
] as const;

export const INTERVIEW_TYPES = [
  "technical",
  "behavioral",
  "system_design",
  "mixed",
] as const;

export const ROLE_LEVELS = ["junior", "mid", "senior", "architect"] as const;

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

export const PROGRESS_ACTIONS = [
  "view",
  "complete_concept",
  "complete_project",
  "complete_experiment",
  "quiz_score",
] as const;

// Scoring: correct if answer contains ≥2 keywords from the question hint OR length ≥50 chars.
// Empty/very short answers with no matching keywords are always incorrect.
export const ASSESSMENT_ANSWERS = {
  tooShort: "A".repeat(49),   // 49 chars, no hint keywords — marked incorrect
  longEnough: "A".repeat(50), // 50 chars minimum length — marked correct (length rule)
  empty: "",
  meaningful: "This is a comprehensive answer about the concept that explains all key points clearly.",
  withKeywords: "RAG retrieves relevant documents then generates a grounded answer using those chunks as context.",
};

// Comparison presets from the backend
export const COMPARE_PRESETS = [
  "vector-dbs",
  "rag-vs-ft",
  "python-frameworks",
  "llm-runners",
  "container-orchestration",
  "data-stores",
];

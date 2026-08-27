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

// Boundary values for assessment scoring (answer length > 20 = correct)
export const ASSESSMENT_ANSWERS = {
  justBelowThreshold: "A".repeat(20), // 20 chars — marked incorrect
  justAboveThreshold: "A".repeat(21), // 21 chars — marked correct
  empty: "",
  meaningful: "This is a comprehensive answer about the concept that explains all key points.",
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

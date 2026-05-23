export type RevisionMode = "quick" | "smart" | "deep";

export type RevisionRequest = {
  userId?: string;
  topic: string;
  chapterTitle: string;
  learningPath?: string;
  mode: RevisionMode;
  content: string;
  completedTopics?: string[];
  weakConcepts?: string[];
  quizScores?: Array<{ topic: string; score: number }>;
};

export type RevisionSummary = {
  id: string;
  title: string;
  topic: string;
  mode: RevisionMode;
  generatedAt: string;
  shortSummary: string[];
  mediumNotes: string[];
  detailedNotes: string[];
  interviewPoints: string[];
  keyConcepts: string[];
  definitions: Array<{ term: string; meaning: string }>;
  codeSnippets: Array<{ language: string; title: string; code: string }>;
  mcqs: Array<{ question: string; options: string[]; answer: string }>;
  flashcards: Array<{ front: string; back: string }>;
  realWorldExamples: string[];
  connections: string[];
  weakTopicPlan: string[];
  nextSteps: string[];
  spacedRepetition: Array<{ when: string; task: string }>;
};

export type LearningMemory = {
  userId: string;
  completedTopics: string[];
  weakConcepts: string[];
  savedSummaries: RevisionSummary[];
  quizScores: Array<{ topic: string; score: number }>;
  lastStudiedAt?: string;
};

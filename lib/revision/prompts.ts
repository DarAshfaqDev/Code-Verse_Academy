import { RevisionRequest } from "@/lib/revision/types";

export function buildRevisionPrompt(request: RevisionRequest) {
  return `You are an agentic AI revision coach for an EdTech platform.

Create a personalized revision summary.

Topic: ${request.topic}
Chapter: ${request.chapterTitle}
Mode: ${request.mode}
Learning path: ${request.learningPath || "General"}
Completed topics: ${(request.completedTopics || []).join(", ") || "None yet"}
Weak concepts: ${(request.weakConcepts || []).join(", ") || "None detected"}

Use the current chapter, previous completed topics, quiz weakness and learning history.
Return:
- short summary
- smart notes
- deep notes
- key concepts
- definitions
- code snippets
- MCQs
- flashcards
- real-world examples
- interview revision points
- cross-topic connections
- next revision timing

Current content:
${request.content.slice(0, 12000)}`;
}

export const revisionSystemArchitecture = {
  aiProviders: ["OpenAI API", "Gemini API"],
  orchestration: ["LangChain agent workflow", "RAG retrieval chain", "summary synthesis chain"],
  memory: ["LearningMemory", "UserProgress", "QuizPerformance", "AISummaries"],
  vectorStores: ["Pinecone", "Chroma"],
  exports: ["PDF", "DOCX", "Markdown", "Plain text"]
};

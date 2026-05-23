import { RevisionRequest, RevisionSummary } from "@/lib/revision/types";

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "are",
  "can",
  "will",
  "you",
  "your",
  "using",
  "used",
  "when",
  "where",
  "while",
  "backend",
  "development",
  "chapter",
  "topic"
]);

function sentenceSplit(content: string) {
  return content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 50);
}

function keywordExtract(content: string, fallback: string) {
  const counts = new Map<string, number>();
  content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  const keywords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return keywords.length ? keywords : fallback.toLowerCase().split(/\s+/).slice(0, 6);
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export function generateRevisionSummary(request: RevisionRequest): RevisionSummary {
  const generatedAt = new Date().toISOString();
  const sentences = sentenceSplit(request.content);
  const keywords = keywordExtract(request.content, request.chapterTitle);
  const weakConcepts = request.weakConcepts?.length ? request.weakConcepts : keywords.slice(0, 3);
  const completed = request.completedTopics?.length ? request.completedTopics : ["current chapter"];
  const baseSentences = sentences.length ? sentences : [`${request.chapterTitle} introduces important ideas for ${request.topic}.`];
  const depth = request.mode === "quick" ? 3 : request.mode === "smart" ? 6 : 9;

  const keyConcepts = unique([
    request.chapterTitle,
    ...keywords.slice(0, 7).map((keyword) => keyword.replace(/-/g, " "))
  ]).slice(0, 8);

  return {
    id: `rev-${Date.now()}`,
    title: `${request.chapterTitle} Revision`,
    topic: request.topic,
    mode: request.mode,
    generatedAt,
    shortSummary: baseSentences.slice(0, 3).map((sentence) => sentence.replace(/\s+/g, " ")),
    mediumNotes: baseSentences.slice(0, depth).map((sentence) => sentence.replace(/\s+/g, " ")),
    detailedNotes: [
      ...baseSentences.slice(0, Math.max(depth, 8)),
      `Connect this chapter with what you already completed: ${completed.slice(-4).join(" -> ")}.`,
      `Before moving ahead, revise weak concepts: ${weakConcepts.join(", ")}.`
    ],
    interviewPoints: keyConcepts.slice(0, 6).map((concept) => `Explain ${concept} with one practical example and one trade-off.`),
    keyConcepts,
    definitions: keyConcepts.slice(0, 6).map((concept) => ({
      term: concept,
      meaning: `${concept} is a key idea in ${request.chapterTitle}. Remember what it does, where it is used, and why it matters.`
    })),
    codeSnippets: [
      {
        language: request.topic.toLowerCase().includes("sql") ? "sql" : request.topic.toLowerCase().includes("javascript") ? "javascript" : "python",
        title: "Practice starter",
        code: request.topic.toLowerCase().includes("sql")
          ? "SELECT topic, COUNT(*) AS attempts\nFROM revision_history\nGROUP BY topic;"
          : request.topic.toLowerCase().includes("javascript")
            ? "const revise = (topic) => ({ topic, reviewed: true, nextReview: 'tomorrow' });"
            : "def revise(topic: str):\n    return {\"topic\": topic, \"reviewed\": True, \"next_review\": \"tomorrow\"}"
      }
    ],
    mcqs: keyConcepts.slice(0, 4).map((concept) => ({
      question: `Why is ${concept} important in ${request.chapterTitle}?`,
      options: ["It supports understanding and practical use", "It is only for decoration", "It removes the need to practice", "It is unrelated"],
      answer: "It supports understanding and practical use"
    })),
    flashcards: keyConcepts.slice(0, 8).map((concept) => ({
      front: `What should you remember about ${concept}?`,
      back: `Know the meaning, one example, one mistake to avoid, and how it connects to ${request.topic}.`
    })),
    realWorldExamples: [
      `Use ${request.chapterTitle} while building a project feature and explain the decision in simple words.`,
      `Create a mini checklist for ${keyConcepts.slice(0, 3).join(", ")} before interviews.`,
      `Compare this chapter with a previous topic: ${completed.at(-1) || "your last completed topic"}.`
    ],
    connections: completed.slice(-5).map((topic) => `${topic} connects with ${request.chapterTitle} through shared concepts and practical workflow.`),
    weakTopicPlan: weakConcepts.map((concept) => `Review ${concept}, solve two practice questions, then explain it without notes.`),
    nextSteps: [
      "Save this summary to the Revision Center.",
      "Review flashcards tomorrow.",
      "Attempt a short quiz before the next chapter.",
      `Next suggested topic: ${keyConcepts[1] || request.topic}.`
    ],
    spacedRepetition: [
      { when: "Tomorrow", task: `Quick review of ${request.chapterTitle}` },
      { when: "In 3 days", task: `Practice weak concepts: ${weakConcepts.join(", ")}` },
      { when: "In 7 days", task: "Deep revision with interview questions and MCQs" }
    ]
  };
}

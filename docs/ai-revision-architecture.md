# AI Revision & Agentic Learning Assistant

## Runtime Flow

1. Tutorial page sends topic, chapter content, completed topics, quiz scores and weak concepts to `/api/ai/revision`.
2. The local deterministic agent generates a structured revision object.
3. In production, replace the local agent with an OpenAI/Gemini LangChain chain:
   - retrieve past topics from vector memory
   - retrieve weak concepts from quiz performance
   - synthesize quick, smart or deep revision notes
   - persist summary, flashcards and spaced repetition tasks
4. User can export PDF, DOCX-like Word file, Markdown or plain text.
5. Saved summaries appear in Dashboard > Revision Center.

## Suggested RAG Architecture

- Embeddings: chapter content, user notes, generated summaries
- Vector DB: Pinecone or Chroma
- Retrieval filters: `userId`, `courseId`, `topic`, `difficulty`, `weakConcept`
- Agent tools:
  - `getLearningMemory(userId)`
  - `getWeakConcepts(userId)`
  - `retrieveRelatedTopics(query)`
  - `generateSummary(mode)`
  - `createFlashcards(summary)`
  - `scheduleRevision(summary)`

## Example AI Prompt

```text
You are an agentic AI revision coach.
Use current topic, previous completed topics, weak concepts, quiz scores and chapter content.
Generate quick summary, smart notes, deep revision, interview points, MCQs, flashcards, code snippets and next steps.
```

## Database Models

- `UserProgress`
- `RevisionHistory`
- `AISummaries`
- `Flashcards`
- `QuizPerformance`
- `LearningMemory`
- `ExportedFiles`

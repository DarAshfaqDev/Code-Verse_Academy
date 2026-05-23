const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    courseId: String,
    chapterId: String,
    status: { type: String, enum: ["not-started", "in-progress", "completed"], default: "in-progress" },
    completedAt: Date,
    timeSpentSeconds: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const QuizPerformanceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    topic: String,
    score: Number,
    total: Number,
    weakConcepts: [String]
  },
  { timestamps: true }
);

const LearningMemorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    completedTopics: [String],
    weakConcepts: [String],
    embeddingsRef: String,
    nextReviewAt: Date,
    roadmap: [String]
  },
  { timestamps: true }
);

const AISummarySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    topic: String,
    chapterTitle: String,
    mode: { type: String, enum: ["quick", "smart", "deep"] },
    content: mongoose.Schema.Types.Mixed,
    sourceRefs: [String]
  },
  { timestamps: true }
);

const RevisionHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    summaryId: String,
    action: { type: String, enum: ["generated", "saved", "exported", "reviewed"] },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

const FlashcardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    summaryId: String,
    front: String,
    back: String,
    ease: { type: Number, default: 2.5 },
    dueAt: Date
  },
  { timestamps: true }
);

const ExportedFileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    summaryId: String,
    format: { type: String, enum: ["pdf", "docx", "markdown", "text"] },
    fileUrl: String,
    generatedAt: Date
  },
  { timestamps: true }
);

module.exports = {
  UserProgressSchema,
  QuizPerformanceSchema,
  LearningMemorySchema,
  AISummarySchema,
  RevisionHistorySchema,
  FlashcardSchema,
  ExportedFileSchema
};

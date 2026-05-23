import { NextResponse } from "next/server";
import { generateRevisionSummary } from "@/lib/revision/agent";
import { buildRevisionPrompt } from "@/lib/revision/prompts";
import { RevisionRequest } from "@/lib/revision/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RevisionRequest | null;

  if (!body?.topic || !body?.chapterTitle || !body?.content) {
    return NextResponse.json({ error: "topic, chapterTitle and content are required" }, { status: 400 });
  }

  const summary = generateRevisionSummary(body);

  return NextResponse.json({
    summary,
    agent: {
      provider: process.env.OPENAI_API_KEY ? "openai-ready" : "local-deterministic-agent",
      promptPreview: buildRevisionPrompt(body).slice(0, 1200)
    }
  });
}

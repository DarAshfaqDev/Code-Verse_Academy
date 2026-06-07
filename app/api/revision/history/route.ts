import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";

const demoHistory = [
  {
    id: "rev-demo-1",
    title: "JavaScript Loops Revision",
    topic: "JavaScript",
    generatedAt: "2026-05-21T10:00:00.000Z",
    mode: "smart"
  },
  {
    id: "rev-demo-2",
    title: "SQL Joins Interview Notes",
    topic: "SQL",
    generatedAt: "2026-05-20T11:30:00.000Z",
    mode: "deep"
  }
];

export async function GET() {
  return NextResponse.json({ data: demoHistory });
}

export async function POST(request: Request) {
  const user = getAuthUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  return NextResponse.json({ saved: true, data: body });
}

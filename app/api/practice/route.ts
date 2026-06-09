import { NextRequest, NextResponse } from "next/server";

let practiceSessionMockDatabase: Array<{
  id: string;
  userId: string;
  sandboxType: string;
  savedState: string;
  updatedAt: string;
}> = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "demo-user-123";
  const sandboxType = searchParams.get("type");

  let items = practiceSessionMockDatabase.filter((session) => session.userId === userId);
  if (sandboxType) {
    items = items.filter((session) => session.sandboxType === sandboxType);
  }

  return NextResponse.json({ success: true, data: items }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = "demo-user-123", sandboxType, savedState } = body;

    if (!sandboxType || !savedState) {
      return NextResponse.json(
        { success: false, error: "Missing sandboxType or savedState string inputs." },
        { status: 400 }
      );
    }

    const existingIndex = practiceSessionMockDatabase.findIndex(
      (s) => s.userId === userId && s.sandboxType === sandboxType
    );

    const record = {
      id: existingIndex >= 0 ? practiceSessionMockDatabase[existingIndex].id : crypto.randomUUID(),
      userId,
      sandboxType,
      savedState,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      practiceSessionMockDatabase[existingIndex] = record;
    } else {
      practiceSessionMockDatabase.push(record);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Workspace successfully saved for revision loop.", 
      data: record 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
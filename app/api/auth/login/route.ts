import { NextResponse } from "next/server";

function createDemoToken(email: string) {
  const role = email === "moeedkamraan1123@gmail.com" ? "admin" : "student";
  const payload = {
    email,
    role,
    issuedAt: new Date().toISOString()
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  if (email === "moeedkamraan1123@gmail.com" && password !== "Cde@Verse2026") {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const isAdmin = email === "moeedkamraan1123@gmail.com";

  return NextResponse.json({
    token: createDemoToken(email),
    user: {
      name: isAdmin ? "Moeed Kamraan" : email === "student@codeverse.dev" ? "CodeVerse Student" : email.split("@")[0],
      email,
      role: isAdmin ? "admin" : "student"
    }
  });
}

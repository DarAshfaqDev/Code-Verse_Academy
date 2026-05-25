import { NextResponse } from "next/server";
import { certificateTemplates, createCertificateId } from "@/lib/certificates";

const analytics = {
  totalIssued: 1284,
  downloads: 3916,
  verificationScans: 842,
  activeTemplates: certificateTemplates.length
};

export async function GET() {
  return NextResponse.json({
    ok: true,
    analytics,
    templates: certificateTemplates,
    schema: {
      recipientName: "string",
      courseName: "string",
      completionDate: "date",
      certificateId: "string",
      instructorName: "string",
      organizationName: "string",
      duration: "string",
      grade: "string optional",
      verificationUrl: "string",
      templateId: "corporate | academic | minimal | luxury | islamic"
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const certificateId = typeof body.certificateId === "string" && body.certificateId ? body.certificateId : createCertificateId();

  return NextResponse.json({
    ok: true,
    certificate: {
      id: certificateId,
      recipientName: body.recipientName ?? "Learner",
      courseName: body.courseName ?? "CodeVerse Course",
      status: "issued",
      verificationUrl: `/verify/${certificateId}`,
      issuedAt: new Date().toISOString()
    }
  });
}

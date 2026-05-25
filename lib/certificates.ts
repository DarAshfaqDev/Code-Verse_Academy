export type CertificateTemplateId = "corporate" | "academic" | "minimal" | "luxury" | "islamic";
export type CertificateOrientation = "landscape" | "portrait";
export type CertificateElementKey =
  | "recipientName"
  | "courseName"
  | "completionDate"
  | "certificateId"
  | "instructorName"
  | "organizationName"
  | "duration"
  | "grade"
  | "signature"
  | "seal"
  | "qr";

export type CertificateData = {
  recipientName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructorName: string;
  organizationName: string;
  duration: string;
  grade: string;
  verificationUrl: string;
  logoDataUrl: string;
  signatureDataUrl: string;
  sealDataUrl: string;
  watermark: string;
};

export type CertificateTemplate = {
  id: CertificateTemplateId;
  name: string;
  description: string;
  accent: string;
  secondary: string;
  background: string;
  ink: string;
  serif: boolean;
  borderLabel: string;
};

export type CertificatePosition = {
  x: number;
  y: number;
};

export const certificateTemplates: CertificateTemplate[] = [
  {
    id: "corporate",
    name: "Corporate",
    description: "Clean business credential with blue accents.",
    accent: "#1d4ed8",
    secondary: "#0f766e",
    background: "#f8fafc",
    ink: "#0f172a",
    serif: false,
    borderLabel: "Executive border"
  },
  {
    id: "academic",
    name: "Academic",
    description: "Formal university-style certificate.",
    accent: "#7c2d12",
    secondary: "#a16207",
    background: "#fffaf0",
    ink: "#1f2937",
    serif: true,
    borderLabel: "Classic double border"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Modern monochrome layout with sharp spacing.",
    accent: "#111827",
    secondary: "#64748b",
    background: "#ffffff",
    ink: "#111827",
    serif: false,
    borderLabel: "Thin line border"
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Premium dark certificate with gold detailing.",
    accent: "#d4af37",
    secondary: "#f7e7a6",
    background: "#11100d",
    ink: "#f8fafc",
    serif: true,
    borderLabel: "Gold ornamental border"
  },
  {
    id: "islamic",
    name: "Islamic Elegant",
    description: "Refined geometric styling with emerald accents.",
    accent: "#047857",
    secondary: "#c6a15b",
    background: "#f6fff9",
    ink: "#10231b",
    serif: true,
    borderLabel: "Geometric frame"
  }
];

export const defaultCertificatePositions: Record<CertificateElementKey, CertificatePosition> = {
  recipientName: { x: 50, y: 43 },
  courseName: { x: 50, y: 56 },
  completionDate: { x: 24, y: 78 },
  certificateId: { x: 77, y: 88 },
  instructorName: { x: 32, y: 84 },
  organizationName: { x: 50, y: 19 },
  duration: { x: 77, y: 78 },
  grade: { x: 50, y: 66 },
  signature: { x: 32, y: 75 },
  seal: { x: 50, y: 79 },
  qr: { x: 77, y: 72 }
};

export function createCertificateId(seed = Date.now()) {
  return `CV-${new Date().getFullYear()}-${seed.toString(36).toUpperCase().slice(-6)}`;
}

export function defaultCertificateData(): CertificateData {
  const certificateId = createCertificateId();

  return {
    recipientName: "Moeed Kamraan",
    courseName: "Full Stack Web Development",
    completionDate: new Date().toISOString().slice(0, 10),
    certificateId,
    instructorName: "CodeVerse Mentor",
    organizationName: "CodeVerse Academy",
    duration: "42 hours",
    grade: "A+ / 96%",
    verificationUrl: `/verify/${certificateId}`,
    logoDataUrl: "",
    signatureDataUrl: "",
    sealDataUrl: "",
    watermark: "VERIFIED"
  };
}

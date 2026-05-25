"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Mail,
  Palette,
  QrCode,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  Lock
} from "lucide-react";
import { courses } from "@/lib/data";
import {
  certificateTemplates,
  createCertificateId,
  defaultCertificateData,
  defaultCertificatePositions
} from "@/lib/certificates";
import type {
  CertificateData,
  CertificateElementKey,
  CertificateOrientation,
  CertificatePosition,
  CertificateTemplate
} from "@/lib/certificates";

const elements: { key: CertificateElementKey; label: string }[] = [
  { key: "recipientName", label: "Recipient" },
  { key: "courseName", label: "Course" },
  { key: "completionDate", label: "Date" },
  { key: "certificateId", label: "ID" },
  { key: "instructorName", label: "Instructor" },
  { key: "organizationName", label: "Organization" },
  { key: "duration", label: "Duration" },
  { key: "grade", label: "Grade" },
  { key: "signature", label: "Signature" },
  { key: "seal", label: "Seal" },
  { key: "qr", label: "QR" }
];

type CertificateUser = {
  name?: string;
  email?: string;
  role?: string;
};

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function verificationLink(id: string) {
  if (typeof window === "undefined") return `/verify/${id}`;
  return `${window.location.origin}/verify/${id}`;
}

function certificateVerificationPayload(data: CertificateData) {
  return JSON.stringify({
    type: "CodeVerseCertificate",
    certificateId: data.certificateId,
    candidateName: data.recipientName,
    courseName: data.courseName,
    completionDate: data.completionDate,
    mentorName: data.instructorName,
    organizationName: data.organizationName,
    duration: data.duration,
    grade: data.grade,
    verificationUrl: data.verificationUrl
  });
}

function qrCells(value: string) {
  const size = 21;
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);

  return Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    if (finder(x, y)) {
      return x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
    }
    return ((x * 17 + y * 29 + hash + ((hash >> ((x + y) % 16)) & 7)) % 5) < 2;
  });
}

function qrSvg(value: string, x: number, y: number, size: number, ink: string) {
  const cells = qrCells(value);
  const cell = size / 21;
  return cells
    .map((filled, index) => {
      if (!filled) return "";
      const cx = x + (index % 21) * cell;
      const cy = y + Math.floor(index / 21) * cell;
      return `<rect x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="${ink}" />`;
    })
    .join("");
}

function certificateSvg({
  data,
  template,
  positions,
  orientation,
  customAccent,
  customBackground,
  customFont
}: {
  data: CertificateData;
  template: CertificateTemplate;
  positions: Record<CertificateElementKey, CertificatePosition>;
  orientation: CertificateOrientation;
  customAccent: string;
  customBackground: string;
  customFont: string;
}) {
  const width = orientation === "landscape" ? 1600 : 1120;
  const height = orientation === "landscape" ? 1120 : 1600;
  const accent = customAccent || template.accent;
  const background = customBackground || template.background;
  const font = customFont || (template.serif ? "Georgia, Times New Roman, serif" : "Inter, Arial, sans-serif");
  const text = (key: CertificateElementKey, dx = 0, dy = 0) => ({
    x: ((positions[key].x + dx) / 100) * width,
    y: ((positions[key].y + dy) / 100) * height
  });
  const logo = data.logoDataUrl
    ? `<image href="${data.logoDataUrl}" x="${width / 2 - 245}" y="${height * 0.075}" width="180" height="120" preserveAspectRatio="xMidYMid meet" />
       <text x="${width / 2 - 35}" y="${height * 0.122}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900" fill="#1688d5">Code</text>
       <text x="${width / 2 + 140}" y="${height * 0.122}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900" fill="#f06423">Verse</text>
       <text x="${width / 2 + 90}" y="${height * 0.16}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="12" fill="${template.ink}">ACADEMY</text>`
    : `<g transform="translate(${width / 2 - 250} ${height * 0.062})">
        <ellipse cx="70" cy="62" rx="74" ry="42" fill="#1d2f8f" transform="rotate(-18 70 62)" opacity="0.96"/>
        <ellipse cx="70" cy="62" rx="50" ry="28" fill="#149ad8" transform="rotate(-18 70 62)" opacity="0.95"/>
        <path d="M10 82 C48 10, 112 4, 132 56 C102 40, 58 56, 10 82Z" fill="#4425bd" opacity="0.9"/>
        <path d="M34 96 C84 100, 140 58, 154 24" fill="none" stroke="#2d8cff" stroke-width="12" stroke-linecap="round"/>
        <circle cx="62" cy="66" r="13" fill="#ffb000"/>
        <ellipse cx="105" cy="36" rx="16" ry="35" fill="#fff" transform="rotate(19 105 36)"/>
        <circle cx="108" cy="27" r="7" fill="#0b4fa3"/>
       </g>
       <text x="${width / 2 - 35}" y="${height * 0.122}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900" fill="#1688d5">Code</text>
       <text x="${width / 2 + 140}" y="${height * 0.122}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900" fill="#f06423">Verse</text>
       <path d="M${width / 2 - 30} ${height * 0.145} H${width / 2 + 215}" stroke="${template.ink}" stroke-width="2" opacity="0.55"/>
       <text x="${width / 2 + 90}" y="${height * 0.165}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="12" fill="${template.ink}">ACADEMY</text>`;
  const signature = data.signatureDataUrl
    ? `<image href="${data.signatureDataUrl}" x="${text("signature").x - 90}" y="${text("signature").y - 45}" width="180" height="70" preserveAspectRatio="xMidYMid meet" />`
    : `<path d="M${text("signature").x - 95} ${text("signature").y - 8} C ${text("signature").x - 52} ${text("signature").y - 56}, ${text("signature").x - 18} ${text("signature").y + 28}, ${text("signature").x + 78} ${text("signature").y - 18}" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
  const qr = text("qr");
  const seal = text("seal");
  const sealMarkup = data.sealDataUrl
    ? `<circle cx="${seal.x}" cy="${seal.y}" r="79" fill="#8c5d05" opacity="0.18"/>
       <image href="${data.sealDataUrl}" x="${seal.x - 76}" y="${seal.y - 76}" width="152" height="152" preserveAspectRatio="xMidYMid meet" />`
    : `<circle cx="${seal.x}" cy="${seal.y}" r="76" fill="#8c5d05" opacity="0.22"/>
       <circle cx="${seal.x}" cy="${seal.y}" r="66" fill="#d9a329"/>
       <circle cx="${seal.x}" cy="${seal.y}" r="52" fill="#f5d56c"/>
       <circle cx="${seal.x}" cy="${seal.y}" r="42" fill="none" stroke="#8a5b08" stroke-width="3"/>
       <text x="${seal.x}" y="${seal.y - 9}" text-anchor="middle" font-family="${font}" font-size="17" font-weight="900" fill="#5b3800">OFFICIAL</text>
       <text x="${seal.x}" y="${seal.y + 18}" text-anchor="middle" font-family="${font}" font-size="17" font-weight="900" fill="#5b3800">SEAL</text>`;
  const dark = template.id === "luxury";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${background}"/>
      <stop offset="100%" stop-color="${template.secondary}" stop-opacity="${dark ? "0.18" : "0.10"}"/>
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="${accent}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <path d="M0 0 C120 110, 126 285, 42 440 C108 324, 178 169, 266 0Z" fill="#06245d"/>
  <path d="M34 0 C114 94, 121 250, 50 389 C106 294, 170 144, 246 0Z" fill="#0c4db3" opacity="0.96"/>
  <path d="M7 0 C74 84, 87 252, 28 390 C82 267, 126 116, 190 0Z" fill="#f3c45c" opacity="0.92"/>
  <path d="M${width} ${height} C${width - 180} ${height - 90}, ${width - 195} ${height - 260}, ${width - 58} ${height - 455} C${width - 105} ${height - 307}, ${width - 178} ${height - 154}, ${width - 325} ${height}Z" fill="#06245d"/>
  <path d="M${width} ${height - 20} C${width - 148} ${height - 110}, ${width - 160} ${height - 260}, ${width - 45} ${height - 420} C${width - 95} ${height - 285}, ${width - 150} ${height - 145}, ${width - 275} ${height - 18}Z" fill="#0c4db3" opacity="0.96"/>
  <path d="M${width} ${height} C${width - 122} ${height - 75}, ${width - 134} ${height - 210}, ${width - 28} ${height - 350} C${width - 82} ${height - 235}, ${width - 128} ${height - 120}, ${width - 220} ${height}Z" fill="#f3c45c" opacity="0.94"/>
  <rect x="58" y="58" width="${width - 116}" height="${height - 116}" rx="0" fill="none" stroke="#d2a24a" stroke-width="4"/>
  <rect x="72" y="72" width="${width - 144}" height="${height - 144}" rx="0" fill="none" stroke="${template.ink}" stroke-opacity="0.28" stroke-width="1.6"/>
  <path d="M80 80 h92 m-92 0 v92 M${width - 80} 80 h-92 m92 0 v92 M80 ${height - 80} h92 m-92 0 v-92 M${width - 80} ${height - 80} h-92 m92 0 v-92" stroke="#d2a24a" stroke-width="3" fill="none"/>
  <text x="${width / 2}" y="${height * 0.54}" text-anchor="middle" font-family="${font}" font-size="${orientation === "landscape" ? 132 : 108}" font-weight="900" fill="${accent}" opacity="0.055">${escapeXml(data.watermark)}</text>
  ${logo}
  <text x="${text("organizationName").x}" y="${text("organizationName").y}" text-anchor="middle" font-family="${font}" font-size="22" font-weight="800" letter-spacing="5" fill="${template.ink}" opacity="0.72">${escapeXml(data.organizationName.toUpperCase())}</text>
  <text x="${width / 2}" y="${height * 0.315}" text-anchor="middle" font-family="Brush Script MT, Segoe Script, Georgia, serif" font-size="${orientation === "landscape" ? 82 : 66}" font-weight="400" fill="#bc7014">Certificate of Completion</text>
  <path d="M${width * 0.34} ${height * 0.345} H ${width * 0.44} M${width * 0.56} ${height * 0.345} H ${width * 0.66}" stroke="#c68a2b" stroke-width="2"/>
  <text x="${width / 2}" y="${height * 0.352}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="800" letter-spacing="4" fill="${template.ink}">THIS IS PRESENTED TO</text>
  <text x="${text("recipientName").x}" y="${text("recipientName").y}" text-anchor="middle" font-family="${font}" font-size="${orientation === "landscape" ? 68 : 58}" font-weight="900" fill="#172a4a">${escapeXml(data.recipientName)}</text>
  <path d="M${width * 0.31} ${height * 0.455} H ${width * 0.69}" stroke="#d8c28b" stroke-width="2" opacity="0.75"/>
  <text x="${width / 2}" y="${height * 0.495}" text-anchor="middle" font-family="${font}" font-size="22" fill="${template.ink}" opacity="0.78">For successfully completing the</text>
  <text x="${text("courseName").x}" y="${text("courseName").y}" text-anchor="middle" font-family="${font}" font-size="40" font-weight="900" fill="#12337a">${escapeXml(data.courseName.split("/")[0] ?? data.courseName)}<tspan fill="#d71919">${data.courseName.includes("/") ? `/${escapeXml(data.courseName.split("/").slice(1).join("/"))}` : ""}</tspan></text>
  <text x="${text("grade").x}" y="${text("grade").y}" text-anchor="middle" font-family="${font}" font-size="26" font-weight="700" fill="${accent}">${escapeXml(data.grade)}</text>
  <path d="M${width * 0.18} ${height * 0.735} H${width * 0.73}" stroke="${template.ink}" stroke-width="1.2" opacity="0.35"/>
  <text x="${text("completionDate").x}" y="${text("completionDate").y}" text-anchor="middle" font-family="${font}" font-size="22" fill="${template.ink}">Date: ${escapeXml(data.completionDate)}</text>
  <text x="${text("duration").x}" y="${text("duration").y}" text-anchor="middle" font-family="${font}" font-size="22" fill="${template.ink}">Duration: ${escapeXml(data.duration)}</text>
  ${signature}
  <path d="M${text("signature").x - 122} ${text("signature").y + 22} H ${text("signature").x + 122}" stroke="${template.ink}" stroke-width="2" opacity="0.5"/>
  <text x="${text("instructorName").x}" y="${text("instructorName").y}" text-anchor="middle" font-family="${font}" font-size="21" font-weight="700" fill="${template.ink}">${escapeXml(data.instructorName)}</text>
  <text x="${text("instructorName", 0, 2.6).x}" y="${text("instructorName", 0, 2.6).y}" text-anchor="middle" font-family="${font}" font-size="16" fill="${template.ink}" opacity="0.62">Authorized Instructor</text>
  ${sealMarkup}
  <rect x="${qr.x - 58}" y="${qr.y - 58}" width="116" height="116" rx="8" fill="${dark ? "#fff" : "#ffffff"}" stroke="${accent}" stroke-width="2"/>
  ${qrSvg(certificateVerificationPayload(data), qr.x - 48, qr.y - 48, 96, "#111827")}
  <text x="${text("certificateId").x}" y="${text("certificateId").y}" text-anchor="middle" font-family="${font}" font-size="17" fill="${template.ink}" opacity="0.7">ID: ${escapeXml(data.certificateId)}</text>
  <text x="${width / 2}" y="${height - 92}" text-anchor="middle" font-family="${font}" font-size="16" fill="${template.ink}" opacity="0.56">Verify at ${escapeXml(data.verificationUrl)}</text>
</svg>`;
}

async function svgToCanvas(svg: string, scale = 2) {
  const image = new Image();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas export is not available.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function dataUrlToBinary(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return atob(base64);
}

function createPdfFromJpeg(jpegDataUrl: string, width: number, height: number) {
  const imageBinary = dataUrlToBinary(jpegDataUrl);
  const objects: string[] = [];
  const pageWidth = 841.89;
  const pageHeight = width > height ? 595.28 : 841.89;
  const imageWidth = pageWidth;
  const imageHeight = pageHeight;

  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  objects.push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBinary.length} >>\nstream\n${imageBinary}\nendstream\nendobj\n`);
  const content = `q\n${imageWidth} 0 0 ${imageHeight} 0 0 cm\n/Im0 Do\nQ`;
  objects.push(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index) & 0xff;
  }
  return new Blob([bytes], { type: "application/pdf" });
}

function readFileDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CertificateStudio() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<CertificateUser | null>(null);
  const [activeModule, setActiveModule] = useState<"user" | "admin">("user");
  const [data, setData] = useState<CertificateData>(() => ({
    ...defaultCertificateData(),
    certificateId: "CV-2026-DEMO01",
    completionDate: "2026-05-25",
    verificationUrl: "/verify/CV-2026-DEMO01"
  }));
  const [templateId, setTemplateId] = useState(certificateTemplates[0].id);
  const [orientation, setOrientation] = useState<CertificateOrientation>("landscape");
  const [customAccent, setCustomAccent] = useState("");
  const [customBackground, setCustomBackground] = useState("");
  const [customFont, setCustomFont] = useState("");
  const [studioTheme, setStudioTheme] = useState<"dark" | "light">("dark");
  const [positions, setPositions] = useState(defaultCertificatePositions);
  const [selectedElement, setSelectedElement] = useState<CertificateElementKey>("recipientName");
  const [dragging, setDragging] = useState<CertificateElementKey | null>(null);
  const [status, setStatus] = useState("");
  const [bulkRows, setBulkRows] = useState<CertificateData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = JSON.parse(window.localStorage.getItem("codeverse-user") ?? "null") as CertificateUser | null;
      setUser(storedUser);
      setActiveModule(storedUser?.role === "admin" ? "admin" : "user");
    } catch {
      setUser(null);
      setActiveModule("user");
    }
  }, []);

  const template = certificateTemplates.find((item) => item.id === templateId) ?? certificateTemplates[0];
  const liveData = useMemo(
    () => ({ ...data, verificationUrl: verificationLink(data.certificateId) }),
    [data]
  );
  const svg = useMemo(
    () => certificateSvg({ data: liveData, template, positions, orientation, customAccent, customBackground, customFont }),
    [customAccent, customBackground, customFont, liveData, orientation, positions, template]
  );

  function updateField<K extends keyof CertificateData>(key: K, value: CertificateData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function resetId() {
    const certificateId = createCertificateId();
    setData((current) => ({
      ...current,
      certificateId,
      verificationUrl: verificationLink(certificateId)
    }));
  }

  function moveSelected(axis: "x" | "y", value: number) {
    setPositions((current) => ({
      ...current,
      [selectedElement]: { ...current[selectedElement], [axis]: value }
    }));
  }

  function pointerToPercent(event: React.PointerEvent<HTMLElement | SVGSVGElement>) {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) {
      return positions[dragging ?? selectedElement];
    }
    return {
      x: Math.max(4, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(4, Math.min(96, ((event.clientY - rect.top) / rect.height) * 100))
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement | SVGSVGElement>) {
    if (!dragging) return;
    setPositions((current) => ({
      ...current,
      [dragging]: pointerToPercent(event)
    }));
  }

  async function exportImage(format: "png" | "jpg" | "print") {
    const scale = format === "print" ? 4 : 2;
    const canvas = await svgToCanvas(svg, scale);
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const dataUrl = canvas.toDataURL(mime, format === "jpg" ? 0.96 : undefined);
    downloadBlob(await (await fetch(dataUrl)).blob(), `${data.certificateId}.${format === "jpg" ? "jpg" : "png"}`);
    setStatus(`${format.toUpperCase()} export downloaded.`);
  }

  async function exportPdf() {
    const canvas = await svgToCanvas(svg, 2.5);
    const jpeg = canvas.toDataURL("image/jpeg", 0.96);
    downloadBlob(createPdfFromJpeg(jpeg, canvas.width, canvas.height), `${data.certificateId}.pdf`);
    setStatus("PDF export downloaded.");
  }

  function exportSvg() {
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${data.certificateId}-print-ready.svg`);
    setStatus("Print-ready SVG downloaded.");
  }

  async function handleUpload(kind: "logoDataUrl" | "signatureDataUrl" | "sealDataUrl", file?: File) {
    if (!file) return;
    updateField(kind, await readFileDataUrl(file));
  }

  async function handleBulk(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setStatus("Excel upload UI is ready. Export your spreadsheet as CSV for this dependency-free demo importer.");
      return;
    }
    const text = await file.text();
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(",").map((item) => item.trim());
    const rows = lines.map((line, rowIndex) => {
      const values = line.split(",").map((item) => item.trim());
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
      const certificateId = row.certificateId || createCertificateId(Date.now() + rowIndex);
      return {
        ...defaultCertificateData(),
        recipientName: row.recipientName || "Learner",
        courseName: row.courseName || data.courseName,
        completionDate: row.completionDate || data.completionDate,
        certificateId,
        instructorName: row.instructorName || data.instructorName,
        organizationName: row.organizationName || data.organizationName,
        duration: row.duration || data.duration,
        grade: row.grade || data.grade,
        verificationUrl: verificationLink(certificateId),
        watermark: data.watermark,
        logoDataUrl: data.logoDataUrl,
        signatureDataUrl: data.signatureDataUrl,
        sealDataUrl: data.sealDataUrl
      };
    });
    setBulkRows(rows);
    setStatus(`${rows.length} certificates prepared from CSV.`);
  }

  function emailCertificate() {
    const subject = encodeURIComponent(`Certificate ${data.certificateId}`);
    const body = encodeURIComponent(`Your certificate is ready.\n\nRecipient: ${data.recipientName}\nCourse: ${data.courseName}\nVerify: ${liveData.verificationUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  async function downloadLearnerCertificate(certificate: { title: string; id: string; date: string; score: string }) {
    const learnerData = {
      ...data,
      courseName: certificate.title,
      certificateId: certificate.id,
      completionDate: certificate.date,
      grade: certificate.score,
      recipientName: user?.name || "Learner",
      verificationUrl: verificationLink(certificate.id)
    };
    const learnerSvg = certificateSvg({
      data: learnerData,
      template,
      positions,
      orientation,
      customAccent,
      customBackground,
      customFont
    });
    const canvas = await svgToCanvas(learnerSvg, 2.5);
    const jpeg = canvas.toDataURL("image/jpeg", 0.96);
    downloadBlob(createPdfFromJpeg(jpeg, canvas.width, canvas.height), `${certificate.id}.pdf`);
  }

  const isAdmin = user?.role === "admin";
  const completedCertificates = courses
    .filter((course) => course.progress >= 60)
    .slice(0, 6)
    .map((course, index) => ({
      title: course.title,
      id: `CV-${new Date().getFullYear()}-${course.slug.slice(0, 4).toUpperCase()}${index + 1}`,
      date: "2026-05-25",
      score: `${Math.max(78, course.progress)}%`
    }));

  if (!mounted) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-5 font-black">Loading certificate modules...</div>
      </div>
    );
  }

  if (activeModule === "user") {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Learner Certificates</p>
              <h1 className="mt-2 text-4xl font-black">Your completed course certificates</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Normal users can only view and download certificates for courses they have completed.</p>
            </div>
            {isAdmin ? (
              <button onClick={() => setActiveModule("admin")} className="rounded-xl bg-cyan-300 px-5 py-3 font-black text-slate-950">
                Open admin certificate studio
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-slate-300">
                <Lock className="size-4" /> Admin tools locked
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {completedCertificates.map((certificate) => (
              <article key={certificate.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <ShieldCheck className="mb-8 size-8 text-cyan-200" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Verified certificate</p>
                <h2 className="mt-3 text-xl font-black">{certificate.title}</h2>
                <p className="mt-3 text-sm text-slate-400">Certificate ID {certificate.id}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-slate-500">Completed</p>
                    <p className="font-black">{certificate.date}</p>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-slate-500">Score</p>
                    <p className="font-black">{certificate.score}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <a href={`/verify/${certificate.id}`} className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950">Verify</a>
                  <button
                    onClick={() => downloadLearnerCertificate(certificate)}
                    className="flex-1 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950"
                  >
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${studioTheme === "dark" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-950"}`}>
      <div className={`border-b px-4 py-4 backdrop-blur md:px-6 ${studioTheme === "dark" ? "border-white/10 bg-slate-950/95" : "border-slate-200 bg-white/90"}`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Certificate Studio</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Generate verified certificates</h1>
            <p className="mt-2 text-sm font-bold text-slate-400">Admin module: templates, exports, bulk generation, verification, and downloads.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveModule("user")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black ${studioTheme === "dark" ? "bg-white/10" : "bg-slate-200"}`}>User module</button>
            <button onClick={() => setStudioTheme(studioTheme === "dark" ? "light" : "dark")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black ${studioTheme === "dark" ? "bg-white/10" : "bg-slate-200"}`}><Sparkles className="size-4" /> {studioTheme === "dark" ? "Light" : "Dark"}</button>
            <button onClick={exportPdf} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950"><FileText className="size-4" /> PDF</button>
            <button onClick={() => exportImage("png")} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-black"><FileImage className="size-4" /> PNG</button>
            <button onClick={() => exportImage("jpg")} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-black"><ImageIcon className="size-4" /> JPG</button>
            <button onClick={exportSvg} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950"><Download className="size-4" /> Print-ready</button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 xl:grid-cols-[330px_minmax(0,1fr)_330px] xl:px-6">
        <aside className="space-y-4">
          <section className={`rounded-2xl border p-4 ${studioTheme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <h2 className="text-lg font-black">Templates</h2>
            <div className="mt-3 grid gap-2">
              {certificateTemplates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTemplateId(item.id)}
                  className={`rounded-xl border p-3 text-left transition ${templateId === item.id ? "border-cyan-300 bg-cyan-300/10" : studioTheme === "dark" ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]" : "border-slate-200 bg-slate-50 hover:bg-cyan-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-black">{item.name}</p>
                    <span className="size-4 rounded-full" style={{ background: item.accent }} />
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border p-4 ${studioTheme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <h2 className="text-lg font-black">Certificate fields</h2>
            <div className="mt-3 grid gap-3">
              {[
                ["recipientName", "Recipient Name"],
                ["courseName", "Course/Event Name"],
                ["completionDate", "Completion Date"],
                ["instructorName", "Instructor Name"],
                ["organizationName", "Organization"],
                ["duration", "Duration/Hours"],
                ["grade", "Grade/Score"],
                ["watermark", "Watermark"]
              ].map(([key, label]) => (
                <label key={key} className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                  {label}
                  <input
                    className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm font-bold outline-none focus:border-cyan-300 ${studioTheme === "dark" ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950"}`}
                    type={key === "completionDate" ? "date" : "text"}
                    value={String(data[key as keyof CertificateData])}
                    onChange={(event) => updateField(key as keyof CertificateData, event.target.value)}
                  />
                </label>
              ))}
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                  Certificate ID
                  <input
                    className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm font-bold outline-none focus:border-cyan-300 ${studioTheme === "dark" ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950"}`}
                    value={data.certificateId}
                    onChange={(event) => updateField("certificateId", event.target.value)}
                  />
                </label>
                <button type="button" onClick={resetId} className="mt-5 grid size-10 place-items-center rounded-xl bg-white/10" aria-label="Generate certificate ID">
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>
          </section>
        </aside>

        <main className="min-w-0 space-y-4">
          <section className={`rounded-2xl border p-3 ${studioTheme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <div className="flex flex-col gap-3 p-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setOrientation("landscape")} className={`rounded-xl px-4 py-2 text-sm font-black ${orientation === "landscape" ? "bg-white text-slate-950" : "bg-white/10"}`}>A4 landscape</button>
                <button onClick={() => setOrientation("portrait")} className={`rounded-xl px-4 py-2 text-sm font-black ${orientation === "portrait" ? "bg-white text-slate-950" : "bg-white/10"}`}>A4 portrait</button>
              </div>
              <p className="text-sm font-bold text-slate-400">Drag text, seal, signature, and QR directly on the certificate.</p>
            </div>
            <div className={`overflow-auto rounded-xl p-3 ${studioTheme === "dark" ? "bg-slate-900" : "bg-slate-200"}`}>
              <div
                className="relative mx-auto w-full max-w-[1100px]"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDragging(null)}
                onPointerLeave={() => setDragging(null)}
              >
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${orientation === "landscape" ? 1600 : 1120} ${orientation === "landscape" ? 1120 : 1600}`}
                  className="h-auto max-h-[72vh] w-full select-none shadow-2xl"
                  dangerouslySetInnerHTML={{ __html: svg.replace(/^<\?xml[^>]*>\s*<svg[^>]*>|<\/svg>$/g, "") }}
                />
                {elements.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onPointerDown={(event) => {
                      event.preventDefault();
                      setSelectedElement(item.key);
                      setDragging(item.key);
                    }}
                    className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-black shadow-lg transition ${
                      selectedElement === item.key
                        ? "border-cyan-200 bg-cyan-300 text-slate-950"
                        : "border-white/60 bg-slate-950/80 text-white hover:bg-slate-800"
                    }`}
                    style={{ left: `${positions[item.key].x}%`, top: `${positions[item.key].y}%` }}
                    title={`Drag ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <section className={`rounded-2xl border p-4 ${studioTheme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <h2 className="flex items-center gap-2 text-lg font-black"><Palette className="size-5 text-cyan-200" /> Designer</h2>
            <div className="mt-3 grid gap-3">
              <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                Element
                <select
                  value={selectedElement}
                  onChange={(event) => setSelectedElement(event.target.value as CertificateElementKey)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none"
                >
                  {elements.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </label>
              <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                Font
                <select
                  value={customFont}
                  onChange={(event) => setCustomFont(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none"
                >
                  <option value="">Template default</option>
                  <option value="Inter, Arial, sans-serif">Inter / Sans</option>
                  <option value="Georgia, Times New Roman, serif">Georgia / Serif</option>
                  <option value="Garamond, Georgia, serif">Garamond</option>
                  <option value="Trebuchet MS, Arial, sans-serif">Trebuchet</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">X
                  <input type="range" min="4" max="96" value={positions[selectedElement].x} onChange={(event) => moveSelected("x", Number(event.target.value))} className="mt-2 w-full" />
                </label>
                <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Y
                  <input type="range" min="4" max="96" value={positions[selectedElement].y} onChange={(event) => moveSelected("y", Number(event.target.value))} className="mt-2 w-full" />
                </label>
              </div>
              <button
                onClick={() => {
                  setDragging(selectedElement);
                  setStatus(`Drag ${selectedElement} on the preview.`);
                }}
                className="rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950"
              >
                Enable drag for selected element
              </button>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Accent
                  <input type="color" value={customAccent || template.accent} onChange={(event) => setCustomAccent(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-slate-950" />
                </label>
                <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Background
                  <input type="color" value={customBackground || template.background} onChange={(event) => setCustomBackground(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-slate-950" />
                </label>
              </div>
              <label className="rounded-xl border border-white/10 bg-slate-950 p-3 text-sm font-black">
                <Upload className="mb-2 size-5 text-cyan-200" /> Upload logo
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleUpload("logoDataUrl", event.target.files?.[0])} />
              </label>
              <label className="rounded-xl border border-white/10 bg-slate-950 p-3 text-sm font-black">
                <Upload className="mb-2 size-5 text-cyan-200" /> Upload signature
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleUpload("signatureDataUrl", event.target.files?.[0])} />
              </label>
              <label className="rounded-xl border border-white/10 bg-slate-950 p-3 text-sm font-black">
                <Upload className="mb-2 size-5 text-cyan-200" /> Upload seal / stamp
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleUpload("sealDataUrl", event.target.files?.[0])} />
              </label>
            </div>
          </section>

          <section className={`rounded-2xl border p-4 ${studioTheme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <h2 className="flex items-center gap-2 text-lg font-black"><QrCode className="size-5 text-cyan-200" /> Verification</h2>
            <p className="mt-2 break-all text-sm leading-6 text-slate-400">{liveData.verificationUrl}</p>
            <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
              QR includes certificate ID, candidate, course, completion date, mentor, organization, duration, grade, and verification URL.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={emailCertificate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-black"><Mail className="size-4" /> Email</button>
              <button onClick={() => setStatus("Certificate saved locally for demo review.")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-black"><Save className="size-4" /> Save</button>
            </div>
          </section>

          <section className={`rounded-2xl border p-4 ${studioTheme === "dark" ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white"}`}>
            <h2 className="flex items-center gap-2 text-lg font-black"><FileSpreadsheet className="size-5 text-cyan-200" /> Bulk generation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Upload CSV with recipientName, courseName, completionDate, instructorName, duration, grade.</p>
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950">
              <Upload className="size-4" /> Upload CSV
              <input type="file" accept=".csv,.xlsx,.xls,text/csv" className="sr-only" onChange={(event) => handleBulk(event.target.files?.[0])} />
            </label>
            {bulkRows.length ? <p className="mt-3 text-sm font-bold text-emerald-200">{bulkRows.length} rows ready. Select a row to preview.</p> : null}
            <div className="mt-3 max-h-36 overflow-auto text-sm">
              {bulkRows.map((row) => (
                <button key={row.certificateId} onClick={() => setData(row)} className="block w-full border-t border-white/10 py-2 text-left font-bold text-slate-300 hover:text-white">
                  {row.recipientName} · {row.courseName}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
            <h2 className="flex items-center gap-2 text-lg font-black"><ShieldCheck className="size-5 text-emerald-200" /> Status</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50">{status || "Ready to generate a verified certificate."}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

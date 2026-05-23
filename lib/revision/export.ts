import { RevisionSummary } from "@/lib/revision/types";

function flattenSummary(summary: RevisionSummary) {
  return [
    `# ${summary.title}`,
    "",
    `Topic: ${summary.topic}`,
    `Mode: ${summary.mode}`,
    `Generated: ${new Date(summary.generatedAt).toLocaleString()}`,
    "",
    "## Short Summary",
    ...summary.shortSummary.map((item) => `- ${item}`),
    "",
    "## Key Concepts",
    ...summary.keyConcepts.map((item) => `- ${item}`),
    "",
    "## Definitions",
    ...summary.definitions.map((item) => `- ${item.term}: ${item.meaning}`),
    "",
    "## Detailed Notes",
    ...summary.detailedNotes.map((item) => `- ${item}`),
    "",
    "## Interview Points",
    ...summary.interviewPoints.map((item) => `- ${item}`),
    "",
    "## Practice MCQs",
    ...summary.mcqs.flatMap((mcq, index) => [
      `${index + 1}. ${mcq.question}`,
      ...mcq.options.map((option) => `   - ${option}`),
      `   Answer: ${mcq.answer}`
    ]),
    "",
    "## Flashcards",
    ...summary.flashcards.map((card) => `- Q: ${card.front}\n  A: ${card.back}`)
  ].join("\n");
}

function download(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportRevision(summary: RevisionSummary, format: "markdown" | "text" | "docx" | "pdf") {
  const baseName = summary.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const markdown = flattenSummary(summary);

  if (format === "markdown") {
    download(`${baseName}.md`, markdown, "text/markdown");
    return;
  }

  if (format === "text") {
    download(`${baseName}.txt`, markdown.replace(/^#+\s/gm, ""), "text/plain");
    return;
  }

  if (format === "docx") {
    const html = `<html><head><meta charset="utf-8"><title>${summary.title}</title></head><body>${markdown
      .split("\n")
      .map((line) => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
      .join("")}</body></html>`;
    download(`${baseName}.doc`, html, "application/msword");
    return;
  }

  const pdfText = `%PDF-1.1
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 1600>>stream
BT /F1 12 Tf 48 744 Td (${markdown
    .slice(0, 1200)
    .replace(/[()\\]/g, "")
    .replace(/\n/g, " ")}) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF`;
  download(`${baseName}.pdf`, pdfText, "application/pdf");
}

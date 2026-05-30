from __future__ import annotations

import json
import math
import re
from pathlib import Path

from docx import Document

SOURCE = Path("Blogs.docx")
OUT = Path("data/blogs.json")


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def clean_heading(text: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*\.?\s+", "", normalize(text))


def is_preformatted(text: str) -> bool:
    raw = text.strip()
    if not raw:
      return False
    lines = [line.rstrip() for line in raw.splitlines() if line.strip()]
    if len(lines) >= 3 and any(line.startswith(("+", "|", "$$")) for line in lines):
        return True
    if "SELECT " in raw or "FROM " in raw or "GROUP BY" in raw or "WITH " in raw:
        return True
    if "----" in raw or "====" in raw:
        return True
    return False


def classify(style: str, text: str) -> dict[str, object]:
    raw = text.strip()
    if style == "List Paragraph":
        return {"type": "list", "text": normalize(raw)}
    if style == "Heading 2":
        return {"type": "heading", "level": 2, "text": clean_heading(raw)}
    if style == "Heading 3":
        return {"type": "heading", "level": 3, "text": clean_heading(raw)}
    if is_preformatted(raw):
        return {"type": "pre", "text": raw}
    return {"type": "paragraph", "text": normalize(raw)}


def article_meta(order: int, title: str, blocks: list[dict[str, object]]) -> dict[str, object]:
    words = sum(len(str(block["text"]).split()) for block in blocks)
    read_time = max(5, math.ceil(words / 220))
    sections = sum(1 for block in blocks if block["type"] == "heading")
    excerpt = ""
    for block in blocks:
        if block["type"] == "paragraph":
            excerpt = str(block["text"])
            break
    category = "Editorial"
    lower = title.lower()
    if "javascript" in lower:
        category = "JavaScript"
    elif "sql" in lower:
        category = "SQL"
    elif "machine learning" in lower or "ml" in lower:
        category = "Machine Learning"
    elif "accessibility" in lower or "frontend" in lower:
        category = "Frontend"

    return {
        "order": order,
        "slug": slugify(title),
        "title": title,
        "category": category,
        "excerpt": excerpt[:240].rstrip(),
        "wordCount": words,
        "readingTime": read_time,
        "sectionCount": sections,
        "format": "Word article",
    }


def main() -> None:
    doc = Document(SOURCE)
    articles: list[dict[str, object]] = []
    current: dict[str, object] | None = None

    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue

        if paragraph.style.name == "Heading 1":
            if current:
                articles.append(current)
            current = {
                "title": clean_heading(text),
                "blocks": [],
            }
            continue

        if text.startswith("Blog #"):
            continue

        if current is None:
            continue

        block = classify(paragraph.style.name, text)
        current["blocks"].append(block)

    if current:
        articles.append(current)

    payload = {
        "source": SOURCE.name,
        "articles": [
            {
                **article_meta(index + 1, str(article["title"]), list(article["blocks"])),
                "blocks": article["blocks"],
            }
            for index, article in enumerate(articles)
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} with {len(payload['articles'])} articles")


if __name__ == "__main__":
    main()

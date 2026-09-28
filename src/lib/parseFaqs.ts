export interface FaqEntry {
  question: string
  answer: string
}

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&#x27;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&nbsp;": " ",
}

function decodeEntities(text: string): string {
  return text.replace(/&amp;|&#x27;|&#39;|&quot;|&nbsp;/g, (entity) => HTML_ENTITIES[entity])
}

// Webflow rich text stores FAQs as a heading plus a single paragraph of
// "Q: ... A: ... Q: ... A: ..." runs with no per-question structure.
export function parseFaqs(html: string | undefined): FaqEntry[] {
  if (!html) return []

  const text = decodeEntities(
    html
      .replace(/^\s*<h[1-6][^>]*>.*?<\/h[1-6]>\s*/i, "")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  ).trim()

  const entries: FaqEntry[] = []
  const pattern = /Q:\s*(.+?)\s*A:\s*(.+?)(?=\s*Q:|$)/gs
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    const question = match[1].trim()
    const answer = match[2].trim()
    if (question && answer) entries.push({ question, answer })
  }
  return entries
}

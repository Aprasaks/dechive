import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";

const root = process.cwd();
const manifestPath = path.join(root, "fixtures/editor-benchmark/manifest.json");
const outputPath = path.join(root, "fixtures/editor-benchmark/output/report.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const parser = unified().use(remarkParse).use(remarkGfm);
const serializer = unified().use(remarkStringify, { bullet: "-", fences: true }).use(remarkGfm);
const hash = (value) => createHash("sha256").update(value).digest("hex");

function slugify(value, seen) {
  const base = value.normalize("NFKC").toLowerCase().trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-") || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function textOf(node) {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function metrics(tree) {
  const result = { headings: [], paragraphs: 0, lists: 0, codeBlocks: [], tables: 0, images: [], links: 0, blockquotes: 0, textHash: "" };
  const seen = new Map();
  const texts = [];
  function visit(node) {
    if (node.type === "heading") result.headings.push({ level: node.depth, anchorId: slugify(textOf(node), seen) });
    if (node.type === "paragraph") result.paragraphs += 1;
    if (node.type === "list") result.lists += 1;
    if (node.type === "code") result.codeBlocks.push({ language: node.lang ?? null, meta: node.meta ?? null });
    if (node.type === "table") result.tables += 1;
    if (node.type === "image") result.images.push(node.url);
    if (node.type === "link") result.links += 1;
    if (node.type === "blockquote") result.blockquotes += 1;
    if (node.type === "text" || node.type === "inlineCode" || node.type === "code") texts.push(node.value ?? "");
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);
  result.textHash = hash(texts.join("\n").replace(/\s+/g, " ").trim());
  return result;
}

function toDocument(tree) {
  const seen = new Map();
  const convert = (node) => {
    const children = (node.children ?? []).map(convert);
    switch (node.type) {
      case "root": return { type: "document", schemaVersion: 1, children };
      case "text": return { type: "text", value: node.value };
      case "paragraph": return { type: "paragraph", children };
      case "heading": return { type: "heading", attrs: { level: node.depth, anchorId: slugify(textOf(node), seen) }, children };
      case "strong": return { type: "bold", children };
      case "emphasis": return { type: "italic", children };
      case "delete": return { type: "strikethrough", children };
      case "inlineCode": return { type: "inlineCode", value: node.value };
      case "link": return { type: "link", attrs: { href: node.url, title: node.title ?? null }, children };
      case "image": return { type: "image", attrs: { src: node.url, alt: node.alt ?? "", title: node.title ?? null, mediaId: null } };
      case "code": return { type: "codeBlock", attrs: { language: node.lang ?? null, meta: node.meta ?? null, filename: null, caption: null, highlightLines: [] }, value: node.value };
      case "blockquote": return { type: "blockquote", children };
      case "list": return { type: node.ordered ? "orderedList" : "bulletList", attrs: { start: node.start ?? null }, children };
      case "listItem": return { type: "listItem", attrs: { checked: node.checked ?? null }, children };
      case "table": return { type: "table", attrs: { align: node.align ?? [] }, children };
      case "tableRow": return { type: "tableRow", children };
      case "tableCell": return { type: "tableCell", children };
      case "thematicBreak": return { type: "divider" };
      case "break": return { type: "hardBreak" };
      case "html": return { type: "unknown", attrs: { originalType: "html", payload: node.value }, needsReview: true };
      default: return { type: "unknown", attrs: { originalType: node.type, payload: node }, needsReview: true };
    }
  };
  return convert(tree);
}

function fromDocument(document) {
  const convert = (node) => {
    const children = (node.children ?? []).map(convert);
    switch (node.type) {
      case "document": return { type: "root", children };
      case "text": return { type: "text", value: node.value };
      case "paragraph": return { type: "paragraph", children };
      case "heading": return { type: "heading", depth: node.attrs.level, children };
      case "bold": return { type: "strong", children };
      case "italic": return { type: "emphasis", children };
      case "strikethrough": return { type: "delete", children };
      case "inlineCode": return { type: "inlineCode", value: node.value };
      case "link": return { type: "link", url: node.attrs.href, title: node.attrs.title, children };
      case "image": return { type: "image", url: node.attrs.src, alt: node.attrs.alt, title: node.attrs.title };
      case "codeBlock": return { type: "code", lang: node.attrs.language, meta: node.attrs.meta, value: node.value };
      case "blockquote": return { type: "blockquote", children };
      case "bulletList": return { type: "list", ordered: false, spread: false, children };
      case "orderedList": return { type: "list", ordered: true, start: node.attrs.start, spread: false, children };
      case "listItem": return { type: "listItem", checked: node.attrs.checked, spread: false, children };
      case "table": return { type: "table", align: node.attrs.align, children };
      case "tableRow": return { type: "tableRow", children };
      case "tableCell": return { type: "tableCell", children };
      case "divider": return { type: "thematicBreak" };
      case "hardBreak": return { type: "break" };
      default: return { type: "html", value: `<!-- dechive-unknown:${node.attrs?.originalType ?? node.type} -->` };
    }
  };
  return convert(document);
}

function same(a, b, key) { return JSON.stringify(a[key]) === JSON.stringify(b[key]); }
const reports = [];
for (const fixture of manifest.fixtures) {
  if (fixture.kind === "typescript-data") {
    const source = await readFile(path.join(root, fixture.path), "utf8");
    const dateIndex = source.indexOf(`date: '${fixture.date}'`);
    const nextDate = source.indexOf("\n    date: '", dateIndex + 1);
    const slice = source.slice(dateIndex, nextDate > dateIndex ? nextDate : undefined);
    reports.push({ ...fixture, sourceHash: hash(source), selectedSliceHash: hash(slice), observed: { dateFound: dateIndex >= 0, sourceUrls: (slice.match(/source:\s*[\"']https?:\/\//g) ?? []).length, updateSlugs: (slice.match(/slug:\s*[\"']/g) ?? []).length }, grade: "transformable", needsReview: true });
    continue;
  }
  const raw = await readFile(path.join(root, fixture.path), "utf8");
  const parsed = matter(raw);
  const originalTree = parser.parse(parsed.content);
  const original = metrics(originalTree);
  const document = toDocument(originalTree);
  const exported = String(serializer.stringify(fromDocument(document)));
  const roundTrip = metrics(parser.parse(exported));
  const checks = Object.fromEntries(["headings","paragraphs","lists","codeBlocks","tables","images","links","blockquotes","textHash"].map((key) => [key, same(original, roundTrip, key)]));
  const unknownNodes = JSON.stringify(document).match(/\"type\":\"unknown\"/g)?.length ?? 0;
  reports.push({ ...fixture, sourceHash: hash(raw), frontmatter: { keys: Object.keys(parsed.data).sort(), nullTagCount: Array.isArray(parsed.data.tags) ? parsed.data.tags.filter((tag) => tag === null).length : 0 }, original, roundTrip, checks, normalizedMarkdownHash: hash(exported), neutralDocumentHash: hash(JSON.stringify(document)), unknownNodes, grade: Object.values(checks).every(Boolean) && unknownNodes === 0 ? "preserved" : "needs_review" });
}
const ko = reports.find((item) => item.id === "heading-heavy-deep-dive-ko");
const en = reports.find((item) => item.id === "heading-heavy-deep-dive-en");
const output = { benchmarkVersion: 1, deterministicInputs: true, generatedFrom: "read-only legacy sources", fixtures: reports, translationDrift: { group: "ai-era-agile-verification", koHeadings: ko.original.headings.length, enHeadings: en.original.headings.length, sameStructure: JSON.stringify(ko.original.headings.map((h) => h.level)) === JSON.stringify(en.original.headings.map((h) => h.level)) } };
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
if (reports.some((item) => item.kind === "markdown" && Object.values(item.checks).some((ok) => !ok))) process.exitCode = 1;
console.log(`editor benchmark: ${reports.length} fixtures, report=${path.relative(root, outputPath)}, sha256=${hash(JSON.stringify(output))}`);

import { Fragment, type ReactNode } from 'react';
import type { Json } from '@/lib/supabase/database.types';

type JsonRecord = { [key: string]: Json | undefined };

export type DocumentHeading = {
  id: string;
  level: number;
  text: string;
};

type DocumentHeadingEntry = DocumentHeading & {
  key: string;
};

function isRecord(value: Json | undefined): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function childrenOf(node: JsonRecord): Json[] {
  return Array.isArray(node.content) ? node.content : [];
}

function textOf(value: Json | undefined): string {
  if (!isRecord(value)) {
    return '';
  }

  if (typeof value.text === 'string') {
    return value.text;
  }

  return childrenOf(value).map(textOf).join('');
}

function headingLevel(node: JsonRecord): number {
  if (!isRecord(node.attrs) || typeof node.attrs.level !== 'number') {
    return 2;
  }

  return Math.min(3, Math.max(2, node.attrs.level));
}

function extractDocumentHeadingEntries(bodyJson: Json): DocumentHeadingEntry[] {
  if (!isRecord(bodyJson)) {
    return [];
  }

  const headings: DocumentHeadingEntry[] = [];

  const visit = (value: Json, key: string) => {
    if (!isRecord(value)) {
      return;
    }

    if (value.type === 'heading') {
      const text = textOf(value).trim();
      if (text) {
        headings.push({
          id: `section-${headings.length + 1}`,
          key,
          level: headingLevel(value),
          text,
        });
      }
    }

    childrenOf(value).forEach((child, index) =>
      visit(child, `${key}-${index}`),
    );
  };

  visit(bodyJson, 'doc');
  return headings;
}

export function extractDocumentHeadings(bodyJson: Json): DocumentHeading[] {
  return extractDocumentHeadingEntries(bodyJson).map(({ id, level, text }) => ({
    id,
    level,
    text,
  }));
}

function safeHref(value: Json | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  if (value.startsWith('/') || value.startsWith('#')) {
    return value;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? value
      : null;
  } catch {
    return null;
  }
}

function stringAttribute(node: JsonRecord, key: string): string {
  if (!isRecord(node.attrs)) return '';
  const value = node.attrs[key];
  return typeof value === 'string' ? value : '';
}

function numberAttribute(node: JsonRecord, key: string): number | undefined {
  if (!isRecord(node.attrs)) return undefined;
  const value = node.attrs[key];
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(1, Math.round(value))
    : undefined;
}

function renderText(node: JsonRecord, key: string): ReactNode {
  let rendered: ReactNode = typeof node.text === 'string' ? node.text : '';
  const marks = Array.isArray(node.marks) ? node.marks : [];

  marks.forEach((mark, index) => {
    if (!isRecord(mark) || typeof mark.type !== 'string') {
      return;
    }

    const markKey = `${key}-mark-${index}`;

    if (mark.type === 'bold') {
      rendered = <strong key={markKey}>{rendered}</strong>;
    } else if (mark.type === 'italic') {
      rendered = <em key={markKey}>{rendered}</em>;
    } else if (mark.type === 'strike') {
      rendered = <s key={markKey}>{rendered}</s>;
    } else if (mark.type === 'code') {
      rendered = <code key={markKey}>{rendered}</code>;
    } else if (mark.type === 'link' && isRecord(mark.attrs)) {
      const href = safeHref(mark.attrs.href);
      if (href) {
        rendered = (
          <a key={markKey} href={href} rel="noreferrer">
            {rendered}
          </a>
        );
      }
    }
  });

  return <Fragment key={key}>{rendered}</Fragment>;
}

export function TiptapDocument({ bodyJson }: { bodyJson: Json }) {
  const headingIds = new Map(
    extractDocumentHeadingEntries(bodyJson).map((heading) => [
      heading.key,
      heading.id,
    ]),
  );

  const renderNode = (value: Json, key: string): ReactNode => {
    if (!isRecord(value) || typeof value.type !== 'string') {
      return null;
    }

    if (value.type === 'text') {
      return renderText(value, key);
    }

    const children = childrenOf(value).map((child, index) =>
      renderNode(child, `${key}-${index}`),
    );

    switch (value.type) {
      case 'doc':
        return <Fragment key={key}>{children}</Fragment>;
      case 'paragraph':
        return <p key={key}>{children}</p>;
      case 'heading': {
        const id = headingIds.get(key);
        return headingLevel(value) === 3 ? (
          <h3 id={id} key={key}>
            {children}
          </h3>
        ) : (
          <h2 id={id} key={key}>
            {children}
          </h2>
        );
      }
      case 'bulletList':
        return <ul key={key}>{children}</ul>;
      case 'orderedList':
        return <ol key={key}>{children}</ol>;
      case 'listItem':
        return <li key={key}>{children}</li>;
      case 'blockquote':
        return <blockquote key={key}>{children}</blockquote>;
      case 'codeBlock':
        return <pre key={key}><code>{textOf(value)}</code></pre>;
      case 'hardBreak':
        return <br key={key} />;
      case 'horizontalRule':
        return <hr key={key} />;
      case 'image': {
        const src = safeHref(stringAttribute(value, 'src'));
        if (!src) return null;
        const alt = stringAttribute(value, 'alt');
        const caption = stringAttribute(value, 'caption');

        return (
          <figure className="article-inline-image" key={key}>
            {/* The source is an owner-uploaded Supabase Storage URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={alt}
              height={numberAttribute(value, 'height')}
              loading="lazy"
              src={src}
              width={numberAttribute(value, 'width')}
            />
            {caption ? <figcaption>{caption}</figcaption> : null}
          </figure>
        );
      }
      default:
        return <Fragment key={key}>{children}</Fragment>;
    }
  };

  return <div className="article-body">{renderNode(bodyJson, 'doc')}</div>;
}

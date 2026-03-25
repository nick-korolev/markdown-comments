import { buildJsonExport, buildMarkdownWithReviewExport } from '@/shared/review/export';
import type { TReviewDocument } from '@/shared/types';
import { describe, expect, it } from 'vitest';

const REVIEW_DOCUMENT: TReviewDocument = {
  meta: {
    title: 'Plan Review',
    sourceAgent: 'Codex',
    taskName: 'MVP',
    createdDate: '2026-03-25',
  },
  markdown: '## Scope\n\nShip the browser review tool.',
  comments: [],
  updatedAt: '2026-03-25T12:00:00.000Z',
};

describe('review exports', () => {
  it('appends review comments in the expected LLM-friendly format', () => {
    const exportValue = buildMarkdownWithReviewExport(REVIEW_DOCUMENT, [
      {
        id: 'comment-1',
        body: 'Clarify whether detached comments should still export.',
        createdAt: '2026-03-25T12:00:00.000Z',
        resolved: false,
        anchor: {
          selectedText: 'browser review tool',
          textStart: 16,
          textEnd: 35,
          sourceStart: null,
          sourceEnd: null,
          prefixContext: 'Ship the ',
          suffixContext: '.',
          source: 'preview',
          matchStrategy: 'exact-text',
          reliability: 0.92,
          isDetached: false,
        },
      },
    ]);

    expect(exportValue).toContain('## Review Comments');
    expect(exportValue).toContain('[open] Target: "browser review tool"');
    expect(exportValue).toContain(
      'Comment: Clarify whether detached comments should still export.',
    );
  });

  it('serializes a JSON bundle with meta, markdown, and comments', () => {
    const exportValue = buildJsonExport(REVIEW_DOCUMENT, []);
    const parsedValue = JSON.parse(exportValue) as {
      meta: { title: string };
      markdown: string;
      comments: unknown[];
    };

    expect(parsedValue.meta.title).toBe('Plan Review');
    expect(parsedValue.markdown).toBe(REVIEW_DOCUMENT.markdown);
    expect(parsedValue.comments).toEqual([]);
  });
});

import { sanitizeReviewDocument } from '@/shared/review/document';
import { describe, expect, it } from 'vitest';

describe('sanitizeReviewDocument', () => {
  it('coerces malformed imported comments into a safe shape', () => {
    const document = sanitizeReviewDocument({
      meta: {
        title: 'Imported',
      },
      markdown: 'Example',
      comments: [
        {
          id: 'comment-1',
          body: 'Keep this',
          anchor: {
            selectedText: 'Example',
            source: 'preview',
            matchStrategy: 'context-match',
          },
        },
      ],
    });

    expect(document.comments).toHaveLength(1);
    expect(document.comments[0]?.anchor.selectedText).toBe('Example');
    expect(document.comments[0]?.anchor.source).toBe('preview');
    expect(document.comments[0]?.anchor.textStart).toBeNull();
    expect(document.comments[0]?.anchor.matchStrategy).toBe('context-match');
  });
});

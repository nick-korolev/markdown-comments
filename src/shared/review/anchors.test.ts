import { createAnchorFromEditorSelection, resolveCommentAnchor } from '@/shared/review/anchors';
import { describe, expect, it } from 'vitest';

describe('editor anchors', () => {
  it('preserves the first selected character from raw markdown', () => {
    const markdown = 'Alpha beta gamma';
    const start = markdown.indexOf('beta');
    const end = start + 'beta'.length;
    const anchor = createAnchorFromEditorSelection(markdown, start, end);

    expect(anchor?.selectedText).toBe('beta');
    expect(anchor?.sourceStart).toBe(start);
    expect(anchor?.sourceEnd).toBe(end);
  });

  it('reattaches editor anchors using raw markdown offsets and context', () => {
    const markdown = 'Alpha beta gamma';
    const start = markdown.indexOf('beta');
    const end = start + 'beta'.length;
    const anchor = createAnchorFromEditorSelection(markdown, start, end);

    if (!anchor) {
      throw new Error('Expected editor selection to produce an anchor');
    }

    const resolvedAnchor = resolveCommentAnchor('Alpha bright beta gamma', anchor);

    expect(resolvedAnchor.selectedText).toBe('beta');
    expect(resolvedAnchor.sourceStart).toBe('Alpha bright '.length);
    expect(resolvedAnchor.isDetached).toBe(false);
  });
});

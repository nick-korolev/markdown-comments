import { CONTEXT_WINDOW_LENGTH } from '@/shared/constants';
import { findBestResolvedRange, trimTextRange } from '@/shared/review/anchorSearch';
import { normalizeComparableText, renderMarkdownText } from '@/shared/review/markdown';
import type {
  TAnchorMatchStrategy,
  TComment,
  TCommentAnchor,
  TSelectionSource,
  TTextRange,
} from '@/shared/types';

const resolveSourceRange = (markdown: string, anchor: TCommentAnchor) => {
  if (
    anchor.sourceStart !== null &&
    anchor.sourceEnd !== null &&
    anchor.sourceStart >= 0 &&
    anchor.sourceEnd <= markdown.length
  ) {
    const sourceFragment = markdown.slice(anchor.sourceStart, anchor.sourceEnd);

    if (
      normalizeComparableText(sourceFragment).includes(normalizeComparableText(anchor.selectedText))
    ) {
      return {
        sourceStart: anchor.sourceStart,
        sourceEnd: anchor.sourceEnd,
      };
    }
  }

  const rawIndex = markdown.indexOf(anchor.selectedText);

  if (rawIndex === -1) {
    return {
      sourceStart: null,
      sourceEnd: null,
    };
  }

  return {
    sourceStart: rawIndex,
    sourceEnd: rawIndex + anchor.selectedText.length,
  };
};

const buildResolvedAnchor = (
  markdown: string,
  baseAnchor: TCommentAnchor,
  resolvedRange: TTextRange | null,
  strategy: TAnchorMatchStrategy,
  reliability: number,
): TCommentAnchor => {
  if (!resolvedRange) {
    return {
      ...baseAnchor,
      textStart: null,
      textEnd: null,
      sourceStart: null,
      sourceEnd: null,
      matchStrategy: 'detached',
      reliability: 0,
      isDetached: true,
    };
  }

  const text = renderMarkdownText(markdown);
  const sourceRange = resolveSourceRange(markdown, baseAnchor);

  return {
    ...baseAnchor,
    selectedText: text.slice(resolvedRange.start, resolvedRange.end),
    textStart: resolvedRange.start,
    textEnd: resolvedRange.end,
    sourceStart: sourceRange.sourceStart,
    sourceEnd: sourceRange.sourceEnd,
    prefixContext: text.slice(
      Math.max(0, resolvedRange.start - CONTEXT_WINDOW_LENGTH),
      resolvedRange.start,
    ),
    suffixContext: text.slice(
      resolvedRange.end,
      Math.min(text.length, resolvedRange.end + CONTEXT_WINDOW_LENGTH),
    ),
    matchStrategy: strategy,
    reliability,
    isDetached: false,
  };
};

export const createAnchorFromEditorSelection = (
  markdown: string,
  selectionStart: number,
  selectionEnd: number,
): TCommentAnchor | null => {
  if (selectionEnd <= selectionStart) {
    return null;
  }

  const renderedText = renderMarkdownText(markdown);
  const renderedPrefix = renderMarkdownText(markdown.slice(0, selectionStart));
  const renderedSelection = renderMarkdownText(markdown.slice(selectionStart, selectionEnd));
  const trimmedRange = trimTextRange(
    renderedText,
    renderedPrefix.length,
    renderedPrefix.length + renderedSelection.length,
  );

  if (!trimmedRange) {
    return null;
  }

  return {
    selectedText: trimmedRange.selectedText,
    textStart: trimmedRange.start,
    textEnd: trimmedRange.end,
    sourceStart: selectionStart,
    sourceEnd: selectionEnd,
    prefixContext: renderedText.slice(
      Math.max(0, trimmedRange.start - CONTEXT_WINDOW_LENGTH),
      trimmedRange.start,
    ),
    suffixContext: renderedText.slice(
      trimmedRange.end,
      Math.min(renderedText.length, trimmedRange.end + CONTEXT_WINDOW_LENGTH),
    ),
    source: 'editor',
    matchStrategy: 'exact-range',
    reliability: 1,
    isDetached: false,
  };
};

export const createAnchorFromPreviewSelection = (
  markdown: string,
  previewText: string,
  selectionStart: number,
  selectionEnd: number,
): TCommentAnchor | null => {
  const trimmedRange = trimTextRange(previewText, selectionStart, selectionEnd);

  if (!trimmedRange) {
    return null;
  }

  const rawIndex = markdown.indexOf(trimmedRange.selectedText);

  return {
    selectedText: trimmedRange.selectedText,
    textStart: trimmedRange.start,
    textEnd: trimmedRange.end,
    sourceStart: rawIndex === -1 ? null : rawIndex,
    sourceEnd: rawIndex === -1 ? null : rawIndex + trimmedRange.selectedText.length,
    prefixContext: previewText.slice(
      Math.max(0, trimmedRange.start - CONTEXT_WINDOW_LENGTH),
      trimmedRange.start,
    ),
    suffixContext: previewText.slice(
      trimmedRange.end,
      Math.min(previewText.length, trimmedRange.end + CONTEXT_WINDOW_LENGTH),
    ),
    source: 'preview',
    matchStrategy: 'exact-range',
    reliability: 1,
    isDetached: false,
  };
};

export const resolveCommentAnchor = (markdown: string, anchor: TCommentAnchor): TCommentAnchor => {
  const renderedText = renderMarkdownText(markdown);
  const resolvedRange = findBestResolvedRange(renderedText, anchor);

  if (resolvedRange) {
    return buildResolvedAnchor(
      markdown,
      anchor,
      resolvedRange,
      resolvedRange.strategy,
      resolvedRange.reliability,
    );
  }

  return buildResolvedAnchor(markdown, anchor, null, 'detached', 0);
};

export const resolveComments = (markdown: string, comments: TComment[]) =>
  comments.map((comment) => ({
    ...comment,
    anchor: resolveCommentAnchor(markdown, comment.anchor),
  }));

export const hasSelectionOverlap = (range: TTextRange, comments: TComment[]) =>
  comments.some((comment) => {
    if (
      comment.anchor.isDetached ||
      comment.anchor.textStart === null ||
      comment.anchor.textEnd === null
    ) {
      return false;
    }

    return range.start < comment.anchor.textEnd && range.end > comment.anchor.textStart;
  });

export const createRangeFromAnchor = (anchor: TCommentAnchor) => {
  if (anchor.isDetached || anchor.textStart === null || anchor.textEnd === null) {
    return null;
  }

  return {
    start: anchor.textStart,
    end: anchor.textEnd,
  };
};

export const getSelectionAnchor = (
  source: TSelectionSource,
  markdown: string,
  previewText: string,
  selectionStart: number,
  selectionEnd: number,
) =>
  source === 'editor'
    ? createAnchorFromEditorSelection(markdown, selectionStart, selectionEnd)
    : createAnchorFromPreviewSelection(markdown, previewText, selectionStart, selectionEnd);

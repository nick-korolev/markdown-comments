import { createEmptyReviewDocument } from '@/shared/constants';
import type { TComment, TCommentAnchor, TReviewDocument } from '@/shared/types';

const sanitizeCommentAnchor = (value: unknown): TCommentAnchor => {
  const candidate = value && typeof value === 'object' ? (value as Partial<TCommentAnchor>) : {};

  return {
    selectedText: typeof candidate.selectedText === 'string' ? candidate.selectedText : '',
    textStart: typeof candidate.textStart === 'number' ? candidate.textStart : null,
    textEnd: typeof candidate.textEnd === 'number' ? candidate.textEnd : null,
    sourceStart: typeof candidate.sourceStart === 'number' ? candidate.sourceStart : null,
    sourceEnd: typeof candidate.sourceEnd === 'number' ? candidate.sourceEnd : null,
    prefixContext: typeof candidate.prefixContext === 'string' ? candidate.prefixContext : '',
    suffixContext: typeof candidate.suffixContext === 'string' ? candidate.suffixContext : '',
    source: candidate.source === 'preview' ? 'preview' : 'editor',
    matchStrategy:
      candidate.matchStrategy === 'exact-text' ||
      candidate.matchStrategy === 'context-match' ||
      candidate.matchStrategy === 'fuzzy-context' ||
      candidate.matchStrategy === 'detached'
        ? candidate.matchStrategy
        : 'exact-range',
    reliability: typeof candidate.reliability === 'number' ? candidate.reliability : 0,
    isDetached: Boolean(candidate.isDetached),
  };
};

const sanitizeComment = (value: unknown): TComment | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<TComment>;

  if (typeof candidate.id !== 'string' || typeof candidate.body !== 'string') {
    return null;
  }

  return {
    id: candidate.id,
    body: candidate.body,
    createdAt:
      typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString(),
    resolved: Boolean(candidate.resolved),
    anchor: sanitizeCommentAnchor(candidate.anchor),
  };
};

export const sanitizeReviewDocument = (value: unknown): TReviewDocument => {
  const fallbackDocument = createEmptyReviewDocument();

  if (!value || typeof value !== 'object') {
    return fallbackDocument;
  }

  const candidate = value as Partial<TReviewDocument>;

  return {
    meta: {
      title: typeof candidate.meta?.title === 'string' ? candidate.meta.title : '',
      sourceAgent:
        typeof candidate.meta?.sourceAgent === 'string' ? candidate.meta.sourceAgent : '',
      taskName: typeof candidate.meta?.taskName === 'string' ? candidate.meta.taskName : '',
      createdDate:
        typeof candidate.meta?.createdDate === 'string'
          ? candidate.meta.createdDate
          : fallbackDocument.meta.createdDate,
    },
    markdown:
      typeof candidate.markdown === 'string' ? candidate.markdown : fallbackDocument.markdown,
    comments: Array.isArray(candidate.comments)
      ? candidate.comments
          .map((comment) => sanitizeComment(comment))
          .filter((comment): comment is TComment => comment !== null)
      : [],
    updatedAt:
      typeof candidate.updatedAt === 'string' ? candidate.updatedAt : fallbackDocument.updatedAt,
  };
};

export const updateReviewDocument = (
  document: TReviewDocument,
  updates: Partial<TReviewDocument>,
): TReviewDocument => ({
  ...document,
  ...updates,
  updatedAt: new Date().toISOString(),
});

import type { TComment } from '@/shared/types';

export type TEditorSegment = {
  commentId: string | null;
  isActive: boolean;
  isResolved: boolean;
  text: string;
};

export type TCommentCallout = {
  comment: TComment;
  top: number;
};

const getAttachedComments = (comments: TComment[]) =>
  comments
    .filter(
      (comment) =>
        !comment.anchor.isDetached &&
        comment.anchor.sourceStart !== null &&
        comment.anchor.sourceEnd !== null,
    )
    .sort((left, right) => (left.anchor.sourceStart ?? 0) - (right.anchor.sourceStart ?? 0));

const getLineIndex = (markdown: string, sourceStart: number) =>
  markdown.slice(0, sourceStart).split('\n').length - 1;

export const getDetachedComments = (comments: TComment[]) =>
  comments.filter(
    (comment) =>
      comment.anchor.isDetached ||
      comment.anchor.sourceStart === null ||
      comment.anchor.sourceEnd === null,
  );

export const buildEditorSegments = (
  markdown: string,
  comments: TComment[],
  activeCommentId: string | null,
) => {
  const attachedComments = getAttachedComments(comments);
  const segments: TEditorSegment[] = [];
  let cursor = 0;

  for (const comment of attachedComments) {
    const start = comment.anchor.sourceStart ?? 0;
    const end = comment.anchor.sourceEnd ?? start;

    if (start > cursor) {
      segments.push({
        commentId: null,
        isActive: false,
        isResolved: false,
        text: markdown.slice(cursor, start),
      });
    }

    segments.push({
      commentId: comment.id,
      isActive: activeCommentId === comment.id,
      isResolved: comment.resolved,
      text: markdown.slice(start, end),
    });
    cursor = end;
  }

  if (cursor < markdown.length) {
    segments.push({
      commentId: null,
      isActive: false,
      isResolved: false,
      text: markdown.slice(cursor),
    });
  }

  if (segments.length === 0) {
    return [
      {
        commentId: null,
        isActive: false,
        isResolved: false,
        text: markdown,
      },
    ];
  }

  return segments;
};

export const buildCommentCallouts = (
  markdown: string,
  comments: TComment[],
  scrollTop: number,
  lineHeight: number,
  paddingTop: number,
) => {
  const attachedComments = getAttachedComments(comments);
  const callouts: TCommentCallout[] = [];

  for (const comment of attachedComments) {
    const lineIndex = getLineIndex(markdown, comment.anchor.sourceStart ?? 0);
    const rawTop = paddingTop + lineIndex * lineHeight - scrollTop;
    const previousCallout = callouts.at(-1);
    const top = previousCallout ? Math.max(rawTop, previousCallout.top + 72) : rawTop;

    callouts.push({
      comment,
      top,
    });
  }

  return callouts;
};

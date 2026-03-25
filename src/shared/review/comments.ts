import type { TComment, TCommentFilter, TCommentStatus } from '@/shared/types';

export const getCommentStatus = (comment: TComment): TCommentStatus => {
  if (comment.anchor.isDetached) {
    return 'detached';
  }

  return comment.resolved ? 'resolved' : 'open';
};

export const filterComments = (comments: TComment[], filter: TCommentFilter) => {
  if (filter === 'all') {
    return comments;
  }

  return comments.filter((comment) => getCommentStatus(comment) === filter);
};

export const getCommentSnippet = (value: string, limit = 120) => {
  const compactValue = value.replace(/\s+/g, ' ').trim();

  if (compactValue.length <= limit) {
    return compactValue;
  }

  return `${compactValue.slice(0, limit - 1)}…`;
};

export const areCommentsEqual = (left: TComment[], right: TComment[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((comment, index) => {
    const matchingComment = right[index];

    return JSON.stringify(comment) === JSON.stringify(matchingComment);
  });
};

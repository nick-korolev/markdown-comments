import type { TComment } from '@/shared/types';

type THighlightRange = {
  id: string;
  isActive: boolean;
  isResolved: boolean;
  start: number;
  end: number;
};

const createHighlightSpan = (document: Document, range: THighlightRange, text: string) => {
  const span = document.createElement('mark');

  span.dataset.commentId = range.id;
  span.dataset.reviewHighlight = 'true';
  span.dataset.reviewState = range.isResolved ? 'resolved' : 'open';
  span.dataset.reviewActive = range.isActive ? 'true' : 'false';
  span.textContent = text;

  return span;
};

const getHighlightRanges = (comments: TComment[], activeCommentId: string | null) =>
  comments
    .filter(
      (comment) =>
        !comment.anchor.isDetached &&
        comment.anchor.textStart !== null &&
        comment.anchor.textEnd !== null,
    )
    .map<THighlightRange>((comment) => ({
      id: comment.id,
      isActive: activeCommentId === comment.id,
      isResolved: comment.resolved,
      start: comment.anchor.textStart ?? 0,
      end: comment.anchor.textEnd ?? 0,
    }))
    .sort((left, right) => left.start - right.start);

export const applyPreviewHighlights = (
  container: HTMLDivElement,
  comments: TComment[],
  activeCommentId: string | null,
) => {
  const highlightRanges = getHighlightRanges(comments, activeCommentId);

  if (highlightRanges.length === 0) {
    return;
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const replacements: Array<{ fragment: DocumentFragment; node: Text }> = [];
  let currentNode = walker.nextNode();
  let textOffset = 0;

  while (currentNode) {
    const textNode = currentNode as Text;
    const nodeText = textNode.textContent ?? '';
    const nodeEnd = textOffset + nodeText.length;
    const overlappingRanges = highlightRanges.filter(
      (range) => range.start < nodeEnd && range.end > textOffset,
    );

    if (nodeText && overlappingRanges.length > 0) {
      const fragment = document.createDocumentFragment();
      let localCursor = 0;

      for (const range of overlappingRanges) {
        const overlapStart = Math.max(range.start, textOffset) - textOffset;
        const overlapEnd = Math.min(range.end, nodeEnd) - textOffset;

        if (overlapStart > localCursor) {
          fragment.append(nodeText.slice(localCursor, overlapStart));
        }

        fragment.append(
          createHighlightSpan(document, range, nodeText.slice(overlapStart, overlapEnd)),
        );
        localCursor = overlapEnd;
      }

      if (localCursor < nodeText.length) {
        fragment.append(nodeText.slice(localCursor));
      }

      replacements.push({
        fragment,
        node: textNode,
      });
    }

    textOffset = nodeEnd;
    currentNode = walker.nextNode();
  }

  for (const { fragment, node } of replacements) {
    node.replaceWith(fragment);
  }
};

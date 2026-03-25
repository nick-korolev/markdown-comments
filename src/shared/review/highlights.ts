import type { TComment } from '@/shared/types';

type THighlightRange = {
  id: string;
  start: number;
  end: number;
  isResolved: boolean;
  isActive: boolean;
};

const createHighlightSpan = (
  document: Document,
  range: THighlightRange,
  content: string,
  isFocused: boolean,
) => {
  const span = document.createElement('span');
  const classNames = ['preview-highlight'];

  if (range.isResolved) {
    classNames.push('preview-highlight--resolved');
  }

  if (range.isActive) {
    classNames.push('preview-highlight--active');
  }

  if (isFocused) {
    classNames.push('preview-highlight--focused');
  }

  span.className = classNames.join(' ');
  span.dataset.commentId = range.id;
  span.textContent = content;

  return span;
};

const getHighlightRanges = (comments: TComment[], activeCommentId: string | null) =>
  comments
    .filter((comment) => !comment.anchor.isDetached)
    .flatMap<THighlightRange>((comment) => {
      if (comment.anchor.textStart === null || comment.anchor.textEnd === null) {
        return [];
      }

      return [
        {
          id: comment.id,
          start: comment.anchor.textStart,
          end: comment.anchor.textEnd,
          isResolved: comment.resolved,
          isActive: activeCommentId === comment.id,
        },
      ];
    })
    .sort((left, right) => left.start - right.start);

export const renderPreviewContent = (
  container: HTMLDivElement,
  html: string,
  comments: TComment[],
  activeCommentId: string | null,
) => {
  container.innerHTML = html;

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

      overlappingRanges.forEach((range, index) => {
        const overlapStart = Math.max(range.start, textOffset) - textOffset;
        const overlapEnd = Math.min(range.end, nodeEnd) - textOffset;

        if (overlapStart > localCursor) {
          fragment.append(nodeText.slice(localCursor, overlapStart));
        }

        const isFocused =
          index === 0 &&
          overlapStart === 0 &&
          overlapEnd === nodeText.length &&
          overlappingRanges.length === 1;

        fragment.append(
          createHighlightSpan(document, range, nodeText.slice(overlapStart, overlapEnd), isFocused),
        );
        localCursor = overlapEnd;
      });

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

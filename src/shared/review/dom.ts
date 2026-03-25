import type { TPanelPosition, TTextRange } from '@/shared/types';
import getCaretCoordinates from 'textarea-caret';

export const getPreviewSelectionRange = (container: HTMLDivElement): TTextRange | null => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const commonAncestor =
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : (range.commonAncestorContainer as HTMLElement);

  if (!commonAncestor || !container.contains(commonAncestor)) {
    return null;
  }

  const prefixRange = range.cloneRange();

  prefixRange.selectNodeContents(container);
  prefixRange.setEnd(range.startContainer, range.startOffset);

  const start = prefixRange.toString().length;
  const end = start + range.toString().length;

  if (end <= start) {
    return null;
  }

  return {
    start,
    end,
  };
};

export const getCurrentSelectionRect = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return null;
  }

  return rect;
};

export const getTextareaSelectionRect = (textarea: HTMLTextAreaElement) => {
  if (textarea.selectionEnd <= textarea.selectionStart) {
    return null;
  }

  const coordinates = getCaretCoordinates(textarea, textarea.selectionEnd);
  const rect = textarea.getBoundingClientRect();

  return new DOMRect(
    rect.left + coordinates.left,
    rect.top + coordinates.top,
    1,
    coordinates.height,
  );
};

export const getPanelPosition = (rect: DOMRect, panelWidth = 360): TPanelPosition => {
  const horizontalPadding = 16;
  const verticalPadding = 14;
  const maxLeft = Math.max(horizontalPadding, window.innerWidth - panelWidth - horizontalPadding);

  return {
    top: Math.min(window.innerHeight - 160, rect.bottom + verticalPadding),
    left: Math.min(maxLeft, Math.max(horizontalPadding, rect.left)),
  };
};

export const focusCommentInPreview = (container: HTMLDivElement, commentId: string) => {
  const highlightElement = container.querySelector<HTMLElement>(`[data-comment-id="${commentId}"]`);

  if (!highlightElement) {
    return;
  }

  highlightElement.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  });
};

export const getCommentHighlightRect = (container: HTMLDivElement, commentId: string) => {
  const highlightElement = container.querySelector<HTMLElement>(`[data-comment-id="${commentId}"]`);

  if (!highlightElement) {
    return null;
  }

  return highlightElement.getBoundingClientRect();
};

export const focusSelectionInEditor = (
  textarea: HTMLTextAreaElement,
  start: number | null,
  end: number | null,
) => {
  if (start === null || end === null) {
    return;
  }

  textarea.focus();
  textarea.setSelectionRange(start, end);
};

export const syncScrollPosition = (sourceElement: HTMLElement, targetElement: HTMLElement) => {
  const sourceScrollableHeight = sourceElement.scrollHeight - sourceElement.clientHeight;
  const targetScrollableHeight = targetElement.scrollHeight - targetElement.clientHeight;

  if (sourceScrollableHeight <= 0 || targetScrollableHeight <= 0) {
    return;
  }

  const ratio = sourceElement.scrollTop / sourceScrollableHeight;

  targetElement.scrollTop = ratio * targetScrollableHeight;
};

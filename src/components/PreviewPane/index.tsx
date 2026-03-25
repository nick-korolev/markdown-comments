import type { IPreviewPaneProps } from '@/components/PreviewPane/types';
import { renderPreviewContent } from '@/shared/review/highlights';
import { useEffect } from 'react';
import type { FC } from 'react';

export const PreviewPane: FC<IPreviewPaneProps> = ({
  html,
  comments,
  activeCommentId,
  previewRef,
  onCommentFocus,
  onScroll,
  onSelectionCapture,
  onTextContentChange,
}) => {
  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) {
      return;
    }

    renderPreviewContent(previewElement, html, comments, activeCommentId);
    onTextContentChange(previewElement.textContent ?? '');
  }, [activeCommentId, comments, html, onTextContentChange, previewRef]);

  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const highlightElement = target.closest<HTMLElement>('[data-comment-id]');

      if (!highlightElement?.dataset.commentId) {
        return;
      }

      onCommentFocus(highlightElement.dataset.commentId);
    };

    previewElement.addEventListener('click', handleClick);

    return () => {
      previewElement.removeEventListener('click', handleClick);
    };
  }, [onCommentFocus, previewRef]);

  return (
    <section className="pane">
      <div className="pane__header">
        <h2>Preview</h2>
        <span>Rendered markdown</span>
      </div>
      <div
        ref={previewRef}
        className="preview-content"
        onMouseUp={onSelectionCapture}
        onScroll={onScroll}
      />
    </section>
  );
};

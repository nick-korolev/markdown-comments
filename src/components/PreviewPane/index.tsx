import type { IPreviewPaneProps } from '@/components/PreviewPane/types';
import { applyPreviewHighlights } from '@/shared/review/highlights';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PREVIEW_ACCENT = '#1f3a5f';
const RESOLVED_ACCENT = '#65758b';

export const PreviewPane: FC<IPreviewPaneProps> = ({
  activeCommentId,
  comments,
  markdown,
  previewRef,
  onCommentFocus,
  onScroll,
  onSelectionCapture,
  onTextContentChange,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentKey = useMemo(
    () =>
      JSON.stringify({
        activeCommentId,
        comments: comments.map((comment) => ({
          id: comment.id,
          resolved: comment.resolved,
          start: comment.anchor.textStart,
          end: comment.anchor.textEnd,
          detached: comment.anchor.isDetached,
        })),
        markdown,
      }),
    [activeCommentId, comments, markdown],
  );

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    applyPreviewHighlights(contentElement, comments, activeCommentId);
    onTextContentChange(contentElement.textContent ?? '');
  }, [activeCommentId, comments, onTextContentChange]);

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
    <Paper
      elevation={0}
      sx={{
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        ref={previewRef}
        onMouseUp={onSelectionCapture}
        onScroll={onScroll}
        sx={{
          height: '100%',
          overflow: 'auto',
          p: 2.5,
          '& [data-review-highlight="true"]': {
            backgroundColor: alpha(PREVIEW_ACCENT, 0.12),
            borderRadius: '4px',
            cursor: 'pointer',
            paddingInline: '1px',
          },
          '& [data-review-highlight="true"][data-review-active="true"]': {
            backgroundColor: alpha(PREVIEW_ACCENT, 0.22),
          },
          '& [data-review-highlight="true"][data-review-state="resolved"]': {
            backgroundColor: alpha(RESOLVED_ACCENT, 0.18),
          },
          '& blockquote, & code, & pre': {
            fontFamily: '"IBM Plex Mono", monospace',
          },
          '& code': {
            backgroundColor: alpha('#16181d', 0.06),
            borderRadius: '4px',
            paddingInline: '4px',
            paddingBlock: '2px',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            fontWeight: 600,
            lineHeight: 1.25,
            marginBottom: 1,
            marginTop: 0,
          },
          '& p, & ul, & ol, & pre, & blockquote': {
            marginBottom: 2,
            marginTop: 0,
          },
          '& pre': {
            backgroundColor: alpha('#16181d', 0.04),
            borderRadius: '8px',
            overflow: 'auto',
            padding: 12,
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            padding: '6px 8px',
            textAlign: 'left',
          },
        }}
      >
        <Box key={contentKey} ref={contentRef}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </Box>
      </Box>
    </Paper>
  );
};

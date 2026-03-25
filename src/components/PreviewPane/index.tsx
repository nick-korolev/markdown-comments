import type { IPreviewPaneProps } from '@/components/PreviewPane/types';
import { applyPreviewHighlights } from '@/shared/review/highlights';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ACCENT = '#2d4a3e';
const RESOLVED = '#5e6459';
const SECONDARY = '#8b5e3c';

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
  }, [activeCommentId, comments, contentKey, onTextContentChange]);

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
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: (theme) => alpha(theme.palette.divider, 0.6),
          display: 'flex',
          px: 2,
          py: 0.75,
        }}
      >
        <Typography
          sx={{
            color: 'text.secondary',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Preview
        </Typography>
      </Box>
      <Box
        ref={previewRef}
        onMouseUp={onSelectionCapture}
        onScroll={onScroll}
        sx={{
          flex: 1,
          height: '100%',
          overflow: 'auto',
          p: 2,

          '& [data-review-highlight="true"]': {
            backgroundColor: alpha(ACCENT, 0.12),
            borderBottom: `2px dashed ${alpha(ACCENT, 0.28)}`,
            borderRadius: '3px',
            cursor: 'pointer',
            paddingInline: '2px',
            transition: 'background-color 120ms ease',
          },
          '& [data-review-highlight="true"]:hover': {
            backgroundColor: alpha(ACCENT, 0.18),
          },
          '& [data-review-highlight="true"][data-review-active="true"]': {
            backgroundColor: alpha(ACCENT, 0.24),
            borderBottomStyle: 'solid',
          },
          '& [data-review-highlight="true"][data-review-state="resolved"]': {
            backgroundColor: alpha(RESOLVED, 0.1),
            borderBottomColor: alpha(RESOLVED, 0.2),
          },

          '& blockquote': {
            borderLeft: `3px solid ${alpha(SECONDARY, 0.35)}`,
            color: 'text.secondary',
            fontStyle: 'italic',
            margin: 0,
            marginBottom: '12px',
            paddingLeft: '14px',
          },
          '& code': {
            backgroundColor: alpha('#1a1c19', 0.05),
            borderRadius: '4px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.84em',
            paddingBlock: '2px',
            paddingInline: '5px',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            fontFamily: '"Newsreader", "Georgia", serif',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            marginBottom: '8px',
            marginTop: 0,
          },
          '& h1': {
            fontSize: '1.65rem',
          },
          '& h2': {
            fontSize: '1.3rem',
          },
          '& h3': {
            fontSize: '1.1rem',
          },
          '& p, & ul, & ol, & pre, & blockquote': {
            lineHeight: 1.6,
            marginBottom: '10px',
            marginTop: 0,
          },
          '& pre': {
            backgroundColor: alpha('#1a1c19', 0.04),
            border: '1px solid',
            borderColor: alpha('#1a1c19', 0.06),
            borderRadius: '8px',
            overflow: 'auto',
            padding: 14,
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            padding: '8px 10px',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: alpha('#1a1c19', 0.03),
            fontWeight: 600,
          },
          '& a': {
            color: ACCENT,
            textDecorationColor: alpha(ACCENT, 0.3),
          },
          '& hr': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: 'divider',
            margin: '24px 0',
          },
          '& img': {
            maxWidth: '100%',
            borderRadius: '6px',
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

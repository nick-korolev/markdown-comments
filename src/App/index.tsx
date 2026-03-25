import { CommentPopover } from '@/components/CommentPopover';
import { EditorPane } from '@/components/EditorPane';
import { PreviewPane } from '@/components/PreviewPane';
import { useReviewController } from '@/hooks/useReviewController';
import { reviewTheme } from '@/shared/theme';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import type { FC } from 'react';

const ReviewExportIcon: FC = () => (
  <SvgIcon fontSize="small">
    <path d="M6 3h8l4 4v12H6V3Zm8 1.5V8h3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12.5h6M9 15.5h6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="m12 9.5 2.5 2.5M12 9.5 9.5 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

const CommentsExportIcon: FC = () => (
  <SvgIcon fontSize="small">
    <path d="M5 5.5h14v9H9l-4 3v-12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.5 9h7M8.5 11.75h5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

export const App: FC = () => {
  const controller = useReviewController();

  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <>
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: '44px minmax(0, 1fr)',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              px: 1.5,
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
                minWidth: 0,
              }}
              variant="caption"
            >
              {controller.flashMessage?.value ?? ''}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                aria-label="Copy markdown and comments"
                title="Copy markdown and comments"
                onClick={controller.onCopyReview}
              >
                <ReviewExportIcon />
              </IconButton>
              <IconButton
                aria-label="Copy comments only"
                title="Copy comments only"
                onClick={controller.onCopyComments}
              >
                <CommentsExportIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
              minHeight: 0,
            }}
          >
            <EditorPane
              markdown={controller.reviewDocument.markdown}
              textareaRef={controller.editorRef}
              onChange={controller.onMarkdownChange}
              onScroll={controller.onEditorScroll}
              onSelectionCapture={controller.onEditorSelectionCapture}
            />
            <PreviewPane
              activeCommentId={controller.activeCommentId}
              comments={controller.comments}
              markdown={controller.reviewDocument.markdown}
              previewRef={controller.previewRef}
              onCommentFocus={controller.onFocusComment}
              onScroll={controller.onPreviewScroll}
              onSelectionCapture={controller.onPreviewSelectionCapture}
              onTextContentChange={controller.onPreviewTextChange}
            />
          </Box>
        </Box>

        <CommentPopover
          activeComment={controller.activeComment}
          draft={controller.draft}
          onClose={controller.onCloseComment}
          onDeleteComment={controller.onDeleteComment}
          onDraftBodyChange={controller.onDraftBodyChange}
          onDraftCancel={controller.onDraftCancel}
          onDraftSave={controller.onDraftSave}
          onEditComment={controller.onEditComment}
          onToggleResolved={controller.onToggleResolved}
          position={controller.popoverPosition}
        />
      </>
    </ThemeProvider>
  );
};

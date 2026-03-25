import { CommentPopover } from '@/components/CommentPopover';
import { EditorPane } from '@/components/EditorPane';
import { FlashSnackbar } from '@/components/FlashSnackbar';
import { PreviewPane } from '@/components/PreviewPane';
import { useReviewController } from '@/hooks/useReviewController';
import { reviewTheme } from '@/shared/theme';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import type { FC } from 'react';

const CopyReviewIcon: FC = () => (
  <SvgIcon fontSize="small" sx={{ fontSize: 17 }}>
    <path d="M6 3h8l4 4v12H6V3Zm8 1.5V8h3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12.5h6M9 15.5h6" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

const CopyCommentsIcon: FC = () => (
  <SvgIcon fontSize="small" sx={{ fontSize: 17 }}>
    <path d="M5 5.5h14v9H9l-4 3v-12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.5 9h7M8.5 11.75h5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </SvgIcon>
);

export const App: FC = () => {
  const controller = useReviewController();

  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr)',
          height: '100vh',
        }}
      >
        <Box
          component="header"
          sx={{
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            px: 1.5,
            py: 0.75,
          }}
        >
          <Typography
            sx={{
              color: 'primary.main',
              fontFamily: '"Newsreader", "Georgia", serif',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              userSelect: 'none',
            }}
          >
            Review Desk
          </Typography>

          <Stack alignItems="center" direction="row" spacing={0.75}>
            <Tooltip title="Copy markdown + comments">
              <IconButton size="small" onClick={controller.onCopyReview}>
                <CopyReviewIcon />
              </IconButton>
            </Tooltip>
            <Divider flexItem orientation="vertical" />
            <Tooltip title="Copy comments only">
              <IconButton size="small" onClick={controller.onCopyComments}>
                <CopyCommentsIcon />
              </IconButton>
            </Tooltip>
          </Stack>
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

      <FlashSnackbar message={controller.flashMessage} />
    </ThemeProvider>
  );
};

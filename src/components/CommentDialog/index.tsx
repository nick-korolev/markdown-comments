import type { ICommentDialogProps } from '@/components/CommentDialog/types';
import { getCommentStatus } from '@/shared/review/comments';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import type { FC } from 'react';

export const CommentDialog: FC<ICommentDialogProps> = ({
  activeComment,
  draft,
  onClose,
  onDeleteComment,
  onDraftBodyChange,
  onDraftCancel,
  onDraftSave,
  onEditComment,
  onToggleResolved,
}) => {
  const theme = useTheme();
  const referenceText = draft?.anchor.selectedText ?? activeComment?.anchor.selectedText ?? '';

  if (!draft && !activeComment) {
    return null;
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={onClose}>
      <DialogTitle
        sx={{
          pb: 1,
          pt: 3,
        }}
      >
        <Stack spacing={1.5}>
          <Typography color="primary" variant="overline">
            {draft
              ? draft.mode === 'create'
                ? 'New annotation'
                : 'Edit annotation'
              : 'Annotation'}
          </Typography>
          <Typography variant="h2">
            {draft ? 'Write the note exactly where the edit matters.' : 'Review note'}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.12),
              p: 1.5,
            }}
          >
            <Typography variant="body2">"{referenceText}"</Typography>
          </Paper>
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          pb: 1,
        }}
      >
        {draft ? (
          <TextField
            autoFocus
            fullWidth
            minRows={6}
            multiline
            placeholder="Write a precise comment."
            value={draft.body}
            onChange={(event) => onDraftBodyChange(event.target.value)}
          />
        ) : activeComment ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label={getCommentStatus(activeComment)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              />
              <Typography color="text.secondary" variant="caption">
                {new Date(activeComment.createdAt).toLocaleString()}
              </Typography>
            </Stack>
            <Typography variant="body1">{activeComment.body}</Typography>
          </Stack>
        ) : null}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'space-between',
          px: 3,
          pb: 3,
        }}
      >
        {draft ? (
          <>
            <Button color="inherit" onClick={onDraftCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onDraftSave}>
              Save note
            </Button>
          </>
        ) : activeComment ? (
          <>
            <Stack direction="row" spacing={1}>
              <Button color="inherit" onClick={onClose}>
                Close
              </Button>
              <Button color="inherit" onClick={() => onEditComment(activeComment.id)}>
                Edit
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button color="inherit" onClick={() => onToggleResolved(activeComment.id)}>
                {activeComment.resolved ? 'Unresolve' : 'Resolve'}
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => onDeleteComment(activeComment.id)}
              >
                Delete
              </Button>
            </Stack>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

import type { ICommentPopoverProps } from '@/components/CommentPopover/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { FC } from 'react';

const ACCENT_COLOR = '#1f3a5f';

export const CommentPopover: FC<ICommentPopoverProps> = ({
  activeComment,
  draft,
  onClose,
  onDeleteComment,
  onDraftBodyChange,
  onDraftCancel,
  onDraftSave,
  onEditComment,
  onToggleResolved,
  position,
}) => {
  const isOpen = Boolean(position && (draft || activeComment));
  const selectedText = draft?.anchor.selectedText ?? activeComment?.anchor.selectedText ?? '';

  return (
    <Popover
      anchorPosition={position ? { left: position.left, top: position.top } : undefined}
      anchorReference="anchorPosition"
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      open={isOpen}
      transitionDuration={0}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      onClose={onClose}
    >
      <Box
        sx={{
          p: 1.5,
          width: 340,
        }}
      >
        <Stack spacing={1.25}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha(ACCENT_COLOR, 0.05),
              border: '1px solid',
              borderColor: 'divider',
              px: 1.25,
              py: 1,
            }}
          >
            <Typography variant="body2">{selectedText}</Typography>
          </Paper>

          {draft ? (
            <>
              <TextField
                autoFocus
                fullWidth
                minRows={4}
                multiline
                placeholder="Write a focused comment"
                value={draft.body}
                onChange={(event) => onDraftBodyChange(event.target.value)}
              />
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Button color="inherit" onClick={onDraftCancel}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={onDraftSave}>
                  Save
                </Button>
              </Stack>
            </>
          ) : activeComment ? (
            <>
              <Typography variant="body2">{activeComment.body}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button color="inherit" onClick={onClose}>
                  Close
                </Button>
                <Button color="inherit" onClick={() => onEditComment(activeComment.id)}>
                  Edit
                </Button>
                <Button color="inherit" onClick={() => onToggleResolved(activeComment.id)}>
                  {activeComment.resolved ? 'Unresolve' : 'Resolve'}
                </Button>
                <Button color="error" onClick={() => onDeleteComment(activeComment.id)}>
                  Delete
                </Button>
              </Stack>
            </>
          ) : null}
        </Stack>
      </Box>
    </Popover>
  );
};

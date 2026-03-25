import type { ICommentPopoverProps } from '@/components/CommentPopover/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { FC } from 'react';

const ACCENT = '#2d4a3e';

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
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2.5,
            boxShadow: `0 8px 32px ${alpha('#1a1c19', 0.12)}, 0 2px 8px ${alpha('#1a1c19', 0.06)}`,
            overflow: 'hidden',
          },
        },
      }}
      transitionDuration={80}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      onClose={onClose}
    >
      <Box sx={{ p: 1.75, width: 340 }}>
        <Stack spacing={1.5}>
          <Box
            sx={{
              backgroundColor: alpha(ACCENT, 0.04),
              border: '1px solid',
              borderColor: alpha(ACCENT, 0.1),
              borderRadius: 1.5,
              px: 1.5,
              py: 1,
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.76rem',
                fontStyle: 'italic',
                lineHeight: 1.5,
                maxHeight: 60,
                overflow: 'hidden',
              }}
            >
              "{selectedText}"
            </Typography>
          </Box>

          {draft ? (
            <>
              <TextField
                autoFocus
                fullWidth
                minRows={3}
                multiline
                placeholder="Write a precise note..."
                size="small"
                value={draft.body}
                onChange={(event) => onDraftBodyChange(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.84rem',
                  },
                }}
              />
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={onDraftCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={onDraftSave}
                >
                  Save
                </Button>
              </Stack>
            </>
          ) : activeComment ? (
            <>
              <Typography sx={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
                {activeComment.body}
              </Typography>
              <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                <Button color="inherit" size="small" onClick={onClose}>
                  Close
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => onEditComment(activeComment.id)}
                >
                  Edit
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => onToggleResolved(activeComment.id)}
                >
                  {activeComment.resolved ? 'Reopen' : 'Resolve'}
                </Button>
                <Button
                  color="error"
                  size="small"
                  onClick={() => onDeleteComment(activeComment.id)}
                >
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

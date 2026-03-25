import type { IFlashSnackbarProps } from '@/components/FlashSnackbar/types';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { FC } from 'react';

export const FlashSnackbar: FC<IFlashSnackbarProps> = ({ message }) => (
  <Snackbar
    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    open={Boolean(message)}
  >
    <Alert
      severity={message?.tone === 'error' ? 'error' : 'success'}
      sx={{
        borderRadius: 2,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '0.78rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        minWidth: 240,
      }}
      variant="filled"
    >
      {message?.value}
    </Alert>
  </Snackbar>
);

import type { IEditorPaneProps } from '@/components/EditorPane/types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { FC } from 'react';

export const EditorPane: FC<IEditorPaneProps> = ({
  markdown,
  textareaRef,
  onChange,
  onScroll,
  onSelectionCapture,
}) => (
  <Paper
    elevation={0}
    sx={{
      borderRight: { md: '1px solid' },
      borderColor: 'divider',
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
        justifyContent: 'space-between',
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
        Source
      </Typography>
      <Typography
        sx={{
          color: (theme) => alpha(theme.palette.text.secondary, 0.5),
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.62rem',
          letterSpacing: '0.04em',
        }}
      >
        {markdown.length} chars
      </Typography>
    </Box>
    <Box
      component="textarea"
      ref={textareaRef}
      spellCheck={false}
      value={markdown}
      onChange={(event) => onChange(event.target.value)}
      onMouseUp={onSelectionCapture}
      onScroll={onScroll}
      placeholder="Paste markdown here..."
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
        border: 0,
        color: 'text.primary',
        display: 'block',
        flex: 1,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '0.84rem',
        height: '100%',
        lineHeight: '1.8',
        outline: 'none',
        p: 2.5,
        resize: 'none',
        width: '100%',
        '&::placeholder': {
          color: (theme) => alpha(theme.palette.text.secondary, 0.4),
          fontStyle: 'italic',
        },
      }}
    />
  </Paper>
);

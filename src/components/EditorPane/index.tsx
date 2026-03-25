import type { IEditorPaneProps } from '@/components/EditorPane/types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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
      minHeight: 0,
      overflow: 'hidden',
    }}
  >
    <Box
      component="textarea"
      ref={textareaRef}
      spellCheck={false}
      value={markdown}
      onChange={(event) => onChange(event.target.value)}
      onMouseUp={onSelectionCapture}
      onScroll={onScroll}
      placeholder="Paste markdown here"
      sx={{
        backgroundColor: 'background.paper',
        border: 0,
        color: 'text.primary',
        display: 'block',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 14,
        height: '100%',
        lineHeight: '1.8',
        outline: 'none',
        p: 2.5,
        resize: 'none',
        width: '100%',
      }}
    />
  </Paper>
);

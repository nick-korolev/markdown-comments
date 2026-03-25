import type { RefObject } from 'react';

export interface IEditorPaneProps {
  markdown: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onScroll: () => void;
  onSelectionCapture: () => void;
}

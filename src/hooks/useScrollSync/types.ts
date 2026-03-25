import type { RefObject } from 'react';

export interface IUseScrollSyncParams {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  previewRef: RefObject<HTMLDivElement | null>;
}

export interface IUseScrollSyncResult {
  onEditorScroll: () => void;
  onPreviewScroll: () => void;
}

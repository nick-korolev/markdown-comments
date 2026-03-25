import type { TComment } from '@/shared/types';
import type { RefObject } from 'react';

export interface IPreviewPaneProps {
  activeCommentId: string | null;
  comments: TComment[];
  markdown: string;
  previewRef: RefObject<HTMLDivElement | null>;
  onCommentFocus: (commentId: string) => void;
  onScroll: () => void;
  onSelectionCapture: () => void;
  onTextContentChange: (value: string) => void;
}

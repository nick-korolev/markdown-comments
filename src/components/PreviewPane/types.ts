import type { TComment } from '@/shared/types';
import type { RefObject } from 'react';

export interface IPreviewPaneProps {
  html: string;
  comments: TComment[];
  activeCommentId: string | null;
  previewRef: RefObject<HTMLDivElement | null>;
  onCommentFocus: (commentId: string) => void;
  onScroll: () => void;
  onSelectionCapture: () => void;
  onTextContentChange: (value: string) => void;
}

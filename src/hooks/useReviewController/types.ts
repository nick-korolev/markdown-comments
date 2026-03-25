import type { IFlashMessage } from '@/App/types';
import type { TComment, TCommentDraft, TPanelPosition, TReviewDocument } from '@/shared/types';
import type { RefObject } from 'react';

export interface IUseReviewControllerResult {
  activeComment: TComment | null;
  activeCommentId: string | null;
  comments: TComment[];
  draft: TCommentDraft | null;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  flashMessage: IFlashMessage | null;
  popoverPosition: TPanelPosition | null;
  previewRef: RefObject<HTMLDivElement | null>;
  reviewDocument: TReviewDocument;
  onCloseComment: () => void;
  onCopyComments: () => void;
  onCopyReview: () => void;
  onDeleteComment: (commentId: string) => void;
  onDraftBodyChange: (value: string) => void;
  onDraftCancel: () => void;
  onDraftSave: () => void;
  onEditorScroll: () => void;
  onEditorSelectionCapture: () => void;
  onEditComment: (commentId: string) => void;
  onFocusComment: (commentId: string) => void;
  onMarkdownChange: (value: string) => void;
  onPreviewScroll: () => void;
  onPreviewSelectionCapture: () => void;
  onPreviewTextChange: (value: string) => void;
  onToggleResolved: (commentId: string) => void;
}

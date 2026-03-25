import type { TComment, TCommentDraft, TPanelPosition } from '@/shared/types';

export interface ICommentPopoverProps {
  activeComment: TComment | null;
  draft: TCommentDraft | null;
  onClose: () => void;
  onDeleteComment: (commentId: string) => void;
  onDraftBodyChange: (value: string) => void;
  onDraftCancel: () => void;
  onDraftSave: () => void;
  onEditComment: (commentId: string) => void;
  onToggleResolved: (commentId: string) => void;
  position: TPanelPosition | null;
}

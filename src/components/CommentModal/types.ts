import type { TComment, TCommentDraft } from '@/shared/types';

export interface ICommentModalProps {
  activeComment: TComment | null;
  comments: TComment[];
  draft: TCommentDraft | null;
  isListOpen: boolean;
  onClose: () => void;
  onDeleteComment: (commentId: string) => void;
  onDraftBodyChange: (value: string) => void;
  onDraftCancel: () => void;
  onDraftSave: () => void;
  onEditComment: (commentId: string) => void;
  onFocusComment: (commentId: string) => void;
  onToggleResolved: (commentId: string) => void;
}

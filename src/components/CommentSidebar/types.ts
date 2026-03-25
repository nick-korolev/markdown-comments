import type { TComment, TCommentDraft, TCommentFilter } from '@/shared/types';

export interface ICommentSidebarProps {
  comments: TComment[];
  activeCommentId: string | null;
  filter: TCommentFilter;
  draft: TCommentDraft | null;
  onFilterChange: (value: TCommentFilter) => void;
  onFocusComment: (commentId: string) => void;
  onEditComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onToggleResolved: (commentId: string) => void;
  onDraftBodyChange: (value: string) => void;
  onDraftCancel: () => void;
  onDraftSave: () => void;
}

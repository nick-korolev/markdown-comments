import type { IFlashMessage } from '@/App/types';
import type {
  TComment,
  TCommentDraft,
  TExportMode,
  TReviewDocument,
  TTransferMode,
} from '@/shared/types';
import type { RefObject } from 'react';

export interface IUseReviewControllerResult {
  reviewDocument: TReviewDocument;
  activeComment: TComment | null;
  previewHtml: string;
  previewComments: TComment[];
  activeCommentId: string | null;
  draft: TCommentDraft | null;
  isCommentsListOpen: boolean;
  transferMode: TTransferMode;
  isTransferOpen: boolean;
  exportMode: TExportMode;
  exportValue: string;
  importValue: string;
  importError: string;
  flashMessage: IFlashMessage | null;
  lastSavedAt: string;
  totalComments: number;
  openComments: number;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  previewRef: RefObject<HTMLDivElement | null>;
  onMarkdownChange: (value: string) => void;
  onAddComment: () => void;
  onAutoOpenSelectionDraft: () => void;
  onCloseInlinePanel: () => void;
  onFocusComment: (commentId: string) => void;
  onEditComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onToggleResolved: (commentId: string) => void;
  onDraftBodyChange: (value: string) => void;
  onDraftCancel: () => void;
  onDraftSave: () => void;
  onCopyComments: () => void;
  onOpenComments: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onTransferClose: () => void;
  onTransferModeChange: (value: TTransferMode) => void;
  onExportModeChange: (value: TExportMode) => void;
  onImportValueChange: (value: string) => void;
  onImportSubmit: () => void;
  onCopyMarkdown: () => void;
  onCopyReview: () => void;
  onCopyExport: () => void;
  onSave: () => void;
  onReset: () => void;
  onEditorScroll: () => void;
  onPreviewScroll: () => void;
  onPreviewTextChange: (value: string) => void;
}

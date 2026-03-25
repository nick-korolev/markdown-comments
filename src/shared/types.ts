export type TSelectionSource = 'editor' | 'preview';

export type TAnchorMatchStrategy =
  | 'exact-range'
  | 'exact-text'
  | 'context-match'
  | 'fuzzy-context'
  | 'detached';

export type TCommentFilter = 'all' | 'open' | 'resolved' | 'detached';

export type TCommentStatus = 'open' | 'resolved' | 'detached';

export type TTextRange = {
  start: number;
  end: number;
};

export type TPanelPosition = {
  top: number;
  left: number;
};

export type TDocumentMeta = {
  title: string;
  sourceAgent: string;
  taskName: string;
  createdDate: string;
};

export type TCommentAnchor = {
  selectedText: string;
  textStart: number | null;
  textEnd: number | null;
  sourceStart: number | null;
  sourceEnd: number | null;
  prefixContext: string;
  suffixContext: string;
  source: TSelectionSource;
  matchStrategy: TAnchorMatchStrategy;
  reliability: number;
  isDetached: boolean;
};

export type TComment = {
  id: string;
  anchor: TCommentAnchor;
  body: string;
  createdAt: string;
  resolved: boolean;
};

export type TReviewDocument = {
  meta: TDocumentMeta;
  markdown: string;
  comments: TComment[];
  updatedAt: string;
};

export type TCommentDraftMode = 'create' | 'edit';

export type TCommentDraft = {
  mode: TCommentDraftMode;
  commentId: string | null;
  anchor: TCommentAnchor;
  body: string;
};

export type TSelectionDraft = {
  anchor: TCommentAnchor;
  selectedText: string;
};

export type TExportMode = 'markdown' | 'review' | 'json';

export type TTransferMode = 'export' | 'import';

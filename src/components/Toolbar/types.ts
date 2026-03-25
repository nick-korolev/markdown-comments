export interface IToolbarProps {
  onAddComment: () => void;
  onCopyComments: () => void;
  onNew: () => void;
  onOpenComments: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onCopyMarkdown: () => void;
  onCopyReview: () => void;
  onSave: () => void;
  lastSavedAt: string;
}

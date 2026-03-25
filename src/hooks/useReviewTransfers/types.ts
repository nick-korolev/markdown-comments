import type { IFlashMessage } from '@/App/types';
import type { TComment, TExportMode, TReviewDocument, TTransferMode } from '@/shared/types';

export interface IUseReviewTransfersParams {
  importReviewDocument: (value: TReviewDocument) => void;
  onResetInlineState: () => void;
  reviewDocument: TReviewDocument;
  resolvedComments: TComment[];
  saveNow: (value?: TReviewDocument) => void;
  showFlashMessage: (value: string, tone: IFlashMessage['tone']) => void;
}

export interface IUseReviewTransfersResult {
  exportMode: TExportMode;
  exportValue: string;
  importError: string;
  importValue: string;
  isTransferOpen: boolean;
  onCopyComments: () => void;
  onCopyExport: () => void;
  onCopyMarkdown: () => void;
  onCopyReview: () => void;
  onExportModeChange: (value: TExportMode) => void;
  onImportSubmit: () => void;
  onImportValueChange: (value: string) => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onReset: () => void;
  onSave: () => void;
  onTransferClose: () => void;
  onTransferModeChange: (value: TTransferMode) => void;
  transferMode: TTransferMode;
}

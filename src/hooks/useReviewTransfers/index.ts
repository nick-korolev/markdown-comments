import type {
  IUseReviewTransfersParams,
  IUseReviewTransfersResult,
} from '@/hooks/useReviewTransfers/types';
import { createEmptyReviewDocument } from '@/shared/constants';
import { sanitizeReviewDocument } from '@/shared/review/document';
import { buildCommentsOnlyExport, buildExportPayload } from '@/shared/review/export';
import type { TExportMode, TReviewDocument, TTransferMode } from '@/shared/types';
import { useCallback, useMemo, useState } from 'react';

const hasContentToReset = (document: TReviewDocument) =>
  document.markdown.trim().length > 0 ||
  document.comments.length > 0 ||
  document.meta.title.trim().length > 0;

export const useReviewTransfers = ({
  importReviewDocument,
  onResetInlineState,
  reviewDocument,
  resolvedComments,
  saveNow,
  showFlashMessage,
}: IUseReviewTransfersParams): IUseReviewTransfersResult => {
  const [transferMode, setTransferMode] = useState<TTransferMode>('export');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [exportMode, setExportMode] = useState<TExportMode>('markdown');
  const [importValue, setImportValue] = useState('');
  const [importError, setImportError] = useState('');
  const exportValue = useMemo(
    () => buildExportPayload(exportMode, reviewDocument, resolvedComments),
    [exportMode, resolvedComments, reviewDocument],
  );

  const copyExport = useCallback(
    async (value: string, label: string) => {
      try {
        await navigator.clipboard.writeText(value);
        showFlashMessage(`${label} copied to the clipboard.`, 'success');
      } catch {
        showFlashMessage(`Unable to copy ${label.toLowerCase()}.`, 'error');
      }
    },
    [showFlashMessage],
  );

  const onCopyMarkdown = useCallback(() => {
    void copyExport(buildExportPayload('markdown', reviewDocument, resolvedComments), 'Markdown');
  }, [copyExport, resolvedComments, reviewDocument]);

  const onCopyComments = useCallback(() => {
    void copyExport(buildCommentsOnlyExport(resolvedComments), 'Comments');
  }, [copyExport, resolvedComments]);

  const onCopyReview = useCallback(() => {
    void copyExport(
      buildExportPayload('review', reviewDocument, resolvedComments),
      'Markdown with comments',
    );
  }, [copyExport, resolvedComments, reviewDocument]);

  const onCopyExport = useCallback(() => {
    void copyExport(exportValue, exportMode === 'json' ? 'JSON bundle' : 'Export');
  }, [copyExport, exportMode, exportValue]);

  const onSave = useCallback(() => {
    saveNow(reviewDocument);
    showFlashMessage('Saved to local browser storage.', 'success');
  }, [reviewDocument, saveNow, showFlashMessage]);

  const onReset = useCallback(() => {
    if (hasContentToReset(reviewDocument) && !window.confirm('Start a new local review session?')) {
      return;
    }

    onResetInlineState();
    importReviewDocument(createEmptyReviewDocument());
    setImportError('');
    setImportValue('');
    setIsTransferOpen(false);
    showFlashMessage('Started a new review session.', 'success');
  }, [importReviewDocument, onResetInlineState, reviewDocument, showFlashMessage]);

  const onImportSubmit = useCallback(() => {
    try {
      const nextDocument = sanitizeReviewDocument(JSON.parse(importValue));

      importReviewDocument(nextDocument);
      onResetInlineState();
      setImportError('');
      setIsTransferOpen(false);
      showFlashMessage('Session imported.', 'success');
    } catch {
      setImportError('Import expects a JSON bundle with meta, markdown, and comments.');
    }
  }, [importReviewDocument, importValue, onResetInlineState, showFlashMessage]);

  return {
    exportMode,
    exportValue,
    importError,
    importValue,
    isTransferOpen,
    onCopyComments,
    onCopyExport,
    onCopyMarkdown,
    onCopyReview,
    onExportModeChange: setExportMode,
    onImportSubmit,
    onImportValueChange: (value: string) => {
      setImportError('');
      setImportValue(value);
    },
    onOpenExport: () => {
      setTransferMode('export');
      setIsTransferOpen(true);
    },
    onOpenImport: () => {
      setTransferMode('import');
      setIsTransferOpen(true);
    },
    onReset,
    onSave,
    onTransferClose: () => setIsTransferOpen(false),
    onTransferModeChange: setTransferMode,
    transferMode,
  };
};

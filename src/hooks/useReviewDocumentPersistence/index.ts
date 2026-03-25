import type { IUseReviewDocumentPersistenceResult } from '@/hooks/useReviewDocumentPersistence/types';
import { createEmptyReviewDocument } from '@/shared/constants';
import { sanitizeReviewDocument } from '@/shared/review/document';
import type { TReviewDocument } from '@/shared/types';
import { useCallback, useMemo, useState } from 'react';

export const useReviewDocumentPersistence = (): IUseReviewDocumentPersistenceResult => {
  const [reviewDocument, setReviewDocument] = useState<TReviewDocument>(() =>
    createEmptyReviewDocument(),
  );
  const [lastSavedAt, setLastSavedAt] = useState(reviewDocument.updatedAt);

  const saveNow = useCallback(
    (value?: TReviewDocument) => {
      const nextDocument = value ?? reviewDocument;

      setReviewDocument(nextDocument);
      setLastSavedAt(new Date().toISOString());
    },
    [reviewDocument],
  );

  const importReviewDocument = useCallback((value: TReviewDocument) => {
    const nextDocument = sanitizeReviewDocument(value);

    setReviewDocument(nextDocument);
    setLastSavedAt(new Date().toISOString());
  }, []);

  const resetReviewDocument = useCallback(() => {
    const nextDocument = createEmptyReviewDocument();

    setReviewDocument(nextDocument);
    setLastSavedAt(new Date().toISOString());
  }, []);

  return useMemo(
    () => ({
      reviewDocument,
      setReviewDocument,
      importReviewDocument,
      resetReviewDocument,
      saveNow,
      lastSavedAt,
    }),
    [importReviewDocument, lastSavedAt, resetReviewDocument, reviewDocument, saveNow],
  );
};

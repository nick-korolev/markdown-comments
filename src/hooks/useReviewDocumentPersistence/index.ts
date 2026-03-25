import type { IUseReviewDocumentPersistenceResult } from '@/hooks/useReviewDocumentPersistence/types';
import { AUTOSAVE_DELAY_MS, STORAGE_KEY, createEmptyReviewDocument } from '@/shared/constants';
import { sanitizeReviewDocument } from '@/shared/review/document';
import type { TReviewDocument } from '@/shared/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const loadStoredDocument = () => {
  if (typeof window === 'undefined') {
    return createEmptyReviewDocument();
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return createEmptyReviewDocument();
  }

  try {
    return sanitizeReviewDocument(JSON.parse(storedValue));
  } catch {
    return createEmptyReviewDocument();
  }
};

const persistDocument = (document: TReviewDocument) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
};

export const useReviewDocumentPersistence = (): IUseReviewDocumentPersistenceResult => {
  const [reviewDocument, setReviewDocument] = useState<TReviewDocument>(() => loadStoredDocument());
  const [lastSavedAt, setLastSavedAt] = useState(reviewDocument.updatedAt);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      persistDocument(reviewDocument);
      setLastSavedAt(new Date().toISOString());
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [reviewDocument]);

  const saveNow = useCallback(
    (value?: TReviewDocument) => {
      const documentToSave = value ?? reviewDocument;

      persistDocument(documentToSave);
      setLastSavedAt(new Date().toISOString());
    },
    [reviewDocument],
  );

  const importReviewDocument = useCallback((value: TReviewDocument) => {
    const sanitizedDocument = sanitizeReviewDocument(value);

    setReviewDocument(sanitizedDocument);
    persistDocument(sanitizedDocument);
    setLastSavedAt(new Date().toISOString());
  }, []);

  const resetReviewDocument = useCallback(() => {
    const nextDocument = createEmptyReviewDocument();

    setReviewDocument(nextDocument);
    persistDocument(nextDocument);
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

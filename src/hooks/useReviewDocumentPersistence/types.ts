import type { TReviewDocument } from '@/shared/types';
import type { Dispatch, SetStateAction } from 'react';

export interface IUseReviewDocumentPersistenceResult {
  reviewDocument: TReviewDocument;
  setReviewDocument: Dispatch<SetStateAction<TReviewDocument>>;
  importReviewDocument: (value: TReviewDocument) => void;
  resetReviewDocument: () => void;
  saveNow: (value?: TReviewDocument) => void;
  lastSavedAt: string;
}

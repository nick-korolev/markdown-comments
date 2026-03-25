import type { TCommentFilter, TDocumentMeta, TReviewDocument } from '@/shared/types';

export const STORAGE_KEY = 'planner-review-tool.document';
export const CONTEXT_WINDOW_LENGTH = 48;
export const AUTOSAVE_DELAY_MS = 250;
export const STATUS_MESSAGE_TIMEOUT_MS = 2200;

export const COMMENT_FILTERS: TCommentFilter[] = ['all', 'open', 'resolved', 'detached'];

export const createDefaultMeta = (): TDocumentMeta => ({
  title: '',
  sourceAgent: '',
  taskName: '',
  createdDate: new Date().toISOString().slice(0, 10),
});

export const DEFAULT_MARKDOWN = `# Review Plan

Paste a markdown plan or agent output here.

## What to review

- Select text in the editor or preview
- Attach focused comments to exact snippets
- Export the result back into another tool

## Notes

This tool stores everything locally in your browser.`;

export const createEmptyReviewDocument = (): TReviewDocument => ({
  meta: createDefaultMeta(),
  markdown: DEFAULT_MARKDOWN,
  comments: [],
  updatedAt: new Date().toISOString(),
});

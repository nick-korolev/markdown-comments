import { useFlashMessage } from '@/hooks/useFlashMessage';
import type { IUseReviewControllerResult } from '@/hooks/useReviewController/types';
import { useReviewDocumentPersistence } from '@/hooks/useReviewDocumentPersistence';
import { useReviewShortcuts } from '@/hooks/useReviewShortcuts';
import { useReviewTransfers } from '@/hooks/useReviewTransfers';
import { useScrollSync } from '@/hooks/useScrollSync';
import {
  createRangeFromAnchor,
  getSelectionAnchor,
  hasSelectionOverlap,
  resolveComments,
} from '@/shared/review/anchors';
import { getCommentStatus } from '@/shared/review/comments';
import { updateReviewDocument } from '@/shared/review/document';
import {
  focusCommentInPreview,
  focusSelectionInEditor,
  getPreviewSelectionRange,
} from '@/shared/review/dom';
import { createCommentId } from '@/shared/review/id';
import { renderMarkdownHtml } from '@/shared/review/markdown';
import type { TComment, TCommentDraft, TReviewDocument } from '@/shared/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const findCommentById = (comments: TComment[], commentId: string) =>
  comments.find((comment) => comment.id === commentId) ?? null;

export const useReviewController = (): IUseReviewControllerResult => {
  const { reviewDocument, setReviewDocument, importReviewDocument, saveNow, lastSavedAt } =
    useReviewDocumentPersistence();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TCommentDraft | null>(null);
  const [isCommentsListOpen, setIsCommentsListOpen] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { flashMessage, showFlashMessage } = useFlashMessage();
  const { onEditorScroll, onPreviewScroll } = useScrollSync({ editorRef, previewRef });
  const previewHtml = useMemo(
    () => renderMarkdownHtml(reviewDocument.markdown),
    [reviewDocument.markdown],
  );
  const resolvedComments = useMemo(
    () => resolveComments(reviewDocument.markdown, reviewDocument.comments),
    [reviewDocument.comments, reviewDocument.markdown],
  );
  const activeComment = useMemo(
    () => (activeCommentId ? findCommentById(resolvedComments, activeCommentId) : null),
    [activeCommentId, resolvedComments],
  );

  const resetCommentUi = useCallback(() => {
    setDraft(null);
    setActiveCommentId(null);
    setIsCommentsListOpen(false);
  }, []);

  const transfers = useReviewTransfers({
    importReviewDocument,
    onResetInlineState: resetCommentUi,
    reviewDocument,
    resolvedComments,
    saveNow,
    showFlashMessage,
  });

  const updateDocument = useCallback(
    (updater: (currentDocument: TReviewDocument) => TReviewDocument) => {
      setReviewDocument((currentDocument) => updater(currentDocument));
    },
    [setReviewDocument],
  );

  const openSelectionDraft = useCallback(
    (showErrors: boolean) => {
      const editorElement = editorRef.current;
      const previewElement = previewRef.current;
      const editorSelection =
        editorElement && editorElement.selectionEnd > editorElement.selectionStart
          ? { start: editorElement.selectionStart, end: editorElement.selectionEnd }
          : null;
      const previewSelection = previewElement ? getPreviewSelectionRange(previewElement) : null;
      const selectionSource =
        editorSelection && document.activeElement === editorElement
          ? 'editor'
          : previewSelection
            ? 'preview'
            : editorSelection
              ? 'editor'
              : null;

      if (!selectionSource) {
        if (showErrors) {
          showFlashMessage('Select text in the editor or preview first.', 'error');
        }

        return;
      }

      const anchor = getSelectionAnchor(
        selectionSource,
        reviewDocument.markdown,
        previewText,
        selectionSource === 'editor'
          ? (editorSelection?.start ?? 0)
          : (previewSelection?.start ?? 0),
        selectionSource === 'editor' ? (editorSelection?.end ?? 0) : (previewSelection?.end ?? 0),
      );

      if (!anchor) {
        if (showErrors) {
          showFlashMessage(
            'The current selection does not produce a stable text snippet.',
            'error',
          );
        }

        return;
      }

      const nextRange = createRangeFromAnchor(anchor);

      if (nextRange && hasSelectionOverlap(nextRange, resolvedComments)) {
        if (showErrors) {
          showFlashMessage('Comments cannot overlap existing highlighted ranges.', 'error');
        }

        return;
      }

      setDraft({
        mode: 'create',
        commentId: null,
        anchor,
        body: '',
      });
      setActiveCommentId(null);
      setIsCommentsListOpen(false);
      window.getSelection()?.removeAllRanges();
    },
    [previewText, resolvedComments, reviewDocument.markdown, showFlashMessage],
  );

  const onMarkdownChange = useCallback(
    (value: string) => {
      updateDocument((currentDocument) =>
        updateReviewDocument(currentDocument, {
          markdown: value,
        }),
      );
    },
    [updateDocument],
  );

  const onAddComment = useCallback(() => {
    openSelectionDraft(true);
  }, [openSelectionDraft]);

  const onAutoOpenSelectionDraft = useCallback(() => {
    window.requestAnimationFrame(() => openSelectionDraft(false));
  }, [openSelectionDraft]);

  const onFocusComment = useCallback(
    (commentId: string) => {
      const comment = findCommentById(resolvedComments, commentId);

      if (!comment) {
        return;
      }

      setDraft(null);
      setActiveCommentId(commentId);
      setIsCommentsListOpen(false);

      if (previewRef.current && !comment.anchor.isDetached) {
        focusCommentInPreview(previewRef.current, commentId);
      }

      if (editorRef.current) {
        focusSelectionInEditor(
          editorRef.current,
          comment.anchor.sourceStart,
          comment.anchor.sourceEnd,
        );
      }
    },
    [resolvedComments],
  );

  const onDraftSave = useCallback(() => {
    if (!draft) {
      return;
    }

    const body = draft.body.trim();

    if (!body) {
      showFlashMessage('Comments need text before they can be saved.', 'error');
      return;
    }

    if (draft.mode === 'create') {
      const nextComment: TComment = {
        id: createCommentId(),
        anchor: draft.anchor,
        body,
        createdAt: new Date().toISOString(),
        resolved: false,
      };

      updateDocument((currentDocument) =>
        updateReviewDocument(currentDocument, {
          comments: [
            ...resolveComments(currentDocument.markdown, currentDocument.comments),
            nextComment,
          ],
        }),
      );
      setActiveCommentId(nextComment.id);
      showFlashMessage('Comment saved.', 'success');
    } else if (draft.commentId) {
      updateDocument((currentDocument) =>
        updateReviewDocument(currentDocument, {
          comments: resolveComments(currentDocument.markdown, currentDocument.comments).map(
            (comment) =>
              comment.id === draft.commentId ? { ...comment, body, anchor: draft.anchor } : comment,
          ),
        }),
      );
      setActiveCommentId(draft.commentId);
      showFlashMessage('Comment updated.', 'success');
    }

    setDraft(null);
  }, [draft, showFlashMessage, updateDocument]);

  const onEditComment = useCallback(
    (commentId: string) => {
      const comment = findCommentById(resolvedComments, commentId);

      if (!comment) {
        return;
      }

      setDraft({ mode: 'edit', commentId: comment.id, anchor: comment.anchor, body: comment.body });
      setActiveCommentId(comment.id);
      setIsCommentsListOpen(false);
    },
    [resolvedComments],
  );

  const onDeleteComment = useCallback(
    (commentId: string) => {
      if (
        !findCommentById(resolvedComments, commentId) ||
        !window.confirm('Delete this comment?')
      ) {
        return;
      }

      updateDocument((currentDocument) =>
        updateReviewDocument(currentDocument, {
          comments: resolveComments(currentDocument.markdown, currentDocument.comments).filter(
            (currentComment) => currentComment.id !== commentId,
          ),
        }),
      );
      setDraft((currentDraft) => (currentDraft?.commentId === commentId ? null : currentDraft));
      setActiveCommentId((currentCommentId) =>
        currentCommentId === commentId ? null : currentCommentId,
      );
      showFlashMessage('Comment deleted.', 'success');
    },
    [resolvedComments, showFlashMessage, updateDocument],
  );

  const onToggleResolved = useCallback(
    (commentId: string) => {
      updateDocument((currentDocument) =>
        updateReviewDocument(currentDocument, {
          comments: resolveComments(currentDocument.markdown, currentDocument.comments).map(
            (comment) =>
              comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment,
          ),
        }),
      );
    },
    [updateDocument],
  );

  useReviewShortcuts({ onAddComment, onSave: transfers.onSave });

  useEffect(() => {
    if (activeCommentId && !findCommentById(resolvedComments, activeCommentId)) {
      setActiveCommentId(null);
    }
  }, [activeCommentId, resolvedComments]);

  return {
    reviewDocument,
    activeComment,
    previewHtml,
    previewComments: resolvedComments,
    activeCommentId,
    draft,
    isCommentsListOpen,
    transferMode: transfers.transferMode,
    isTransferOpen: transfers.isTransferOpen,
    exportMode: transfers.exportMode,
    exportValue: transfers.exportValue,
    importValue: transfers.importValue,
    importError: transfers.importError,
    flashMessage,
    lastSavedAt,
    totalComments: resolvedComments.length,
    openComments: resolvedComments.filter((comment) => getCommentStatus(comment) === 'open').length,
    editorRef,
    previewRef,
    onMarkdownChange,
    onAddComment,
    onAutoOpenSelectionDraft,
    onCloseInlinePanel: resetCommentUi,
    onFocusComment,
    onEditComment,
    onDeleteComment,
    onToggleResolved,
    onDraftBodyChange: (value: string) =>
      setDraft((currentDraft) => (currentDraft ? { ...currentDraft, body: value } : currentDraft)),
    onDraftCancel: () => setDraft(null),
    onDraftSave,
    onCopyComments: transfers.onCopyComments,
    onOpenComments: () => {
      setDraft(null);
      setActiveCommentId(null);
      setIsCommentsListOpen((currentValue) => !currentValue);
    },
    onOpenImport: transfers.onOpenImport,
    onOpenExport: transfers.onOpenExport,
    onTransferClose: transfers.onTransferClose,
    onTransferModeChange: transfers.onTransferModeChange,
    onExportModeChange: transfers.onExportModeChange,
    onImportValueChange: transfers.onImportValueChange,
    onImportSubmit: transfers.onImportSubmit,
    onCopyMarkdown: transfers.onCopyMarkdown,
    onCopyReview: transfers.onCopyReview,
    onCopyExport: transfers.onCopyExport,
    onSave: transfers.onSave,
    onReset: transfers.onReset,
    onEditorScroll,
    onPreviewScroll,
    onPreviewTextChange: setPreviewText,
  };
};

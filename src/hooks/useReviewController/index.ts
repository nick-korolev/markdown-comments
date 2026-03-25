import { useFlashMessage } from '@/hooks/useFlashMessage';
import type { IUseReviewControllerResult } from '@/hooks/useReviewController/types';
import { useReviewDocumentPersistence } from '@/hooks/useReviewDocumentPersistence';
import { useReviewShortcuts } from '@/hooks/useReviewShortcuts';
import { useScrollSync } from '@/hooks/useScrollSync';
import {
  createAnchorFromEditorSelection,
  createAnchorFromPreviewSelection,
  createRangeFromAnchor,
  hasSelectionOverlap,
  resolveComments,
} from '@/shared/review/anchors';
import { updateReviewDocument } from '@/shared/review/document';
import {
  focusCommentInPreview,
  focusSelectionInEditor,
  getCommentHighlightRect,
  getCurrentSelectionRect,
  getPanelPosition,
  getPreviewSelectionRange,
  getTextareaSelectionRect,
} from '@/shared/review/dom';
import { buildCommentsOnlyExport, buildMarkdownWithReviewExport } from '@/shared/review/export';
import { createCommentId } from '@/shared/review/id';
import type {
  TComment,
  TCommentAnchor,
  TCommentDraft,
  TPanelPosition,
  TReviewDocument,
} from '@/shared/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const findCommentById = (comments: TComment[], commentId: string) =>
  comments.find((comment) => comment.id === commentId) ?? null;

const findCommentBySourceOffset = (comments: TComment[], offset: number) =>
  comments.find((comment) => {
    if (
      comment.anchor.isDetached ||
      comment.anchor.sourceStart === null ||
      comment.anchor.sourceEnd === null
    ) {
      return false;
    }

    return offset >= comment.anchor.sourceStart && offset <= comment.anchor.sourceEnd;
  }) ?? null;

const getPopoverPosition = (rect: DOMRect | null) => (rect ? getPanelPosition(rect) : null);

export const useReviewController = (): IUseReviewControllerResult => {
  const { reviewDocument, setReviewDocument, saveNow } = useReviewDocumentPersistence();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TCommentDraft | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<TPanelPosition | null>(null);
  const [previewText, setPreviewText] = useState('');
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { flashMessage, showFlashMessage } = useFlashMessage();
  const { onEditorScroll, onPreviewScroll } = useScrollSync({ editorRef, previewRef });
  const comments = useMemo(
    () => resolveComments(reviewDocument.markdown, reviewDocument.comments),
    [reviewDocument.comments, reviewDocument.markdown],
  );
  const activeComment = useMemo(
    () => (activeCommentId ? findCommentById(comments, activeCommentId) : null),
    [activeCommentId, comments],
  );

  const updateDocument = useCallback(
    (updater: (currentDocument: TReviewDocument) => TReviewDocument) => {
      setReviewDocument((currentDocument) => updater(currentDocument));
    },
    [setReviewDocument],
  );

  const openDraftFromAnchor = useCallback(
    (anchor: TCommentAnchor | null, position: TPanelPosition | null, showErrors: boolean) => {
      if (!anchor) {
        if (showErrors) {
          showFlashMessage('The current selection does not produce a stable anchor.', 'error');
        }

        return;
      }

      const nextRange = createRangeFromAnchor(anchor);

      if (nextRange && hasSelectionOverlap(nextRange, comments)) {
        if (showErrors) {
          showFlashMessage('Comments cannot overlap existing annotations.', 'error');
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
      setPopoverPosition(position);
    },
    [comments, showFlashMessage],
  );

  const copyValue = useCallback(
    async (value: string, label: string) => {
      try {
        await navigator.clipboard.writeText(value);
        showFlashMessage(`${label} copied.`, 'success');
      } catch {
        showFlashMessage(`Unable to copy ${label.toLowerCase()}.`, 'error');
      }
    },
    [showFlashMessage],
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
    const editorElement = editorRef.current;

    if (!editorElement || editorElement.selectionEnd <= editorElement.selectionStart) {
      showFlashMessage('Select text in the editor first.', 'error');
      return;
    }

    openDraftFromAnchor(
      createAnchorFromEditorSelection(
        reviewDocument.markdown,
        editorElement.selectionStart,
        editorElement.selectionEnd,
      ),
      getPopoverPosition(
        getTextareaSelectionRect(editorElement) ?? editorElement.getBoundingClientRect(),
      ),
      true,
    );
  }, [openDraftFromAnchor, reviewDocument.markdown, showFlashMessage]);

  const onEditorSelectionCapture = useCallback(() => {
    window.requestAnimationFrame(() => {
      const editorElement = editorRef.current;

      if (!editorElement) {
        return;
      }

      if (editorElement.selectionEnd > editorElement.selectionStart) {
        const rect =
          getTextareaSelectionRect(editorElement) ?? editorElement.getBoundingClientRect();

        openDraftFromAnchor(
          createAnchorFromEditorSelection(
            reviewDocument.markdown,
            editorElement.selectionStart,
            editorElement.selectionEnd,
          ),
          getPopoverPosition(rect),
          false,
        );
        return;
      }

      const comment = findCommentBySourceOffset(comments, editorElement.selectionStart);

      if (comment) {
        setDraft(null);
        setActiveCommentId(comment.id);
        setPopoverPosition(null);
      }
    });
  }, [comments, openDraftFromAnchor, reviewDocument.markdown]);

  const onPreviewSelectionCapture = useCallback(() => {
    window.requestAnimationFrame(() => {
      const previewElement = previewRef.current;

      if (!previewElement) {
        return;
      }

      const selectionRange = getPreviewSelectionRange(previewElement);

      if (!selectionRange) {
        return;
      }

      const rect = getCurrentSelectionRect() ?? previewElement.getBoundingClientRect();

      const anchor = createAnchorFromPreviewSelection(
        reviewDocument.markdown,
        previewText || previewElement.textContent || '',
        selectionRange.start,
        selectionRange.end,
      );

      openDraftFromAnchor(anchor, getPopoverPosition(rect), false);
    });
  }, [openDraftFromAnchor, previewText, reviewDocument.markdown]);

  const onFocusComment = useCallback(
    (commentId: string) => {
      const comment = findCommentById(comments, commentId);

      if (!comment) {
        return;
      }

      setDraft(null);
      setActiveCommentId(commentId);

      if (editorRef.current) {
        focusSelectionInEditor(
          editorRef.current,
          comment.anchor.sourceStart,
          comment.anchor.sourceEnd,
        );
      }

      window.requestAnimationFrame(() => {
        if (previewRef.current) {
          focusCommentInPreview(previewRef.current, commentId);

          const rect =
            getCommentHighlightRect(previewRef.current, commentId) ??
            previewRef.current.getBoundingClientRect();

          setPopoverPosition(getPopoverPosition(rect));
        }
      });
    },
    [comments],
  );

  const onDraftSave = useCallback(() => {
    if (!draft) {
      return;
    }

    const body = draft.body.trim();

    if (!body) {
      showFlashMessage('Comment text is required.', 'error');
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
      setDraft(null);
      setActiveCommentId(nextComment.id);
      showFlashMessage('Comment saved.', 'success');
      return;
    }

    if (!draft.commentId) {
      return;
    }

    updateDocument((currentDocument) =>
      updateReviewDocument(currentDocument, {
        comments: resolveComments(currentDocument.markdown, currentDocument.comments).map(
          (comment) =>
            comment.id === draft.commentId ? { ...comment, body, anchor: draft.anchor } : comment,
        ),
      }),
    );
    setDraft(null);
    setActiveCommentId(draft.commentId);
    showFlashMessage('Comment updated.', 'success');
  }, [draft, showFlashMessage, updateDocument]);

  const onEditComment = useCallback(
    (commentId: string) => {
      const comment = findCommentById(comments, commentId);

      if (!comment) {
        return;
      }

      setDraft({
        mode: 'edit',
        commentId: comment.id,
        anchor: comment.anchor,
        body: comment.body,
      });
      setActiveCommentId(comment.id);
    },
    [comments],
  );

  const onDeleteComment = useCallback(
    (commentId: string) => {
      if (!findCommentById(comments, commentId)) {
        return;
      }

      updateDocument((currentDocument) =>
        updateReviewDocument(currentDocument, {
          comments: resolveComments(currentDocument.markdown, currentDocument.comments).filter(
            (comment) => comment.id !== commentId,
          ),
        }),
      );
      setDraft((currentDraft) => (currentDraft?.commentId === commentId ? null : currentDraft));
      setActiveCommentId((currentCommentId) =>
        currentCommentId === commentId ? null : currentCommentId,
      );
      setPopoverPosition(null);
      showFlashMessage('Comment deleted.', 'success');
    },
    [comments, showFlashMessage, updateDocument],
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

  const onSave = useCallback(() => {
    saveNow(reviewDocument);
    showFlashMessage('Saved locally.', 'success');
  }, [reviewDocument, saveNow, showFlashMessage]);

  useReviewShortcuts({ onAddComment, onSave });

  useEffect(() => {
    if (activeCommentId && !findCommentById(comments, activeCommentId)) {
      setActiveCommentId(null);
    }
  }, [activeCommentId, comments]);

  return {
    activeComment,
    activeCommentId,
    comments,
    draft,
    editorRef,
    flashMessage,
    popoverPosition,
    previewRef,
    reviewDocument,
    onCloseComment: () => {
      setDraft(null);
      setActiveCommentId(null);
      setPopoverPosition(null);
    },
    onCopyComments: () => void copyValue(buildCommentsOnlyExport(comments), 'Comments'),
    onCopyReview: () =>
      void copyValue(
        buildMarkdownWithReviewExport(reviewDocument, comments),
        'Markdown with comments',
      ),
    onDeleteComment,
    onDraftBodyChange: (value: string) =>
      setDraft((currentDraft) => (currentDraft ? { ...currentDraft, body: value } : currentDraft)),
    onDraftCancel: () => {
      setDraft(null);
      setActiveCommentId(null);
      setPopoverPosition(null);
    },
    onDraftSave,
    onEditorScroll,
    onEditorSelectionCapture,
    onEditComment,
    onFocusComment,
    onMarkdownChange,
    onPreviewScroll,
    onPreviewSelectionCapture,
    onPreviewTextChange: (value: string) => setPreviewText(value),
    onToggleResolved,
  };
};

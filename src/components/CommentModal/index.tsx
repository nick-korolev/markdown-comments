import type { ICommentModalProps } from '@/components/CommentModal/types';
import { getCommentSnippet, getCommentStatus } from '@/shared/review/comments';
import type { FC } from 'react';

export const CommentModal: FC<ICommentModalProps> = ({
  activeComment,
  comments,
  draft,
  isListOpen,
  onClose,
  onDeleteComment,
  onDraftBodyChange,
  onDraftCancel,
  onDraftSave,
  onEditComment,
  onFocusComment,
  onToggleResolved,
}) => {
  if (!draft && !activeComment && !isListOpen) {
    return null;
  }

  return (
    <div
      className="comment-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <dialog
        open
        className={
          isListOpen && !draft && !activeComment
            ? 'comment-modal comment-modal--list'
            : 'comment-modal'
        }
      >
        <div className="comment-modal__header">
          <div>
            <strong>
              {draft
                ? draft.mode === 'create'
                  ? 'New comment'
                  : 'Edit comment'
                : activeComment
                  ? 'Comment'
                  : 'All comments'}
            </strong>
            <span>
              {draft
                ? getCommentSnippet(draft.anchor.selectedText, 80)
                : activeComment
                  ? getCommentSnippet(activeComment.anchor.selectedText, 80)
                  : `${comments.length} total`}
            </span>
          </div>
          <button type="button" className="toolbar__button" onClick={onClose}>
            Close
          </button>
        </div>

        {draft ? (
          <div className="comment-modal__body">
            <textarea
              className="draft-card__textarea"
              value={draft.body}
              onChange={(event) => onDraftBodyChange(event.target.value)}
              placeholder="Add a focused review note"
            />
            <div className="draft-card__actions">
              <button
                type="button"
                className="toolbar__button toolbar__button--primary"
                onClick={onDraftSave}
              >
                Save
              </button>
              <button type="button" className="toolbar__button" onClick={onDraftCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : activeComment ? (
          <div className="comment-modal__body">
            <div className="comment-card__meta">
              <span className={`status-pill status-pill--${getCommentStatus(activeComment)}`}>
                {getCommentStatus(activeComment)}
              </span>
              <span>{new Date(activeComment.createdAt).toLocaleString()}</span>
            </div>
            <p className="comment-modal__text">{activeComment.body}</p>
            <div className="draft-card__actions">
              <button
                type="button"
                className="toolbar__button"
                onClick={() => onEditComment(activeComment.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="toolbar__button"
                onClick={() => onToggleResolved(activeComment.id)}
              >
                {activeComment.resolved ? 'Unresolve' : 'Resolve'}
              </button>
              <button
                type="button"
                className="toolbar__button toolbar__button--danger"
                onClick={() => onDeleteComment(activeComment.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="comment-modal__list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <button
                  key={comment.id}
                  type="button"
                  className="comment-modal__list-item"
                  onClick={() => onFocusComment(comment.id)}
                >
                  <span className={`status-pill status-pill--${getCommentStatus(comment)}`}>
                    {getCommentStatus(comment)}
                  </span>
                  <strong>{getCommentSnippet(comment.anchor.selectedText, 68)}</strong>
                  <span>{getCommentSnippet(comment.body, 96)}</span>
                </button>
              ))
            ) : (
              <div className="comment-modal__list-item">
                <strong>No comments yet</strong>
                <span>Select text in the editor or preview to add the first note.</span>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
};

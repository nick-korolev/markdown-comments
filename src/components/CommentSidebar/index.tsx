import type { ICommentSidebarProps } from '@/components/CommentSidebar/types';
import { COMMENT_FILTERS } from '@/shared/constants';
import { filterComments, getCommentSnippet, getCommentStatus } from '@/shared/review/comments';
import type { FC } from 'react';

export const CommentSidebar: FC<ICommentSidebarProps> = ({
  comments,
  activeCommentId,
  filter,
  draft,
  onFilterChange,
  onFocusComment,
  onEditComment,
  onDeleteComment,
  onToggleResolved,
  onDraftBodyChange,
  onDraftCancel,
  onDraftSave,
}) => {
  const filteredComments = filterComments(comments, filter);

  return (
    <aside className="comment-sidebar">
      <div className="comment-sidebar__header">
        <div>
          <h2>Comments</h2>
          <span>{filteredComments.length} visible</span>
        </div>
        <div className="filter-group">
          {COMMENT_FILTERS.map((filterValue) => (
            <button
              key={filterValue}
              type="button"
              className={filterValue === filter ? 'filter-chip filter-chip--active' : 'filter-chip'}
              onClick={() => onFilterChange(filterValue)}
            >
              {filterValue}
            </button>
          ))}
        </div>
      </div>

      {draft ? (
        <section className="draft-card">
          <div className="draft-card__header">
            <strong>{draft.mode === 'create' ? 'New comment' : 'Edit comment'}</strong>
            <span>{getCommentSnippet(draft.anchor.selectedText, 90)}</span>
          </div>
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
              Save comment
            </button>
            <button type="button" className="toolbar__button" onClick={onDraftCancel}>
              Cancel
            </button>
          </div>
        </section>
      ) : (
        <section className="draft-card draft-card--hint">
          <strong>Select text in the editor or preview to add a comment.</strong>
        </section>
      )}

      <div className="comment-list">
        {filteredComments.map((comment) => {
          const status = getCommentStatus(comment);

          return (
            <article
              key={comment.id}
              className={
                activeCommentId === comment.id
                  ? 'comment-card comment-card--active'
                  : 'comment-card'
              }
            >
              <button
                type="button"
                className="comment-card__body"
                onClick={() => onFocusComment(comment.id)}
              >
                <div className="comment-card__meta">
                  <span className={`status-pill status-pill--${status}`}>{status}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <strong>{getCommentSnippet(comment.anchor.selectedText, 90)}</strong>
                <p>{comment.body}</p>
              </button>
              <div className="comment-card__actions">
                <button
                  type="button"
                  className="toolbar__button"
                  onClick={() => onEditComment(comment.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="toolbar__button"
                  onClick={() => onToggleResolved(comment.id)}
                >
                  {comment.resolved ? 'Unresolve' : 'Resolve'}
                </button>
                <button
                  type="button"
                  className="toolbar__button toolbar__button--danger"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
};

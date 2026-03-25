import type { IToolbarProps } from '@/components/Toolbar/types';
import type { FC } from 'react';

const formatSavedAt = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));

export const Toolbar: FC<IToolbarProps> = ({
  onAddComment,
  onCopyComments,
  onNew,
  onOpenComments,
  onOpenImport,
  onOpenExport,
  onCopyMarkdown,
  onCopyReview,
  onSave,
  lastSavedAt,
}) => (
  <header className="toolbar">
    <div className="toolbar__group">
      <button
        type="button"
        className="toolbar__button toolbar__button--primary"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onAddComment}
      >
        Add comment
      </button>
      <button type="button" className="toolbar__button" onClick={onOpenComments}>
        Comments
      </button>
      <button type="button" className="toolbar__button" onClick={onNew}>
        New
      </button>
      <button type="button" className="toolbar__button" onClick={onOpenImport}>
        Import
      </button>
      <button type="button" className="toolbar__button" onClick={onOpenExport}>
        Export
      </button>
      <button type="button" className="toolbar__button" onClick={onCopyMarkdown}>
        Copy markdown
      </button>
      <button type="button" className="toolbar__button" onClick={onCopyComments}>
        Copy comments
      </button>
      <button type="button" className="toolbar__button" onClick={onCopyReview}>
        Copy markdown + comments
      </button>
      <button type="button" className="toolbar__button" onClick={onSave}>
        Save
      </button>
    </div>
    <div className="toolbar__group toolbar__group--status">
      <span>Saved locally {formatSavedAt(lastSavedAt)}</span>
      <span>⌘/Ctrl+S save</span>
      <span>⌘/Ctrl+Shift+C comment</span>
    </div>
  </header>
);

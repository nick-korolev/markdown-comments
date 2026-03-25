import type { ITransferModalProps } from '@/components/TransferModal/types';
import type { TExportMode } from '@/shared/types';
import { useEffect, useRef } from 'react';
import type { ChangeEvent, FC } from 'react';

const EXPORT_LABELS: Record<TExportMode, string> = {
  markdown: 'Markdown only',
  review: 'Markdown + review comments',
  json: 'JSON bundle',
};

export const TransferModal: FC<ITransferModalProps> = ({
  isOpen,
  mode,
  exportMode,
  exportValue,
  importValue,
  importError,
  onClose,
  onModeChange,
  onExportModeChange,
  onImportValueChange,
  onImportSubmit,
  onCopyExport,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImportValueChange(reader.result);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <dialog open className="modal">
        <div className="modal__header">
          <div className="filter-group">
            <button
              type="button"
              className={mode === 'export' ? 'filter-chip filter-chip--active' : 'filter-chip'}
              onClick={() => onModeChange('export')}
            >
              Export
            </button>
            <button
              type="button"
              className={mode === 'import' ? 'filter-chip filter-chip--active' : 'filter-chip'}
              onClick={() => onModeChange('import')}
            >
              Import
            </button>
          </div>
          <button type="button" className="toolbar__button" onClick={onClose}>
            Close
          </button>
        </div>

        {mode === 'export' ? (
          <div className="modal__body">
            <div className="filter-group">
              {(Object.keys(EXPORT_LABELS) as TExportMode[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={
                    value === exportMode ? 'filter-chip filter-chip--active' : 'filter-chip'
                  }
                  onClick={() => onExportModeChange(value)}
                >
                  {EXPORT_LABELS[value]}
                </button>
              ))}
            </div>
            <textarea className="modal__textarea" readOnly value={exportValue} />
            <div className="modal__actions">
              <button
                type="button"
                className="toolbar__button toolbar__button--primary"
                onClick={onCopyExport}
              >
                Copy current export
              </button>
            </div>
          </div>
        ) : (
          <div className="modal__body">
            <div className="modal__actions">
              <button
                type="button"
                className="toolbar__button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose JSON file
              </button>
              <input
                ref={fileInputRef}
                className="visually-hidden"
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
              />
            </div>
            <textarea
              className="modal__textarea"
              value={importValue}
              onChange={(event) => onImportValueChange(event.target.value)}
              placeholder="Paste a JSON bundle here"
            />
            {importError ? <p className="modal__error">{importError}</p> : null}
            <div className="modal__actions">
              <button
                type="button"
                className="toolbar__button toolbar__button--primary"
                onClick={onImportSubmit}
              >
                Import session
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

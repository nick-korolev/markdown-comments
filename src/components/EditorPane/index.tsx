import type { IEditorPaneProps } from '@/components/EditorPane/types';
import type { FC } from 'react';

export const EditorPane: FC<IEditorPaneProps> = ({
  markdown,
  textareaRef,
  onChange,
  onScroll,
  onSelectionCapture,
}) => (
  <section className="pane">
    <div className="pane__header">
      <h2>Markdown</h2>
      <span>Raw input</span>
    </div>
    <textarea
      ref={textareaRef}
      className="editor-textarea"
      spellCheck={false}
      value={markdown}
      onChange={(event) => onChange(event.target.value)}
      onMouseUp={onSelectionCapture}
      onScroll={onScroll}
      placeholder="Paste markdown here"
    />
  </section>
);

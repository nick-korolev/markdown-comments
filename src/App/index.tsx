import { CommentModal } from '@/components/CommentModal';
import { EditorPane } from '@/components/EditorPane';
import { PreviewPane } from '@/components/PreviewPane';
import { Toolbar } from '@/components/Toolbar';
import { TransferModal } from '@/components/TransferModal';
import { useReviewController } from '@/hooks/useReviewController';
import type { FC } from 'react';

export const App: FC = () => {
  const controller = useReviewController();

  return (
    <div className="app-shell">
      <Toolbar
        onAddComment={controller.onAddComment}
        onCopyComments={controller.onCopyComments}
        onNew={controller.onReset}
        onOpenComments={controller.onOpenComments}
        onOpenImport={controller.onOpenImport}
        onOpenExport={controller.onOpenExport}
        onCopyMarkdown={controller.onCopyMarkdown}
        onCopyReview={controller.onCopyReview}
        onSave={controller.onSave}
        lastSavedAt={controller.lastSavedAt}
      />

      {controller.flashMessage ? (
        <div className={`flash-message flash-message--${controller.flashMessage.tone}`}>
          {controller.flashMessage.value}
        </div>
      ) : null}

      <main className="workspace-grid">
        <EditorPane
          markdown={controller.reviewDocument.markdown}
          textareaRef={controller.editorRef}
          onChange={controller.onMarkdownChange}
          onScroll={controller.onEditorScroll}
          onSelectionCapture={controller.onAutoOpenSelectionDraft}
        />
        <PreviewPane
          html={controller.previewHtml}
          comments={controller.previewComments}
          activeCommentId={controller.activeCommentId}
          previewRef={controller.previewRef}
          onCommentFocus={controller.onFocusComment}
          onScroll={controller.onPreviewScroll}
          onSelectionCapture={controller.onAutoOpenSelectionDraft}
          onTextContentChange={controller.onPreviewTextChange}
        />
      </main>

      <CommentModal
        activeComment={controller.activeComment}
        comments={controller.previewComments}
        draft={controller.draft}
        isListOpen={controller.isCommentsListOpen}
        onClose={controller.onCloseInlinePanel}
        onDeleteComment={controller.onDeleteComment}
        onDraftBodyChange={controller.onDraftBodyChange}
        onDraftCancel={controller.onDraftCancel}
        onDraftSave={controller.onDraftSave}
        onEditComment={controller.onEditComment}
        onFocusComment={controller.onFocusComment}
        onToggleResolved={controller.onToggleResolved}
      />

      <TransferModal
        isOpen={controller.isTransferOpen}
        mode={controller.transferMode}
        exportMode={controller.exportMode}
        exportValue={controller.exportValue}
        importValue={controller.importValue}
        importError={controller.importError}
        onClose={controller.onTransferClose}
        onModeChange={controller.onTransferModeChange}
        onExportModeChange={controller.onExportModeChange}
        onImportValueChange={controller.onImportValueChange}
        onImportSubmit={controller.onImportSubmit}
        onCopyExport={controller.onCopyExport}
      />
    </div>
  );
};

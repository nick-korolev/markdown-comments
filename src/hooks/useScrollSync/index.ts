import type { IUseScrollSyncParams, IUseScrollSyncResult } from '@/hooks/useScrollSync/types';
import { syncScrollPosition } from '@/shared/review/dom';
import { useCallback, useRef } from 'react';

export const useScrollSync = ({
  editorRef,
  previewRef,
}: IUseScrollSyncParams): IUseScrollSyncResult => {
  const isSyncingScrollRef = useRef(false);

  const onEditorScroll = useCallback(() => {
    if (isSyncingScrollRef.current || !editorRef.current || !previewRef.current) {
      return;
    }

    isSyncingScrollRef.current = true;
    syncScrollPosition(editorRef.current, previewRef.current);
    window.requestAnimationFrame(() => {
      isSyncingScrollRef.current = false;
    });
  }, [editorRef, previewRef]);

  const onPreviewScroll = useCallback(() => {
    if (isSyncingScrollRef.current || !editorRef.current || !previewRef.current) {
      return;
    }

    isSyncingScrollRef.current = true;
    syncScrollPosition(previewRef.current, editorRef.current);
    window.requestAnimationFrame(() => {
      isSyncingScrollRef.current = false;
    });
  }, [editorRef, previewRef]);

  return {
    onEditorScroll,
    onPreviewScroll,
  };
};

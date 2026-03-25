import type { IUseReviewShortcutsParams } from '@/hooks/useReviewShortcuts/types';
import { useEffect } from 'react';

export const useReviewShortcuts = ({ onAddComment, onSave }: IUseReviewShortcutsParams) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (!isModifierPressed) {
        return;
      }

      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        onSave();
      }

      if (event.key.toLowerCase() === 'c' && event.shiftKey) {
        event.preventDefault();
        onAddComment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAddComment, onSave]);
};

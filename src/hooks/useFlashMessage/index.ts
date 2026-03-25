import type { IFlashMessage } from '@/App/types';
import type { IUseFlashMessageResult } from '@/hooks/useFlashMessage/types';
import { useCallback, useEffect, useRef, useState } from 'react';

const FLASH_TIMEOUT_MS = 2200;

export const useFlashMessage = (): IUseFlashMessageResult => {
  const [flashMessage, setFlashMessage] = useState<IFlashMessage | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const onCloseFlashMessage = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setFlashMessage(null);
  }, []);

  const showFlashMessage = useCallback((value: string, tone: IFlashMessage['tone']) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setFlashMessage({
      tone,
      value,
    });
    timeoutRef.current = window.setTimeout(() => setFlashMessage(null), FLASH_TIMEOUT_MS);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return {
    flashMessage,
    onCloseFlashMessage,
    showFlashMessage,
  };
};

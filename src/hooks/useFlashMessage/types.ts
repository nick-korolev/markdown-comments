import type { IFlashMessage } from '@/App/types';

export interface IUseFlashMessageResult {
  flashMessage: IFlashMessage | null;
  onCloseFlashMessage: () => void;
  showFlashMessage: (value: string, tone: IFlashMessage['tone']) => void;
}

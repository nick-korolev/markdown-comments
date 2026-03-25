import type { IFlashMessage } from '@/App/types';

export interface IUseFlashMessageResult {
  flashMessage: IFlashMessage | null;
  showFlashMessage: (value: string, tone: IFlashMessage['tone']) => void;
}

import type { TExportMode, TTransferMode } from '@/shared/types';

export interface ITransferModalProps {
  isOpen: boolean;
  mode: TTransferMode;
  exportMode: TExportMode;
  exportValue: string;
  importValue: string;
  importError: string;
  onClose: () => void;
  onModeChange: (value: TTransferMode) => void;
  onExportModeChange: (value: TExportMode) => void;
  onImportValueChange: (value: string) => void;
  onImportSubmit: () => void;
  onCopyExport: () => void;
}

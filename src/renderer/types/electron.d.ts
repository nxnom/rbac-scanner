interface FileDialogResult {
  canceled: boolean;
  filePath?: string;
  content?: string;
}

interface ElectronAPI {
  openFileDialog: () => Promise<FileDialogResult>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};

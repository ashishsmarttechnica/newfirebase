
export interface UploadedFile {
  id: string;
  file: File;
  originalName: string;
  // newName?: string; // Feature removed
  size: number;
  type: string; // MIME Type
  previewUrl?: string; // For image previews
  // contentSummaryForAI?: string; // Feature removed
  // isRenaming?: boolean; // Feature removed
  // isShared?: boolean; // Feature removed
  // shareUrl?: string; // Feature removed
}

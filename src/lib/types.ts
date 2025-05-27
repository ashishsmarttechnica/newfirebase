export interface UploadedFile {
  id: string;
  file: File;
  originalName: string;
  newName?: string;
  size: number;
  type: string; // MIME Type
  previewUrl?: string; // For image previews
  contentSummaryForAI?: string; // Content summary prepared for AI
  isRenaming?: boolean;
  isShared?: boolean; // Placeholder for share status
  shareUrl?: string; // Placeholder for share URL
}

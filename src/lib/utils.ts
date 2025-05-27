import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getFileContentSummary(file: File, maxLength: number = 300): Promise<string> {
  if (file.type.startsWith('text/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text.slice(0, maxLength) + (text.length > maxLength ? '...' : ''));
      };
      reader.onerror = () => reject('Error reading file content.');
      // Read a bit more than maxLength to ensure meaningful truncation if needed
      reader.readAsText(file.slice(0, maxLength + 100)); 
    });
  }
  // For non-text files, provide a generic summary or use filename
  return Promise.resolve(`This is a ${getDescriptiveFileType(file.type)} named "${file.name}". A content summary is not available for this file type.`);
}

export function getDescriptiveFileType(mimeType: string): string {
  if (!mimeType) return 'File';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('text/')) return 'Text Document';
  if (mimeType === 'application/pdf') return 'PDF Document';
  if (mimeType.startsWith('video/')) return 'Video File';
  if (mimeType.startsWith('audio/')) return 'Audio File';
  if (['application/zip', 'application/x-zip-compressed', 'application/rar', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip'].includes(mimeType)) return 'Archive File';
  if (mimeType.startsWith('application/vnd.openxmlformats-officedocument')) return 'Office Document'; // docx, pptx, xlsx
  if (mimeType.startsWith('application/msword') || mimeType.startsWith('application/vnd.ms-excel') || mimeType.startsWith('application/vnd.ms-powerpoint')) return 'Office Document'; // doc, xls, ppt
  return 'File';
}

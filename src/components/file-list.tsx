
'use client';

import type { UploadedFile } from '@/lib/types';
import { FileItem } from '@/components/file-item';

interface FileListProps {
  files: UploadedFile[];
  // onSmartRename: (fileId: string) => Promise<void>; // Smart rename feature removed
  onRemoveFile: (fileId: string) => void;
}

export function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        <p>No files uploaded yet. Drag and drop files above or click browse.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map((file) => (
        <FileItem
          key={file.id}
          uploadedFile={file}
          // onSmartRename={onSmartRename} // Prop removed
          onRemoveFile={onRemoveFile}
        />
      ))}
    </div>
  );
}

'use client';

import type { DragEvent} from 'react';
import { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadedFile } from '@/lib/types'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // For the hidden file input

interface FileDropzoneProps {
  onFilesAdded: (files: UploadedFile[]) => void;
  className?: string;
}

export function FileDropzone({ onFilesAdded, className }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // You can add more visual cues here if needed
  };

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files && files.length > 0) {
        const newUploadedFiles: UploadedFile[] = files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          originalName: file.name,
          size: file.size,
          type: file.type,
          isRenaming: false,
        }));
        onFilesAdded(newUploadedFiles);
      }
    },
    [onFilesAdded]
  );
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files && files.length > 0) {
      const newUploadedFiles: UploadedFile[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        originalName: file.name,
        size: file.size,
        type: file.type,
        isRenaming: false,
      }));
      onFilesAdded(newUploadedFiles);
    }
    // Reset file input to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };


  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 text-center transition-colors duration-200 ease-in-out hover:border-primary',
        isDragging ? 'border-primary bg-accent/20' : '',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="File drop zone"
    >
      <UploadCloud className={cn('mb-4 h-16 w-16', isDragging ? 'text-primary' : 'text-muted-foreground')} />
      <p className="mb-2 text-lg font-semibold text-foreground">
        Drag & Drop files here
      </p>
      <p className="mb-4 text-sm text-muted-foreground">
        or click to browse
      </p>
      <Input
        type="file"
        multiple
        className="hidden"
        id="file-input-browse"
        onChange={handleFileInputChange}
      />
      <Button variant="outline" onClick={() => document.getElementById('file-input-browse')?.click()}>
        Browse Files
      </Button>
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary/10" />
      )}
    </div>
  );
}

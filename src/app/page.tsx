
'use client';

import type { UploadedFile } from '@/lib/types';
import { useState } from 'react';
import { Header } from '@/components/header';
import { FileDropzone } from '@/components/file-dropzone';
import { FileList } from '@/components/file-list';
import { Button } from '@/components/ui/button';
// import { getFileContentSummary, getDescriptiveFileType } from '@/lib/utils'; // Not needed for smart rename anymore
import { useToast } from '@/hooks/use-toast';
// import type { SmartRenameOutput } from '@/ai/flows/smart-rename'; // Smart rename removed

export default function HomePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const handleFilesAdded = async (newFiles: UploadedFile[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    toast({
      title: `${newFiles.length} file(s) added!`,
      description: "Files are added to the local list.",
    });

    // Server upload logic removed
  };

  // Smart Rename functionality removed
  // const handleSmartRename = async (fileId: string) => { ... }

  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id === fileId));
    toast({
      title: 'File Removed',
      description: 'The file has been removed from this list.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section aria-labelledby="file-upload-section">
          <h2 id="file-upload-section" className="sr-only">File Upload</h2>
          <FileDropzone onFilesAdded={handleFilesAdded} className="mb-8" />
        </section>

        {files.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Button variant="destructive" onClick={() => setFiles([])}>Clear All Files</Button>
          </div>
        )}

        <section aria-labelledby="uploaded-files-section">
          <h2 id="uploaded-files-section" className="sr-only">Uploaded Files</h2>
          <FileList files={files} onRemoveFile={handleRemoveFile} />
        </section>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FileDrop. All rights reserved.
      </footer>
    </div>
  );
}

'use client';

import type { UploadedFile } from '@/lib/types';
import { useState } from 'react';
import { Header } from '@/components/header';
import { FileDropzone } from '@/components/file-dropzone';
import { FileList } from '@/components/file-list';
import { Button } from '@/components/ui/button';
import { getFileContentSummary, getDescriptiveFileType } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { SmartRenameOutput } from '@/ai/flows/smart-rename';

export default function HomePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    toast({
      title: `${newFiles.length} file(s) added!`,
      description: "Ready for renaming or sharing.",
    });
  };

  const handleSmartRename = async (fileId: string) => {
    const fileIndex = files.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return;

    const targetFile = files[fileIndex];

    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === fileId ? { ...f, isRenaming: true } : f))
    );

    try {
      const contentSummary = await getFileContentSummary(targetFile.file);
      const descriptiveFileType = getDescriptiveFileType(targetFile.type);
      
      setFiles(prev => prev.map(f => f.id === fileId ? {...f, contentSummaryForAI: contentSummary} : f));

      const response = await fetch('/api/smart-rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: targetFile.originalName,
          fileType: descriptiveFileType,
          fileContentSummary: contentSummary,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to rename file');
      }

      const result = await response.json() as SmartRenameOutput;

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileId ? { ...f, newName: result.newFileName, isRenaming: false } : f
        )
      );
      toast({
        title: 'File Renamed!',
        description: `"${targetFile.originalName}" renamed to "${result.newFileName}".`,
      });
    } catch (error) {
      console.error('Smart rename failed:', error);
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === fileId ? { ...f, isRenaming: false } : f))
      );
      toast({
        variant: 'destructive',
        title: 'Rename Failed',
        description: error instanceof Error ? error.message : 'Could not rename file.',
      });
    }
  };
  
  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
    toast({
      title: 'File Removed',
      description: 'The file has been removed from the list.',
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
          <FileList files={files} onSmartRename={handleSmartRename} onRemoveFile={handleRemoveFile} />
        </section>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} FileDrop. All rights reserved.
      </footer>
    </div>
  );
}

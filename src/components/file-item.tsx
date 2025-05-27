
'use client';

import type { UploadedFile } from '@/lib/types';
import { formatBytes, getDescriptiveFileType } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast'; // Toast for copy not needed anymore
import {
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  Archive,
  File as FileIconGeneric,
  // Share2, // Share feature removed
  // Wand2, // Smart rename feature removed
  // Copy, // Copy for share link removed
  // Loader2, // Loader for smart rename removed
  Trash2,
} from 'lucide-react';
import Image from 'next/image'; // For image previews
import { useEffect, useState } from 'react';

interface FileItemProps {
  uploadedFile: UploadedFile;
  // onSmartRename: (fileId: string) => Promise<void>; // Smart rename feature removed
  onRemoveFile: (fileId: string) => void;
}

const FileTypeIcon = ({ mimeType, className }: { mimeType: string; className?: string }) => {
  const baseClassName = className || "h-8 w-8 text-primary";
  if (mimeType.startsWith('image/')) return <ImageIcon className={baseClassName} />;
  if (mimeType.startsWith('text/')) return <FileText className={baseClassName} />;
  if (mimeType.startsWith('video/')) return <FileVideo className={baseClassName} />;
  if (mimeType.startsWith('audio/')) return <FileAudio className={baseClassName} />;
  if (['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar'].includes(mimeType)) return <Archive className={baseClassName} />;
  return <FileIconGeneric className={baseClassName} />;
};

export function FileItem({ uploadedFile, onRemoveFile }: FileItemProps) {
  // const { toast } = useToast(); // Not needed
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(uploadedFile.previewUrl);

  useEffect(() => {
    if (uploadedFile.file.type.startsWith('image/') && !previewUrl) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile.file);
    }
    // Clean up object URL if it was created
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [uploadedFile.file, previewUrl]);

  // Share functionality removed
  // const handleShare = () => { ... };

  const descriptiveFileType = getDescriptiveFileType(uploadedFile.type);
  const displayName = uploadedFile.originalName; // newName feature removed

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 bg-secondary/30">
        <FileTypeIcon mimeType={uploadedFile.type} className="h-10 w-10 text-accent flex-shrink-0 mt-1" />
        <div className="flex-grow min-w-0">
          <CardTitle className="text-lg leading-tight truncate" title={displayName}>
            {displayName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{descriptiveFileType}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {previewUrl && uploadedFile.type.startsWith('image/') && (
          <div className="mb-3 aspect-video w-full overflow-hidden rounded-md border bg-muted flex items-center justify-center">
            <Image
              src={previewUrl}
              alt={`Preview of ${uploadedFile.originalName}`}
              width={300}
              height={200}
              className="object-contain max-h-full max-w-full"
              data-ai-hint="file preview"
            />
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Size: {formatBytes(uploadedFile.size)}
        </div>
        {/* Content summary for AI removed */}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t">
        {/* Smart Rename Button Removed */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          {/* Share Button Removed */}
          <Button variant="ghost" size="icon" onClick={() => onRemoveFile(uploadedFile.id)} aria-label="Remove File" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

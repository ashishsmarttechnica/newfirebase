'use client';

import type { UploadedFile } from '@/lib/types';
import { formatBytes, getDescriptiveFileType } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  Archive,
  File as FileIconGeneric,
  Share2,
  Wand2,
  Copy,
  Loader2,
  Trash2,
} from 'lucide-react';
import Image from 'next/image'; // For image previews
import { useEffect, useState } from 'react';

interface FileItemProps {
  uploadedFile: UploadedFile;
  onSmartRename: (fileId: string) => Promise<void>;
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

export function FileItem({ uploadedFile, onSmartRename, onRemoveFile }: FileItemProps) {
  const { toast } = useToast();
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


  const handleShare = () => {
    // Placeholder: Generate a dummy share URL
    const dummyUrl = `${window.location.origin}/share/${uploadedFile.id}/${uploadedFile.newName || uploadedFile.originalName}`;
    navigator.clipboard.writeText(dummyUrl)
      .then(() => {
        toast({
          title: 'Link Copied!',
          description: 'Shareable link copied to clipboard.',
          action: <Copy className="h-4 w-4" />,
        });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Copy Failed',
          description: 'Could not copy link to clipboard.',
        });
      });
  };

  const descriptiveFileType = getDescriptiveFileType(uploadedFile.type);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 bg-secondary/30">
        <FileTypeIcon mimeType={uploadedFile.type} className="h-10 w-10 text-accent flex-shrink-0 mt-1" />
        <div className="flex-grow min-w-0">
          <CardTitle className="text-lg leading-tight truncate" title={uploadedFile.newName || uploadedFile.originalName}>
            {uploadedFile.newName || uploadedFile.originalName}
          </CardTitle>
          {uploadedFile.newName && uploadedFile.newName !== uploadedFile.originalName && (
            <p className="text-xs text-muted-foreground truncate" title={uploadedFile.originalName}>
              Original: {uploadedFile.originalName}
            </p>
          )}
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
        {uploadedFile.contentSummaryForAI && (
          <p className="mt-1 text-xs text-muted-foreground/80 italic truncate" title={uploadedFile.contentSummaryForAI}>
            Summary hint: {uploadedFile.contentSummaryForAI.substring(0, 50)}{uploadedFile.contentSummaryForAI.length > 50 ? '...' : ''}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-4 border-t">
        <Button
            variant="outline"
            size="sm"
            onClick={() => onSmartRename(uploadedFile.id)}
            disabled={uploadedFile.isRenaming}
            aria-label="Smart Rename File"
            className="w-full sm:w-auto"
          >
            {uploadedFile.isRenaming ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Smart Rename
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Share File" className="flex-1 sm:flex-initial">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onRemoveFile(uploadedFile.id)} aria-label="Remove File" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

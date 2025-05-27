
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Home, Loader2, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SharePage() {
  const params = useParams();
  const { toast } = useToast();
  const [fileId, setFileId] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params) {
      const idFromParams = Array.isArray(params.id) ? params.id[0] : params.id;
      const filenameFromParams = Array.isArray(params.filename) ? params.filename[0] : params.filename;
      
      setFileId(idFromParams);
      // Filenames from URL are URI encoded, decode them for display
      setFileName(filenameFromParams ? decodeURIComponent(filenameFromParams) : undefined);
      setError(null); // Reset error on params change
    }
  }, [params]);

  const handleDownload = async () => {
    if (!fileId || !fileName) {
      toast({
        variant: 'destructive',
        title: 'Download Error',
        description: 'File ID or name is missing.',
      });
      return;
    }
    setIsDownloading(true);
    setError(null);
    try {
      const response = await fetch(`/api/files/${fileId}`);
      if (!response.ok) {
        let errorMsg = `Failed to download file. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (e) {
            // If parsing JSON fails, use the status text or default message
            errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Use removeChild for broader compatibility
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Download Started',
        description: `"${fileName}" is downloading.`,
      });
    } catch (err) {
      console.error('Download failed:', err);
      const message = err instanceof Error ? err.message : 'Could not download file.';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: message,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg shadow-xl rounded-lg">
          <CardHeader className="bg-muted/50 p-6 rounded-t-lg">
            <CardTitle className="text-2xl text-center text-foreground">
              File Share
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground pt-1">
              You've received a link to a shared file.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {fileName && fileId ? (
              <>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">File Name:</h3>
                  <p className="text-muted-foreground truncate rounded-md bg-secondary/50 p-3" title={fileName}>
                    {fileName}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">File ID:</h3>
                  <p className="text-muted-foreground truncate rounded-md bg-secondary/50 p-3" title={fileId}>
                    {fileId}
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5"/>
                    <p>{error}</p>
                  </div>
                )}

                <div className="pt-4 text-center">
                  <Button 
                    onClick={handleDownload} 
                    disabled={isDownloading || !fileId || !fileName} 
                    className="w-full" 
                    aria-label={`Download ${fileName || 'File'}`}
                  >
                    {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isDownloading ? 'Downloading...' : `Download File`}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 px-2">
                    {isDownloading ? 'Please wait...' : 'Click the button above to download the file.'}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1 px-2">
                    Note: Files are stored temporarily in server memory for this prototype and may not persist long.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-destructive">
                File information could not be loaded from the link.
              </p>
            )}
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/" aria-label="Go back to Homepage">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} FileDrop. All rights reserved.
      </footer>
    </div>
  );
}

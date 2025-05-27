
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Home } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SharePage() {
  const params = useParams();
  const [fileId, setFileId] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (params) {
      const idFromParams = Array.isArray(params.id) ? params.id[0] : params.id;
      const filenameFromParams = Array.isArray(params.filename) ? params.filename[0] : params.filename;
      
      setFileId(idFromParams);
      // Filenames from URL are URI encoded, decode them for display
      setFileName(filenameFromParams ? decodeURIComponent(filenameFromParams) : undefined);
    }
  }, [params]);

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
                <div className="pt-4 text-center">
                  <Button disabled className="w-full" aria-label="Download File (Not Implemented)">
                    <Download className="mr-2 h-4 w-4" />
                    Download File (Not Implemented)
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 px-2">
                    Actual file downloading requires backend storage, which is not part of this prototype.
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

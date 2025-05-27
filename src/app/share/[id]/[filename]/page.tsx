
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
// import { useParams } from 'next/navigation'; // Not needed anymore
// import { useEffect, useState } from 'react'; // Not needed anymore
// import { useToast } from '@/hooks/use-toast'; // Not needed anymore

export default function SharePage() {
  // const params = useParams();
  // const { toast } = useToast();
  // const [fileId, setFileId] = useState<string | undefined>(undefined);
  // const [fileName, setFileName] = useState<string | undefined>(undefined);
  // const [isDownloading, setIsDownloading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (params) {
  //     const idFromParams = Array.isArray(params.id) ? params.id[0] : params.id;
  //     const filenameFromParams = Array.isArray(params.filename) ? params.filename[0] : params.filename;
  //     setFileId(idFromParams);
  //     setFileName(filenameFromParams ? decodeURIComponent(filenameFromParams) : undefined);
  //   }
  // }, [params]);

  // const handleDownload = async () => { ... }; // Download logic removed

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg shadow-xl rounded-lg">
          <CardHeader className="bg-muted/50 p-6 rounded-t-lg">
            <CardTitle className="text-2xl text-center text-foreground">
              File Sharing Not Available
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground pt-1">
              The file sharing functionality has been temporarily removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md flex items-center gap-2">
              <AlertTriangle className="h-5 w-5"/>
              <p>This feature is currently not active in the application.</p>
            </div>
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

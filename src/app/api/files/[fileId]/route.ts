
import { type NextRequest, NextResponse } from 'next/server';
import { getFileFromStore } from '@/lib/file-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const storedFile = await getFileFromStore(fileId);

    if (!storedFile) {
      return NextResponse.json({ error: 'File not found or may have been cleared from server memory.' }, { status: 404 });
    }

    const headers = new Headers();
    // Ensure the filename is properly encoded for the Content-Disposition header
    const encodedFilename = encodeURIComponent(storedFile.fileName).replace(/'/g, "%27");
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`);
    headers.set('Content-Type', storedFile.mimeType);
    headers.set('Content-Length', storedFile.size.toString());

    return new NextResponse(storedFile.data, { headers });

  } catch (error) {
    console.error('Error in file download API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to download file.', details: errorMessage }, { status: 500 });
  }
}

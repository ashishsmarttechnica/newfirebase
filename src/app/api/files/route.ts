
import { type NextRequest, NextResponse } from 'next/server';
import { addFileToStore } from '@/lib/file-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileId = formData.get('fileId') as string | null;

    if (!file || !fileId) {
      return NextResponse.json({ error: 'Missing file or fileId' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await addFileToStore({
      id: fileId,
      fileName: file.name,
      mimeType: file.type,
      data: fileBuffer,
      size: file.size,
    });

    return NextResponse.json({ success: true, message: `File ${file.name} stored.` });
  } catch (error) {
    console.error('Error in file upload API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to upload file.', details: errorMessage }, { status: 500 });
  }
}

// This API route for file downloads has been removed as the feature is no longer active.
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  return NextResponse.json({ error: 'File download functionality has been removed.' }, { status: 404 });
}

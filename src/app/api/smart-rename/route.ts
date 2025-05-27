// src/app/api/smart-rename/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { smartRename, type SmartRenameInput } from '@/ai/flows/smart-rename'; // Path to your Genkit flow

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, fileContentSummary } = body as SmartRenameInput;

    if (!fileName || !fileType || !fileContentSummary) {
      return NextResponse.json({ error: 'Missing required fields: fileName, fileType, fileContentSummary' }, { status: 400 });
    }

    const input: SmartRenameInput = {
      fileName,
      fileType,
      fileContentSummary,
    };

    const result = await smartRename(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in smart rename API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to rename file using AI.', details: errorMessage }, { status: 500 });
  }
}

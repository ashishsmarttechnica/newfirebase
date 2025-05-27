
// This API route for smart rename has been removed as the feature is no longer active.
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import { smartRename, type SmartRenameInput } from '@/ai/flows/smart-rename'; // Import removed

import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
 return NextResponse.json({ error: 'Smart rename functionality has been removed.' }, { status: 404 });
}

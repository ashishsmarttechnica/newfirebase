// This API route for file uploads has been removed as the feature is no longer active.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'File upload functionality has been removed.' }, { status: 404 });
}

export async function GET() {
  return NextResponse.json({ error: 'This endpoint is not used for GET requests.' }, { status: 405 });
}

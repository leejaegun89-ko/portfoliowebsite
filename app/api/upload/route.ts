import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueFilename = `${projectId}-${Date.now()}-${file.name}`;
    
    // Save file to public directory
    const path = join(process.cwd(), 'public', 'uploads', uniqueFilename);
    await writeFile(path, buffer);

    // Return the URL for the uploaded file
    return NextResponse.json({ 
      url: `/uploads/${uniqueFilename}` 
    });
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Error uploading file.' },
      { status: 500 }
    );
  }
} 
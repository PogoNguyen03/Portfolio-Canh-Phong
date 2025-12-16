// app/api/upload/route.ts
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'avatar' or 'cv'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (type === 'avatar') {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid image type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 });
      }
    } else if (type === 'cv') {
      const validCvTypes = ['application/pdf'];
      if (!validCvTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid CV type. Only PDF is allowed.' }, { status: 400 });
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = type === 'avatar' 
      ? `avatar-${timestamp}.${extension}`
      : `cv-${timestamp}.${extension}`;
    
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      message: error.message 
    }, { status: 500 });
  }
}


// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // Nếu upload thông qua formData (cách thông thường)
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload lên Vercel Blob
    const blob = await put(filename || file.name, file, {
      access: 'public',
      // addRandomSuffix: false // Bỏ comment nếu muốn ghi đè file cũ trùng tên
    });

    // Trả về URL của ảnh trên mây (https://...)
    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
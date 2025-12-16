// app/api/data/route.ts
import { NextResponse } from 'next/server';
import { readData } from '@/lib/adminActions';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read data', message: error.message },
      { status: 500 }
    );
  }
}


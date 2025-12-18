// app/page.tsx
import React from 'react';
import PortfolioClient from './PortfolioClient';
import { readData } from '@/lib/adminActions';

export default async function Page() {
  // LẤY DỮ LIỆU TỪ BLOB (hoặc fallback JSON) QUA adminActions
  const data = await readData();

  if (!data) {
    return <div className="p-10 text-center">Failed to load data</div>;
  }

  return <PortfolioClient initialData={data} />;
}
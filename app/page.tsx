// app/page.tsx
import React from 'react';
import PortfolioClient from './PortfolioClient';

// --- QUAN TRỌNG: Import dữ liệu trực tiếp thay vì fetch ---
// Giả sử dữ liệu của bạn nằm trong file json này (hãy sửa đường dẫn cho đúng file của bạn)
import portfolioData from '@/data/portfolio.json'; 
// Hoặc nếu bạn dùng fs để đọc file:
// import { promises as fs } from 'fs';
// import path from 'path';

async function getData() {
  // CÁCH 1: Nếu data là file JSON import được -> Dùng luôn, siêu nhanh
  return portfolioData;

  // CÁCH 2: Nếu bạn dùng logic phức tạp (đọc file, DB), hãy viết code đó ở đây
  /*
  const filePath = path.join(process.cwd(), 'data', 'portfolio.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
  */
}

export default async function Page() {
  // Gọi hàm lấy dữ liệu trực tiếp (không qua mạng Internet)
  const data = await getData();

  if (!data) {
    return <div className="p-10 text-center">Failed to load data</div>;
  }

  return <PortfolioClient initialData={data} />;
}
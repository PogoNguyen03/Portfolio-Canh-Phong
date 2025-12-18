// app/page.tsx
import React from 'react';
import PortfolioClient from './PortfolioClient';

// Hàm lấy dữ liệu chạy trên Server (Không lộ ra client)
async function getData() {
  try {
    // Lưu ý: Khi gọi API nội bộ trên server (SSR), bạn cần URL tuyệt đối.
    // Nếu chạy local: http://localhost:3000/api/data
    // Khi deploy (ví dụ Vercel), dùng process.env.URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; 
    
    // fetch với 'no-store' đảm bảo luôn lấy dữ liệu mới nhất (SSR)
    // Nếu muốn nhanh hơn nữa, có thể dùng 'force-cache' (SSG)
    const res = await fetch(`${baseUrl}/api/data`, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return null;
  }
}

export default async function Page() {
  const data = await getData();

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Failed to load portfolio data.
      </div>
    );
  }

  // Truyền dữ liệu đã có sẵn vào Client Component để render ngay lập tức
  return <PortfolioClient initialData={data} />;
}
// app/page.tsx

// Hàm helper để lấy URL chính xác
const getBaseUrl = () => {
  // 1. Nếu đang chạy trên Vercel (Production/Preview)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 2. Nếu bạn đã set biến môi trường custom (ví dụ tên miền riêng)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 3. Mặc định localhost khi chạy dưới máy
  return 'http://localhost:3000';
};

async function getData() {
  try {
    const baseUrl = getBaseUrl();
    console.log("Fetching data from:", baseUrl); // Log để debug trên Vercel

    const res = await fetch(`${baseUrl}/api/data`, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch data status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return null;
  }
}
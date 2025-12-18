import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // Cho phép tất cả ảnh từ Blob
      },
      // Giữ lại các domain khác nếu có
    ],
  },
  // ... các config khác
};

export default nextConfig;
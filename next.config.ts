import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Ưu tiên AVIF, sau đó đến WebP
  },
};

export default nextConfig;
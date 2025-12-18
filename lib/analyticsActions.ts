// lib/analyticsActions.ts
"use server";

// LƯU Ý QUAN TRỌNG:
// - TRÊN VERCEL, KHÔNG ĐƯỢC GHI FILE VÀO /data/*.json (EROFS: read-only file system)
// - FILE analytics.json chỉ dùng làm "seed" ban đầu, toàn bộ ghi/đọc động phải qua Vercel Blob

import { list, put } from '@vercel/blob';
import { headers } from 'next/headers';

const ANALYTICS_BLOB_NAME = 'database/analytics.json';

// Hàm lấy IP người dùng
function getIP(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  return "Unknown"; // Hoặc '127.0.0.1' nếu localhost
}

// Helper: đọc logs từ Blob (nếu không có thì trả mảng rỗng)
async function readAnalyticsFromBlob(): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: ANALYTICS_BLOB_NAME, limit: 1 });
    if (blobs.length === 0) {
      return [];
    }
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error('Analytics read error:', e);
    return [];
  }
}

// Helper: ghi logs lên Blob (KHÔNG ĐỘNG VÀO FILE LOCAL)
async function writeAnalyticsToBlob(logs: any[]): Promise<void> {
  const json = JSON.stringify(logs, null, 2);
  await put(ANALYTICS_BLOB_NAME, json, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

// 1. Ghi nhận lượt truy cập (Gọi ở trang chủ)
export async function trackVisit() {
  try {
    const headersList = await headers();
    const ip = getIP(headersList);
    const userAgent = headersList.get('user-agent') || 'Unknown Device';
    const timestamp = new Date().toISOString();

    // Đọc logs hiện tại từ Blob
    const logs = await readAnalyticsFromBlob();

    // Thêm log mới
    logs.push({ ip, userAgent, timestamp });

    // Ghi lại lên Blob
    await writeAnalyticsToBlob(logs);

    return { success: true };
  } catch (error) {
    console.error("Analytics Error:", error);
    return { success: false };
  }
}

// 2. Lấy dữ liệu thống kê (Gọi ở Admin)
export async function getAnalyticsData() {
  try {
    const logs = await readAnalyticsFromBlob();

    const totalViews = logs.length;
    const uniqueIPs = new Set(logs.map((log: any) => log.ip)).size;
    const recentLogs = logs.slice(-5).reverse();

    return { totalViews, uniqueIPs, recentLogs };
  } catch (error) {
    console.error("Analytics read error:", error);
    return { totalViews: 0, uniqueIPs: 0, recentLogs: [] };
  }
}
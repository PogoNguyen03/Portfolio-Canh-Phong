// lib/analyticsActions.ts
"use server";

import fs from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';

const ANALYTICS_FILE_PATH = path.join(process.cwd(), 'data', 'analytics.json');

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

// 1. Ghi nhận lượt truy cập (Gọi ở trang chủ)
export async function trackVisit() {
  try {
    const headersList = await headers();
    const ip = getIP(headersList);
    const userAgent = headersList.get('user-agent') || 'Unknown Device';
    const timestamp = new Date().toISOString();

    let logs = [];
    try {
      const data = await fs.readFile(ANALYTICS_FILE_PATH, 'utf-8');
      logs = JSON.parse(data);
    } catch (e) {
      logs = [];
    }

    // Thêm log mới
    logs.push({ ip, userAgent, timestamp });

    // Lưu lại
    await fs.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error("Analytics Error:", error);
    return { success: false };
  }
}

// 2. Lấy dữ liệu thống kê (Gọi ở Admin)
export async function getAnalyticsData() {
  try {
    const data = await fs.readFile(ANALYTICS_FILE_PATH, 'utf-8');
    const logs = JSON.parse(data);

    // Tính toán
    const totalViews = logs.length;
    // Đếm số IP duy nhất (Unique Visitors)
    const uniqueIPs = new Set(logs.map((log: any) => log.ip)).size;
    
    // Lấy 5 log gần nhất để hiển thị chi tiết
    const recentLogs = logs.slice(-5).reverse();

    return { totalViews, uniqueIPs, recentLogs };
  } catch (error) {
    return { totalViews: 0, uniqueIPs: 0, recentLogs: [] };
  }
}
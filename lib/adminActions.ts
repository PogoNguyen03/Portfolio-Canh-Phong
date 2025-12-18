// lib/adminActions.ts
"use server";
import { put, list } from '@vercel/blob';
import nodemailer from "nodemailer";

// --- CẤU HÌNH ---
const DB_FILE_NAME = 'database/portfolio.json';
const MSG_FILE_NAME = 'database/messages.json';

// --- HÀM HELPER: ĐỌC DỮ LIỆU ---
export async function readData() {
  // Import dữ liệu mặc định để dùng làm fallback
  const defaultDataImport = await import('@/data/portfolio.json');
  const defaultData = defaultDataImport.default || defaultDataImport;

  try {
    // 1. Tìm file trên Blob
    const { blobs } = await list({ prefix: DB_FILE_NAME, limit: 1 });
    
    // 2. Nếu có file trên Blob -> Tải về
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url, { cache: 'no-store' });
      return await response.json();
    }

    // 3. Nếu chưa có trên Blob -> Trả về mặc định
    return defaultData;

  } catch (error) {
    console.error("Error reading data:", error);
    // QUAN TRỌNG: Trả về dữ liệu mặc định thay vì null để không bị sập web
    return defaultData; 
  }
}

// --- HÀM HELPER: GHI DỮ LIỆU (QUAN TRỌNG: CHỈ GHI LÊN BLOB) ---
export async function writeData(data: any) {
  try {
    // Tuyệt đối KHÔNG dùng fs.writeFileSync ở đây
    const jsonString = JSON.stringify(data, null, 2);
    
    // Ghi thẳng lên Vercel Blob
    const blob = await put(DB_FILE_NAME, jsonString, {
      access: 'public',
      addRandomSuffix: false, // Ghi đè file cũ
      contentType: 'application/json'
    });
    
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error writing to Blob:", error);
    return { success: false, message: "Failed to save to cloud storage" };
  }
}

// --- CÁC ACTION CẬP NHẬT ---

export async function updatePortfolio(section: string, newData: any) {
  try {
    const currentData = await readData();
    if (!currentData) throw new Error("Could not load data");

    if (section === 'personalInfo') currentData.personalInfo = { ...currentData.personalInfo, ...newData };
    else if (section === 'skills') currentData.skills = newData;
    else if (section === 'experiences') currentData.experiences = newData;
    else if (section === 'projects') currentData.projects = newData;

    // Gọi hàm writeData đã sửa ở trên
    await writeData(currentData);
    return { success: true, message: "Update successful!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteListItem(section: string, indexToRemove: number) {
  try {
    const currentData = await readData();
    if (Array.isArray(currentData[section])) {
      currentData[section] = currentData[section].filter((_: any, idx: number) => idx !== indexToRemove);
      await writeData(currentData); // Ghi lên Blob
      return { success: true, message: "Deleted successfully" };
    } 
    return { success: false, message: "Section is not a list" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// --- PHẦN CONTACT MESSAGES ---
// (Giữ nguyên logic dùng Blob cho message nếu bạn đã sửa ở bước trước)
export async function getContactMessages() {
    // ... logic lấy message từ blob
    try {
        const { blobs } = await list({ prefix: MSG_FILE_NAME, limit: 1 });
        if (blobs.length === 0) return [];
        const response = await fetch(blobs[0].url, { cache: 'no-store' });
        return await response.json();
    } catch (error) { return []; }
}

export async function submitContactForm(formData: FormData) {
    // ... logic gửi mail và lưu message vào blob
    // Copy lại logic submitContactForm từ câu trả lời trước của mình
    return { success: true, message: "Sent!" }; 
}
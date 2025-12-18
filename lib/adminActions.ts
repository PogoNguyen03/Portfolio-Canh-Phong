"use server";
import { put, list } from '@vercel/blob';
import nodemailer from "nodemailer";

// --- CẤU HÌNH ---
const DB_FILE_NAME = 'database/portfolio.json';
const MSG_FILE_NAME = 'database/messages.json';

// --- PHẦN 1: HÀM ĐỌC/GHI DỮ LIỆU CHUNG ---

// Hàm đọc dữ liệu (Ưu tiên Blob -> Fallback về file Local nếu Blob rỗng)
export async function readData() {
  try {
    // 1. Tìm file trên Blob
    const { blobs } = await list({ prefix: DB_FILE_NAME, limit: 1 });
    
    // 2. Nếu có trên Blob -> Tải về và trả về
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url, { cache: 'no-store' });
      return await response.json();
    }

    // 3. Nếu chưa có trên Blob (Lần đầu chạy) -> Lấy dữ liệu mẫu từ code
    // LƯU Ý: Chỉ đọc để hiển thị, không được ghi ngược lại file này
    const defaultData = await import('@/data/portfolio.json');
    return defaultData.default || defaultData;

  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
}

// Hàm ghi dữ liệu (CHỈ GHI LÊN BLOB - KHÔNG GHI FILE LOCAL)
export async function writeData(data: any) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Ghi đè lên Blob
    const blob = await put(DB_FILE_NAME, jsonString, {
      access: 'public',
      addRandomSuffix: false, // Giữ nguyên tên để đè file cũ
      contentType: 'application/json'
    });
    
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error writing to Blob:", error);
    // Không throw lỗi fs ở đây nữa
    return { success: false, message: "Failed to save to cloud storage" };
  }
}

// --- PHẦN 2: CÁC HÀM XỬ LÝ LOGIC (Action) ---

// Update Portfolio
export async function updatePortfolio(section: string, newData: any) {
  try {
    // 1. Đọc dữ liệu hiện tại (từ Blob hoặc Local)
    const currentData = await readData();
    if (!currentData) throw new Error("Could not load data");

    // 2. Cập nhật phần section tương ứng
    if (section === 'personalInfo') currentData.personalInfo = { ...currentData.personalInfo, ...newData };
    else if (section === 'skills') currentData.skills = newData;
    else if (section === 'experiences') currentData.experiences = newData;
    else if (section === 'projects') currentData.projects = newData;

    // 3. Ghi toàn bộ cục data mới LÊN BLOB (Tuyệt đối không ghi vào file json local)
    await writeData(currentData);
    
    return { success: true, message: "Update successful!" };
  } catch (error: any) {
    console.error("Update error:", error);
    return { success: false, message: error.message };
  }
}

// Delete Item trong danh sách
export async function deleteListItem(section: string, indexToRemove: number) {
  try {
    const currentData = await readData();
    if (!currentData) throw new Error("Could not load data");

    if (Array.isArray(currentData[section])) {
      currentData[section] = currentData[section].filter((_: any, idx: number) => idx !== indexToRemove);
      
      // Ghi lại lên Blob
      await writeData(currentData);
      return { success: true, message: "Item deleted successfully" };
    } 
    return { success: false, message: "Section is not a list" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// --- PHẦN 3: CONTACT & MESSAGES ---

export async function getContactMessages() {
  try {
    const { blobs } = await list({ prefix: MSG_FILE_NAME, limit: 1 });
    if (blobs.length === 0) return [];
    const response = await fetch(blobs[0].url, { cache: 'no-store' });
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const files = formData.getAll("files") as File[];

    let attachmentsHtml = "";
    const attachmentLinks: string[] = [];

    // Upload files lên Blob
    for (const file of files) {
      if (file.size > 0) {
        const blob = await put(`contacts/${Date.now()}-${file.name}`, file, { access: 'public' });
        attachmentsHtml += `<li><a href="${blob.url}" target="_blank">${file.name}</a></li>`;
        attachmentLinks.push(blob.url);
      }
    }

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `<h3>New Message</h3><p>${message}</p>${attachmentsHtml ? `<ul>${attachmentsHtml}</ul>` : ''}`,
    });

    // Lưu tin nhắn vào Blob
    const currentMessages = await getContactMessages();
    const newMessage = { id: Date.now(), name, email, message, date: new Date().toISOString(), attachments: attachmentLinks };
    
    // Ghi đè file Messages trên Blob
    await put(MSG_FILE_NAME, JSON.stringify([newMessage, ...currentMessages], null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });

    return { success: true, message: "Sent & Saved!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
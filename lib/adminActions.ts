// lib/adminActions.ts
"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { mkdir } from 'fs/promises';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');
const CONTACT_FILE_PATH = path.join(process.cwd(), 'data', 'contact.json');

// --- PHẦN PORTFOLIO (GIỮ NGUYÊN) ---
export async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return { personalInfo: {}, skills: {}, experiences: [], projects: [] };
  }
}

export async function writeData(data: any) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    revalidatePath('/'); 
    return { success: true, message: "Data has been updated successfully!" };
  } catch (error) {
    console.error("Error writing JSON file:", error);
    return { success: false, message: `Error writing file: ${(error as any).message}` };
  }
}

export async function updateSectionData(sectionName: string, newData: any) {
  const currentData = await readData();
  
  if (Array.isArray(currentData[sectionName])) {
    const list = currentData[sectionName];
    if (newData.id) {
        const index = list.findIndex((item: any) => item.id === newData.id);
        if (index !== -1) list[index] = newData;
    } else {
        const newId = list.length > 0 ? Math.max(...list.map((item: any) => item.id || 0)) + 1 : 1;
        list.push({ ...newData, id: newId });
    }
    currentData[sectionName] = list;
  } else if (typeof currentData[sectionName] === 'object') {
    currentData[sectionName] = { ...currentData[sectionName], ...newData };
  } else if (sectionName === 'skills') {
     currentData[sectionName] = newData;
  }

  return await writeData(currentData);
}

export async function deleteListItem(sectionName: string, id: number) {
    const currentData = await readData();
    const list = currentData[sectionName];

    if (Array.isArray(list)) {
        currentData[sectionName] = list.filter((item: any) => item.id !== id);
        return await writeData(currentData);
    }
    return { success: false, message: "Cannot delete." };
}

// --- PHẦN LIÊN HỆ (MỚI THÊM) ---

// 1. Đọc tin nhắn (Cho Admin)
export async function getContactMessages() {
  try {
    const data = await fs.readFile(CONTACT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Nếu chưa có file thì trả về rỗng
  }
}

// 2. Gửi tin nhắn (Cho User)
export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const files = formData.getAll('files') as File[];
    const date = new Date().toISOString();

    if (!name || !email || !message) {
      return { success: false, message: "Please fill in all information!" };
    }

    const attachments: string[] = [];
    if (files && files.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contacts');
      
      // Tạo thư mục nếu chưa có
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {
        // Bỏ qua nếu thư mục đã tồn tại
      }

      for (const file of files) {
        // Chỉ lưu file có dung lượng > 0 và tên hợp lệ
        if (file.size > 0 && file.name !== 'undefined') {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Tạo tên file duy nhất để tránh trùng
          const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
          const filePath = path.join(uploadDir, fileName);
          
          await fs.writeFile(filePath, buffer);
          attachments.push(`/uploads/contacts/${fileName}`);
        }
      }
    }

    // Đọc dữ liệu cũ
    let contacts = [];
    try {
      const fileData = await fs.readFile(CONTACT_FILE_PATH, 'utf-8');
      contacts = JSON.parse(fileData);
    } catch (e) {
      contacts = [];
    }

    // Thêm tin nhắn mới kèm danh sách file đính kèm
    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      date,
      attachments, // Lưu mảng đường dẫn file
      read: false
    };

    contacts.unshift(newMessage);

    await fs.writeFile(CONTACT_FILE_PATH, JSON.stringify(contacts, null, 2), 'utf-8');
    revalidatePath('/admin/messages');
    
    return { success: true, message: "Messages and documents have been sent!" };
  } catch (error) {
    console.error("Contact error:", error);
    return { success: false, message: "System error: " + (error as Error).message };
  }
}
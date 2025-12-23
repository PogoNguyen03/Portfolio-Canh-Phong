// lib/adminActions.ts
"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { mkdir } from 'fs/promises';
import nodemailer from 'nodemailer';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyencanhphong246@gmail.com', 
    pass: 'ihtr rtif oscf lsgv', // Đây là mật khẩu ứng dụng, không phải mật khẩu đăng nhập Gmail
  },
});

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


// 2. Gửi tin nhắn (Cho User)
export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string || 'New Contact from Portfolio';
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    if (!name || !email || !message) {
      return { success: false, message: "Vui lòng điền đầy đủ thông tin!" };
    }

    const attachments = [];
    for (const file of files) {
      if (file.size > 0 && file.name !== 'undefined') {
        const bytes = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(bytes),
        });
      }
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: 'GMAIL_NHAN_CUA_BAN@gmail.com', // Email nhận thông báo của bạn
      replyTo: email, // Khi bạn nhấn "Reply" trong Gmail, nó sẽ gửi tới email người liên hệ
      subject: `[Portfolio] ${subject}`,
      text: `Người gửi: ${name}\nEmail: ${email}\n\nNội dung:\n${message}`,
      attachments: attachments,
    });

    return { success: true, message: "Tin nhắn và tài liệu đã được gửi đến Gmail!" };
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
    return { success: false, message: "Lỗi hệ thống: " + (error as Error).message };
  }
}
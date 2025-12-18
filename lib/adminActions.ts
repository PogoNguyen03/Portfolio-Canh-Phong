// lib/adminActions.ts
"use server";
import { put, list } from '@vercel/blob';
import nodemailer from "nodemailer";

// --- PHẦN 1: QUẢN LÝ DỮ LIỆU JSON TRÊN BLOB ---

const DB_FILE_NAME = 'database/portfolio.json';

// Hàm helper để lấy dữ liệu JSON từ Blob
export async function readData() {
  try {
    // 1. Tìm file json trên Blob store
    const { blobs } = await list({ prefix: DB_FILE_NAME, limit: 1 });
    
    // Nếu chưa có file (lần đầu chạy), fallback về file local hoặc object rỗng
    if (blobs.length === 0) {
      // Bạn có thể import data mặc định từ local để khởi tạo nếu muốn
      const defaultData = await import('@/data/portfolio.json');
      return defaultData.default || defaultData;
    }

    // 2. Fetch nội dung từ URL của Blob
    const response = await fetch(blobs[0].url, { 
      cache: 'no-store' // Quan trọng: Luôn lấy dữ liệu mới nhất
    });
    return await response.json();
  } catch (error) {
    console.error("Error reading data from Blob:", error);
    return null;
  }
}

// Hàm helper để ghi đè dữ liệu JSON lên Blob
export async function writeData(data: any) {
  try {
    // Ghi đè file cũ bằng cách dùng addRandomSuffix: false
    const blob = await put(DB_FILE_NAME, JSON.stringify(data, null, 2), {
      access: 'public',
      addRandomSuffix: false, // Bắt buộc để giữ nguyên tên file
      contentType: 'application/json'
    });
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error writing data to Blob:", error);
    return { success: false };
  }
}

// Hàm update (giữ nguyên logic, chỉ gọi writeData mới)
export async function updatePortfolio(section: string, newData: any) {
  try {
    const currentData = await readData();
    if (!currentData) throw new Error("Could not load data");

    // Logic update từng phần
    if (section === 'personalInfo') currentData.personalInfo = { ...currentData.personalInfo, ...newData };
    else if (section === 'skills') currentData.skills = newData;
    else if (section === 'experiences') currentData.experiences = newData;
    else if (section === 'projects') currentData.projects = newData;

    await writeData(currentData);
    return { success: true, message: "Update successful!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}


// --- PHẦN 2: XỬ LÝ CONTACT FORM (FIX LỖI EROFS) ---

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const files = formData.getAll("files") as File[];

    let attachmentsHtml = "";
    
    // Upload từng file đính kèm lên Blob và lấy Link
    for (const file of files) {
      if (file.size > 0) {
        const blob = await put(`contacts/${Date.now()}-${file.name}`, file, {
          access: 'public',
        });
        attachmentsHtml += `<li><a href="${blob.url}" target="_blank">${file.name}</a></li>`;
      }
    }

    // Gửi mail (Chỉ gửi Link tải file, nhẹ và nhanh hơn)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <h3>New Message from ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        ${attachmentsHtml ? `<p><strong>Attachments:</strong><ul>${attachmentsHtml}</ul></p>` : ''}
      `,
    });

    return { success: true, message: "Message sent successfully!" };

  } catch (error: any) {
    console.error("Contact Form Error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteListItem(section: string, indexToRemove: number) {
  try {
    const currentData = await readData();
    if (!currentData) throw new Error("Could not load data");

    // Kiểm tra xem section đó có phải là mảng không (để xóa)
    if (Array.isArray(currentData[section])) {
      // Xóa phần tử tại vị trí indexToRemove
      currentData[section] = currentData[section].filter((_: any, idx: number) => idx !== indexToRemove);
      
      await writeData(currentData);
      return { success: true, message: "Item deleted successfully" };
    } 
    
    return { success: false, message: "Section is not a list" };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, message: error.message };
  }
}
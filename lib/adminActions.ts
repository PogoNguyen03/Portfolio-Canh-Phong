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
  try {
    // 1. Lấy dữ liệu từ FormData
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    // 2. Xử lý Upload file đính kèm lên Vercel Blob
    const attachmentUrls = [];
    for (const file of files) {
      if (file && file.size > 0) {
        // Đặt tên file có timestamp để tránh trùng lặp
        const fileName = `contacts/${Date.now()}-${file.name}`;
        const blob = await put(fileName, file, {
          access: 'public',
        });
        attachmentUrls.push(blob.url);
      }
    }

    // 3. Lưu tin nhắn vào file messages.json trên Vercel Blob
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      date: new Date().toISOString(),
      attachments: attachmentUrls,
    };

    // Đọc danh sách tin nhắn hiện có
    let messages = [];
    try {
      const { blobs } = await list({ prefix: MSG_FILE_NAME, limit: 1 });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url, { cache: 'no-store' });
        if (response.ok) {
          messages = await response.json();
        }
      }
    } catch (e) {
      console.log("Chưa có file messages.json hoặc lỗi đọc, sẽ tạo mới.");
    }

    // Thêm tin nhắn mới vào đầu danh sách và lưu lại
    messages.unshift(newMessage);
    await put(MSG_FILE_NAME, JSON.stringify(messages, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });

    // 4. Gửi Email thông báo (Sử dụng cấu hình từ .env)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Gửi từ chính mail mình để tránh bị spam filter
      to: process.env.EMAIL_USER,
      replyTo: email, // Khi bấm Reply sẽ gửi lại cho khách
      subject: `📩 Portfolio: Tin nhắn mới từ ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Bạn có tin nhắn mới từ Portfolio!</h2>
          <p><strong>Người gửi:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Nội dung:</strong></p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>File đính kèm:</strong> ${attachmentUrls.length > 0 ? attachmentUrls.length : 'Không có'}</p>
          ${attachmentUrls.map((url, i) => `<a href="${url}">File ${i + 1}</a>`).join(' | ')}
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Cảm ơn bạn! Tin nhắn đã được gửi thành công." };

  } catch (error: any) {
    console.error("Submit contact error:", error);
    return { 
      success: false, 
      message: "Gửi tin nhắn thất bại. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Email." 
    };
  }
}
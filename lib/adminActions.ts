// lib/adminActions.ts
"use server";

import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

// Đọc dữ liệu từ JSON file
export async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    // Trả về cấu trúc rỗng nếu lỗi
    return { personalInfo: {}, skills: {}, experiences: [], projects: [] };
  }
}

// Ghi dữ liệu vào JSON file
export async function writeData(data: any) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    // Trả về thông báo thành công
    return { success: true, message: "Dữ liệu đã được cập nhật thành công!" };
  } catch (error) {
    console.error("Error writing JSON file:", error);
    return { success: false, message: `Lỗi ghi file: ${(error as Error).message}` };
  }
}

// Hàm cập nhật một section cụ thể
export async function updateSectionData(sectionName: string, newData: any) {
  const currentData = await readData();
  
  // Logic xử lý khi section là danh sách (experiences, projects)
  if (Array.isArray(currentData[sectionName])) {
    const list = currentData[sectionName];
    
    // Nếu có ID (Edit/Update)
    if (newData.id) {
        const index = list.findIndex(item => item.id === newData.id);
        if (index !== -1) {
            list[index] = newData; // Cập nhật mục đã có
        }
    } 
    // Nếu không có ID (Add/Create)
    else {
        // Tạo ID mới (cách đơn giản)
        const newId = list.length > 0 ? Math.max(...list.map(item => item.id || 0)) + 1 : 1;
        list.push({ ...newData, id: newId });
    }
    
    currentData[sectionName] = list;

  } 
  // Logic xử lý khi section là object đơn (personalInfo, skills)
  else if (typeof currentData[sectionName] === 'object') {
    currentData[sectionName] = { ...currentData[sectionName], ...newData };
  } 
  // Xử lý chung cho Skills (vì Skills là object chứa các mảng)
  else if (sectionName === 'skills') {
     currentData[sectionName] = newData;
  }


  return await writeData(currentData);
}

// Hàm xóa một mục khỏi danh sách (chỉ áp dụng cho experiences và projects)
export async function deleteListItem(sectionName: string, id: number) {
    const currentData = await readData();
    const list = currentData[sectionName];

    if (Array.isArray(list)) {
        currentData[sectionName] = list.filter(item => item.id !== id);
        return await writeData(currentData);
    }
    return { success: false, message: "Không thể xóa: Section này không phải là danh sách." };
}
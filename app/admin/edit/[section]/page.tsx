// app/admin/edit/[section]/page.tsx
import React from 'react';
import { readData, updatePortfolio as updateSectionData, deleteListItem } from '@/lib/adminActions';
import { EditForm } from './EditForm'; // Import Client Component (sẽ tạo dưới đây)
import Link from 'next/link';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

// Chú ý: Component này là Server Component (mặc định)

const sectionTitles: Record<string, string> = {
    personalInfo: "Thông tin cá nhân",
    skills: "Kỹ năng",
    experiences: "Kinh nghiệm làm việc",
    projects: "Các dự án nổi bật"
};

export default async function EditPage({ params }: { params: Promise<{ section: string }> | { section: string } }) {
    // Xử lý params có thể là Promise (Next.js 15)
    const resolvedParams = await Promise.resolve(params);
    const { section } = resolvedParams;
    const title = sectionTitles[section] || "Quản lý dữ liệu";
    
    // Đọc dữ liệu từ file
    const data = await readData();
    
    // Debug: Log để kiểm tra dữ liệu
    console.log('=== EditPage Debug ===');
    console.log('Section:', section);
    console.log('Full Data:', JSON.stringify(data, null, 2));
    
    const sectionData = data[section as keyof typeof data];
    console.log('Section Data:', JSON.stringify(sectionData, null, 2));

    if (!sectionData) {
        return (
            <div className="p-8 text-red-500">
                <p>Section `{section}` không tồn tại trong dữ liệu.</p>
                <p className="text-sm mt-2">Available sections: {Object.keys(data).join(', ')}</p>
            </div>
        );
    }

    // Kiểm tra nếu là một danh sách (Experiences, Projects)
    const isList = Array.isArray(sectionData);

    // Xử lý khi là Danh sách (Experiences, Projects)
    if (isList) {
        return (
            <div className="p-8 md:p-12 max-w-5xl mx-auto">
                <Link href="/admin" className="px-4 py-2 mb-6 w-fit bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} /> Quay lại Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-900 mb-8 dark:text-slate-200">{title}</h1>

                <EditForm sectionName={section as 'personalInfo' | 'skills' | 'experiences' | 'projects'} initialData={sectionData} updateAction={updateSectionData} deleteAction={deleteListItem} />
            </div>
        );
    } 
    // Xử lý khi là Object đơn (PersonalInfo)
    else {
         return (
            <div className="p-8 md:p-12 max-w-3xl mx-auto">
                <Link href="/admin" className="px-4 py-2 mb-6 w-fit bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} /> Quay lại Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-900 mb-8 dark:text-slate-200">{title} (Chỉnh sửa trực tiếp)</h1>
                 
                <EditForm sectionName={section as 'personalInfo' | 'skills' | 'experiences' | 'projects'} initialData={sectionData} updateAction={updateSectionData} deleteAction={deleteListItem} isSingleObject={true} />
            </div>
        );
    }
}
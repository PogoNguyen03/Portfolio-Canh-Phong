// app/admin/page.tsx
import React from 'react';
import { Settings, User, Code2, FolderGit2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Admin Dashboard - Portfolio",
};

const sections = [
  { name: 'Thông tin cá nhân', icon: User, route: 'personalInfo', description: 'Chỉnh sửa tên, thông tin liên hệ, và tóm tắt.' },
  { name: 'Kỹ năng', icon: Code2, route: 'skills', description: 'Quản lý các ngôn ngữ, framework, và công cụ kỹ thuật.' },
  { name: 'Kinh nghiệm', icon: FolderGit2, route: 'experiences', description: 'Thêm, sửa, xóa các vị trí làm việc và thành tích.' },
  { name: 'Dự án', icon: FolderGit2, route: 'projects', description: 'Quản lý các dự án nổi bật, stack, và giải pháp.' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 flex items-center gap-3">
          <Settings size={30} /> Admin Dashboard
        </h1>
        <p className="text-slate-500 mb-10">
          Hệ thống quản lý nội dung Portfolio bằng file JSON.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.route}
              href={`/admin/edit/${section.route}`}
              className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500 hover:border-blue-700"
            >
              <div className="flex justify-between items-start">
                <section.icon className="text-blue-600 mb-3" size={28} />
                <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{section.name}</h2>
              <p className="text-sm text-slate-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
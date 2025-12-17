// app/admin/page.tsx
"use client";

import React from 'react';
import { logout } from '../login/action'; // Đảm bảo đường dẫn này đúng
import { Settings, User, Code2, FolderGit2, ArrowRight, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { 
    name: 'Thông tin cá nhân', 
    icon: User, 
    route: 'personalInfo', 
    description: 'Chỉnh sửa tên, thông tin liên hệ, và tóm tắt.' 
  },
  { 
    name: 'Kỹ năng', 
    icon: Code2, 
    route: 'skills', 
    description: 'Quản lý các ngôn ngữ, framework, và công cụ kỹ thuật.' 
  },
  { 
    name: 'Kinh nghiệm', 
    icon: FolderGit2, 
    route: 'experiences', 
    description: 'Thêm, sửa, xóa các vị trí làm việc và thành tích.' 
  },
  { 
    name: 'Dự án', 
    icon: FolderGit2, 
    route: 'projects', 
    description: 'Quản lý các dự án nổi bật, stack, và giải pháp.' 
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-800 dark:text-slate-200 p-8 md:p-12 font-sans transition-colors duration-500">
      
      {/* Background Effect (Optional - để đồng bộ với trang login) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                    <span className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
                        <Settings size={28} />
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Admin Dashboard
                    </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Hệ thống quản lý nội dung Portfolio (JSON System).
                </p>
            </div>

            <div className="flex gap-4">
                {/* Nút về trang chủ */}
                <Link 
                    href="/" 
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                    <ArrowLeft size={18} /> View Site
                </Link>

                {/* Nút Đăng xuất */}
                <button 
                    onClick={() => logout()}
                    className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all shadow-sm"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>

        {/* --- GRID SECTIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.route}
              href={`/admin/edit/${section.route}`}
              className="group relative block p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <section.icon size={28} />
                </div>
                <ArrowRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              
              <div className="relative">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{section.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
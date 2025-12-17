// app/admin/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { logout } from '../login/action';
import { getAnalyticsData } from '@/lib/analyticsActions'; // Import hàm lấy số liệu
import { 
  Settings, User, Code2, FolderGit2, ArrowRight, 
  LogOut, ArrowLeft, Mail, LayoutDashboard, Globe, Eye, Users, Activity
} from 'lucide-react';
import Link from 'next/link';

// Mock data thống kê (để làm đẹp)
const stats = [
  { label: "Total Views", value: "1.2k", color: "text-blue-500" },
  { label: "Messages", value: "Active", color: "text-green-500" },
  { label: "System", value: "Stable", color: "text-purple-500" },
];

const mainSections = [
  {
    name: 'Inbox (Messages)',
    icon: Mail,
    route: 'messages',
    description: 'Xem tin nhắn liên hệ từ nhà tuyển dụng.',
    highlight: true // Làm nổi bật ô này
  },
  {
    name: 'Personal Info',
    icon: User,
    route: 'edit/personalInfo',
    description: 'Chỉnh sửa Bio, CV link, Avatar.'
  },
  {
    name: 'Tech Stack',
    icon: Code2,
    route: 'edit/skills',
    description: 'Cập nhật danh sách kỹ năng.'
  },
  {
    name: 'Experience',
    icon: FolderGit2,
    route: 'edit/experiences',
    description: 'Quản lý lịch sử làm việc.'
  },
  {
    name: 'Projects',
    icon: Globe,
    route: 'edit/projects',
    description: 'Thêm hoặc sửa dự án cá nhân.'
  },
];

export default function AdminDashboard() {
  // State lưu số liệu thống kê
  const [statsData, setStatsData] = useState({ totalViews: 0, uniqueIPs: 0, recentLogs: [] });

  useEffect(() => {
    async function loadStats() {
      const data = await getAnalyticsData();
      setStatsData(data);
    }
    loadStats();
  }, []);

  const stats = [
    { label: "Total Page Views", value: statsData.totalViews, icon: Eye, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Unique Visitors", value: statsData.uniqueIPs, icon: Users, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Recent Activity", value: statsData.recentLogs.length > 0 ? "New" : "Idle", icon: Activity, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  ];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-800 dark:text-slate-200 p-6 md:p-10 font-sans transition-colors duration-500">
      <div className="max-w-6xl mx-auto">

        {/* --- TOP BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <span className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
                <LayoutDashboard size={24} />
              </span>
              <span className="text-slate-800 dark:text-white">Admin Console</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 ml-1">
              Welcome back. System is ready.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
              <ArrowLeft size={16} /> View Site
            </Link>
            <button onClick={() => logout()} className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* --- STATS BAR --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Hiển thị chi tiết IP truy cập gần nhất (Optional) */}
        {statsData.recentLogs.length > 0 && (
          <div className="mb-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Recent Visitors (Last 5)</h3>
            <div className="space-y-2">
              {(statsData.recentLogs as any[]).map((log, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                  <span className="font-mono text-blue-600 dark:text-blue-400">{log.ip}</span>
                  <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MAIN GRID --- */}
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainSections.map((section) => (
            <Link
              key={section.route}
              href={`/admin/${section.route}`}
              className={`group relative p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl duration-300
                ${section.highlight
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${section.highlight ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}`}>
                  <section.icon size={24} />
                </div>
                <ArrowRight size={20} className={`${section.highlight ? 'text-white/60' : 'text-slate-300 dark:text-slate-600'} group-hover:translate-x-1 transition-transform`} />
              </div>

              <div>
                <h3 className={`text-lg font-bold mb-2 ${section.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {section.name}
                </h3>
                <p className={`text-sm leading-relaxed ${section.highlight ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
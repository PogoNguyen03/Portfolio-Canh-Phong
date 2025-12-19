// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { readData } from "@/lib/adminActions"; // Import hàm đọc dữ liệu
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- HÀM TẠO METADATA ĐỘNG (SEO) ---
export async function generateMetadata(): Promise<Metadata> {
  // 1. Đọc dữ liệu mới nhất từ file JSON
  const data = await readData();
  const { personalInfo } = data;
  const name = personalInfo?.name || "Portfolio";
  const title = personalInfo?.title || "Full Stack Developer";
  const summary = personalInfo?.summary || "Welcome to my personal portfolio.";
  const avatar = personalInfo?.avatar || "/uploads/favicon.ico";

  // 2. Trả về cấu hình SEO chuẩn
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name} - ${title}`,
    },
    description: summary,
    keywords: [
      "Portfolio",
      "Web Developer",
      "Full Stack",
      name,
      "React",
      "Next.js",
      "Business Analyst"
    ],
    authors: [{ name: name }],
    creator: name,

    openGraph: {
      title: `${name} - ${title}`,
      description: summary,
      url: 'https://portfolio-canh-phong.vercel.app',
      siteName: `${name}'s Portfolio`,
      images: [
        {
          url: avatar,
          width: 800,
          height: 600,
          alt: `${name} Avatar`,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${name} - ${title}`,
      description: summary,
      images: [avatar],
    },

    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b1121] text-slate-200`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}


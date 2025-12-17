// app/login/action.ts
"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  const correctPassword = process.env.ADMIN_PASSWORD;

  // Kiểm tra mật khẩu từ .env
  if (password === correctPassword) {
    // Nếu đúng, tạo cookie phiên làm việc
    // Cookie này sẽ hết hạn sau 24 giờ (60 * 60 * 24)
    const cookieStore = await cookies();
    cookieStore.set(process.env.AUTH_COOKIE_NAME || 'admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, 
      path: '/',
    });

    redirect('/admin'); // Chuyển hướng vào trang Admin
  } else {
    // Nếu sai, trả về lỗi
    return { error: "Mật khẩu không chính xác!" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(process.env.AUTH_COOKIE_NAME || 'admin_session');
  redirect('/login');
}
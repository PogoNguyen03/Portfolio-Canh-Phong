// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Lấy tên cookie từ biến môi trường (hoặc dùng mặc định)
  const cookieName = process.env.AUTH_COOKIE_NAME || 'admin_session';
  
  // Kiểm tra xem cookie có tồn tại không
  const isAuthenticated = req.cookies.has(cookieName);

  // Nếu đang cố vào /admin mà chưa đăng nhập -> Chuyển hướng về /login
  if (req.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu đã đăng nhập mà cố vào trang /login -> Chuyển hướng vào /admin luôn
  if (req.nextUrl.pathname === '/login' && isAuthenticated) {
    const adminUrl = new URL('/admin', req.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
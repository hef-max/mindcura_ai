import { NextResponse } from 'next/server';

export function middleware(req) {
  const { cookies } = req;
  const token = cookies.get('auth-token');

  // Jika token tidak ada, redirect ke halaman login

  console.log(token);
  if (!token) {
    return NextResponse.redirect('http://www.mindcura.net/');
  }

  return NextResponse.next();
}


export const config = { 
    matcher: [
      "/dashboard",
      "/schedule",
      "/about",
      "/account",
      "/activity",
      "/consulting",
      "/therapist",
      "/avatar",
    ] 
};

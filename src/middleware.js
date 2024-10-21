// src/middleware.js

import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(request) {
  const token = request.cookies.get('token'); // Retrieve the token from cookies

  // Define the paths that require authentication
  const protectedPaths = ['/dashboard'];

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      // If the token is not found, redirect to the login page
      return NextResponse.redirect(new URL('/register?login=true', request.url));
    }
  }

  return NextResponse.next(); // Continue to the requested page
}

// Specify the paths for which this middleware should run
export const config = {
  matcher: ['/dashboard', '/profile', '/add_preferences', '/quiz', '/resources'], // Apply middleware to specific paths
};

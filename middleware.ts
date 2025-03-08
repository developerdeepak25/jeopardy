import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("middleware", req.nextauth.token);
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow authenticated users to access protected routes
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/jeopardy", "/leaderboard", "/admin:path*"], // Protect specific pages
};

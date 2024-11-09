import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicPaths = ["/", "/signin"];

// Helper function to check if the path is public
const isPublicPath = (path: string): boolean => {
  return publicPaths.some(
    (publicPath) => path.startsWith(publicPath) || path === "/",
  );
};

export default withAuth(
  async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    const path = req.nextUrl.pathname;
    const token = await getToken({ req, secret });

    // Allow access to public paths
    if (isPublicPath(path)) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(loginUrl);
    }

    // Validate workspace access if accessing workspace routes
    if (path.startsWith("/workspace")) {
      const workspaceId = path.split("/")[2];
      if (!workspaceId || workspaceId !== token.workspaceId) {
        return new NextResponse("Unauthorized workspace access", {
          status: 403,
        });
      }
    }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-email", token?.email as string);

    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
  },
  {
    callbacks: {
      // Middleware will only run if session exists
      authorized: ({ token }) => !!token,
    },
  },
);

// Configure which routes should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

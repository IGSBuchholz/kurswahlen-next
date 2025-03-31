import { NextResponse } from "next/server";
import {useSession, signIn, signOut, getSession} from "next-auth/react"
import {getToken} from "next-auth/jwt";
import handler from "@/app/api/progress/retrievestate/page";
import {withAuth} from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        console.log(req.nextauth);
        if (
            req.nextUrl.pathname.startsWith("/userarea/admin") &&
            req.nextauth.token?.isadmin !== true
        ) {
            return NextResponse.redirect(new URL("/userarea/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: (params) => {
                let { token } = params;
                return !!token;
            },
        },
    }
);

// Apply middleware to specific routes
export const config = {
    matcher: ["/userarea/:path*"],
};
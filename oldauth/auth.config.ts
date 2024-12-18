import type { NextAuthConfig } from 'next-auth';
import { getSession } from 'next-auth/react';
 
export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
        console.log(auth);
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
        return Response.redirect(new URL(`/info/${auth.user?.id}`, nextUrl));
        }
        return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
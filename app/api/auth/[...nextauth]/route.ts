export const runtime = 'nodejs';            // ✅ Forces Node.js (not Edge)
export const dynamic = 'force-dynamic';     // ✅ Ensures per-request execution

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { AuthOptions } from 'next-auth';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET');
}

// Remove force-dynamic and edge runtime directives since MongoDB isn't edge-compatible
// export const dynamic = 'auto';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use fetch to make a request to a separate API route that handles MongoDB
          const response = await fetch(`http://localhost:3000/api/auth/verify-credentials`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user:any = await response.json();
          console.log('User:', user);
          if (!user || !user.email) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user?.role ?? 'user',
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any)?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { QueryResultRow, sql } from '@vercel/postgres';
type User = {
    id: string;
    name: string;
    salt: string;
    password: string;
  }
import bcrypt from 'bcrypt';
 
async function getUser(id : string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM USERS WHERE id=${id}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6)})
          .safeParse(credentials);

        console.log(credentials);

        if (parsedCredentials.success) {

            console.log(parsedCredentials);

            const { username, password } = parsedCredentials.data;
            const data : any = await getUser(username);
            const user : User = {id: data.id,
                name: data.name,
                salt: data.salt,
                password: data.password};
            console.log(user);
            if (!user) return null;
            
            const hashedPass = await bcrypt.hash(password, user.salt)

            if (hashedPass == user.password) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  session: {
    strategy : "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
        console.log('+++++++++++++' + token)
        if (user) {
          token.user = user;
        }
        return token;
      },
    async session({ session, token}) {
        console.log('-------------' + session);
        const user : any = token.user;
        session.user = user;
        return session;
    },
  }
});
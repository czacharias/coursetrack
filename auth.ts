import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
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

async function getHash(password : string, salt : string) {
    
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
            const user = await getUser(username);
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
});
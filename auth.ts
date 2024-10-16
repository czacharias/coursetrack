
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import credentials from "next-auth/providers/credentials";
import { fetchUser } from "./app/lib/actions";
import { type DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
      user: {
        id: string,
        password: string,
        salt: string,
        courses: string[],
      } & DefaultSession["user"]
    }
  }


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Github,
    Credentials({
        credentials: {
            id: {},
            password: {},
        },
        authorize: async (credentials : any) =>{
            console.log("==============CREDENTIALS==============");
            console.log(credentials);
            console.log("=================USER=================");
            const user : any = await fetchUser(credentials.id);
            console.log(user);
            if(!user){
                throw new Error("User not found");
            }

            const hashpass = await bcrypt.hash(credentials.password, user.salt);
            console.log("=================PASS=================");
            console.log(hashpass);

            if(user.password == hashpass){
                return user;
            }
            throw new Error("Invalid Password");

        }
    })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
              token.id = user.id;
            }
            return token
          },
        async session({session, token}) {
            // console.log('token', token);
            session.user.id = token.id as string;
            return session
          },
        authorized({ auth, request: { nextUrl } }){
            // const isLoggedIn = !!auth?.user;
            // const isOnDashboard = nextUrl.pathname.startsWith('/info') || nextUrl.pathname.startsWith('/auth');
            // if (isOnDashboard) {
            //     if (isLoggedIn) {
            //         return true;
            //     }
            //     return false; 
            // } 
            // else if (isLoggedIn) {
            //     return Response.redirect(new URL(`/info/${auth.user?.id}`, nextUrl));
            // }
            return true;
        }
      },
})
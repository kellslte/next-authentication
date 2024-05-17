import Axios from "@/request/axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


interface IUser {
    id: string
    name: string
    email: string
}

declare module "next-auth" {
  interface Session {
    user: IUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: IUser
  }
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
       
      },
      async authorize(credentials) {    
           
        try {
          const req = await Axios.post('/auth/sign-in', {...credentials})

          if (req.status !== 200) throw new Error(req.data.error)
           console.log(req.data.token)
          Axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${req.data.token}`
            return config
          }, (error)=> {
            Promise.reject(error)
          })
          
          return {user: req.data.user} as any;
        } catch (error) {
          throw new Error((error as Error).message)
        }
      },
    
    }),
  ],

  pages: {
    signIn: "/login",
  },
};

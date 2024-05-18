import { Axios } from "@/lib/utils";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          minLength: 6,
          required: true,
        },
      },
      async authorize(credentials, req) {
        const { data } = await Axios.post("/auth/sign-in", {
          email: credentials!.email,
          password: credentials!.password,
        });

        if (data.success) {
          return data.data;
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      return token;
    },
    async session({ token, session }) {
      session.user = token.user;
      session.authorization = token.authorization;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

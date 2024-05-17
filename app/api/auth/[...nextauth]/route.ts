import { axiosClient } from "@/lib/utils";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { data } = await axiosClient.post("/auth/sign-in", {
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
      console.log("From the session callback", token);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

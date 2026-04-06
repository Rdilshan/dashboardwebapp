import type { DefaultSession, User } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validateAdminCredentials } from "@/app/action/admin";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
    };
  }

  interface User {
    username: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    username?: string;
  }
}

const authConfig = {
  providers: [
    Credentials({
      name: "Admin credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const username = String(credentials?.username ?? "").trim();
        const password = String(credentials?.password ?? "");

        if (!username || !password) {
          return null;
        }

        const admin = await validateAdminCredentials({ username, password });

        if (!admin) {
          return null;
        }

        return {
          id: String(admin.id),
          name: admin.username,
          username: admin.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.username = token.username ?? "";
        session.user.name = token.username ?? session.user.name;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;

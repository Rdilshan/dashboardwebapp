import type { DefaultSession, User } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validateAdminCredentials } from "@/app/action/admin";
import { validateStudentCredentials } from "@/lib/auth/student";

type AppRole = "admin" | "student";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: AppRole;
      username?: string;
      indexNumber?: string;
    };
  }

  interface User {
    role: AppRole;
    username?: string;
    indexNumber?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
    username?: string;
    indexNumber?: string;
  }
}

const authConfig = {
  providers: [
    Credentials({
      id: "admin-credentials",
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
          role: "admin",
        };
      },
    }),
    Credentials({
      id: "student-credentials",
      name: "Student credentials",
      credentials: {
        indexNumber: { label: "Index Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const indexNumber = String(credentials?.indexNumber ?? "").trim();
        const password = String(credentials?.password ?? "");

        if (!indexNumber || !password) {
          return null;
        }

        const student = await validateStudentCredentials({
          indexNumber,
          password,
        });

        if (!student) {
          return null;
        }

        return {
          id: String(student.id),
          name: student.name,
          email: student.email,
          indexNumber: student.indexNumber,
          role: "student",
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
        token.role = user.role;
        token.username = user.username;
        token.indexNumber = user.indexNumber;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      const role =
        token.role ??
        (token.username ? "admin" : token.indexNumber ? "student" : undefined);

      if (session.user && role) {
        session.user.id = token.id ?? "";
        session.user.role = role;
        session.user.username = token.username;
        session.user.indexNumber = token.indexNumber;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;


import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { getDb } from "@/lib/mongo/db"
import { ensureEnv } from "@/lib/env"

ensureEnv(["NEXTAUTH_SECRET", "NEXTAUTH_URL"])

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase()
        const password = credentials?.password?.toString()

        if (!email || !password) {
          return null
        }

        const db = await getDb()
        const user = await db.collection("users").findOne({ email })

        if (!user || !user.password_hash) {
          return null
        }

        const isValid = await compare(password, user.password_hash)
        if (!isValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }
      if (user?.email) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.email) {
        session.user.email = token.email
      }
      return session
    },
  },
}

export function getServerAuthSession() {
  return getServerSession(authOptions)
}

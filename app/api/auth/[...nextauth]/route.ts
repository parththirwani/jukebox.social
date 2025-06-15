import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prismaClient } from "@/app/lib/db"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if user exists, if not create them
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email! }
        });

        if (!existingUser) {
          await prismaClient.user.create({
            data: {
              email: user.email!,
              provider: "Google",
              password: "", // Empty since using OAuth
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Find user in database and add ID to token
        const dbUser = await prismaClient.user.findUnique({
          where: { email: user.email! }
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
})
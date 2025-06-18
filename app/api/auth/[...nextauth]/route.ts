import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prismaClient } from "@/app/lib/db"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("=== SIGN IN CALLBACK ===");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);

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
            }
          });
          console.log("New user created:", user.email);
        } else {
          console.log("Existing user found:", user.email);
        }
      }
      return true;
    },

    async jwt({ token, user, account}) {
      console.log("=== JWT CALLBACK ===");
      console.log("JWT Token (before):", token);
      console.log("User object:", user);

      if (account) {
        token.accessToken = account.access_token; 
      }

      if (user) {
        // Find user in database and add ID to token
        const dbUser = await prismaClient.user.findUnique({
          where: { email: user.email! }
        });

        if (dbUser) {
          token.id = dbUser.id;
          console.log("Added user ID to token:", dbUser.id);
        }
      }

      console.log("JWT Token (after):", token);
      return token;
    },

async session({ session, token }) {
  console.log("=== SESSION CALLBACK ===");
  console.log("Session (before):", session);
  console.log("Token:", token);

  if (token.id) {
    session.user.id = token.id as string;
  }

  if (token.accessToken) {
    session.accessToken = token.accessToken as string; 
  }

  console.log("Session (after):", session);
  return session;
}

  },
}

const handler = NextAuth(authOptions);

// Export authOptions so it can be used in your API routes
export { authOptions };
export { handler as GET, handler as POST };
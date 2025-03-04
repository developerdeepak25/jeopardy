import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("signIn", user);

      try {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
        console.log("user exists info", dbUser);
        // throw new Error("User already exists"); // Throw error instead of returning a URL

        if (!dbUser) {
          // if user does not exist, create a new user and let signin
          const role =
            user.email === process.env.ADMIN_EMAIL ? "ADMIN" : "USER";
          await prisma.user.create({
            data: {
              role: role,
              email: user.email,
              name: user.name,
              image: user.image ? user.image : "",
            },
          });
        }
        user.role = dbUser?.role;

        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        // return `/login?error=Something went wrong`; // Redirect with error
        // throw new Error("Something went wrong"); // Throw a readable error
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Now user.role exists because we added it in `signIn`
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // Attach role to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

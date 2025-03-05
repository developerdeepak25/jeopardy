import { PrismaClient } from "@prisma/client";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
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
            email: user.email!,
          },
        });
        console.log("user exists info", dbUser);
        // throw new Error("User already exists"); // Throw error instead of returning a URL

        if (!dbUser) {
          // if user does not exist, create a new user and let signin
          const role = user.email === process.env.ADMIN_MAIL ? "ADMIN" : "USER";
          console.log(role);

          // ! Role should only be passes if user isVerified else not atlest for the ADMIN
          const createdUser = await prisma.user.create({
            data: {
              role: role,
              email: user.email!,
              name: user.name!,
              image: user.image ? user.image : "",
            },
          });
          console.log("user created info", createdUser);
          user.role = createdUser.role;
          user.id = createdUser.id;
        } else {
          // Use dbUser data for existing users
          user.role = dbUser.role;
          user.id = dbUser.id;
        }
        

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
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        console.log("token.role", token.role);
        session.user.role = token.role; // Attach role to session
        session.user.id = token.id;
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

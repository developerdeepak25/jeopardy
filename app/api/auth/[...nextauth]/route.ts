import { PrismaClient } from "@prisma/client/extension";
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
    async signin({ user }) {
      try {
        const userExists = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
        console.log("userExists)", userExists);

        // if user does not exist, create a new user and let signin
        if (!userExists) {
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
          return true;
        } else {
          //if user does exist then throw an error and does not allow siginin
          console.log("User already exists");
          throw new Error("User already exists");
        }
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login", // Custom login page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

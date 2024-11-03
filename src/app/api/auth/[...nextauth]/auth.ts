import { db } from "@/db";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const dbUser = await db.user.findUnique({
        where: { email: session?.user?.email! },
      });

      if (dbUser && session.user) {
        session.user.id = dbUser.id;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        const dbUser = await db.user.findFirst({
          where: { email: user.email! },
        });

        if (!dbUser) {
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              avatar: user.image!,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
};

import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log({
        session,
        token,
      });

      const dbUser = await db.user.findUnique({
        where: { email: session?.user?.email! },
      });

      if (dbUser && session.user) {
        session.user.id = dbUser.id;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      console.log({
        user,
        account,
        profile,
      });
      const dbUser = await db.user.findFirst({
        where: { email: user.email! },
      });

      if (!dbUser) {
        await db.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            // avatar: user.image!,
            // role: "ADMIN",
          },
        });
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
};

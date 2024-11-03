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
      console.log({
        session,
        token,
      });
      if (session.user?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email },
          include: {
            workspace: {
              include: {
                workspace: true,
              },
            },
          },
        });

        if (dbUser && session.user) {
          session.user.id = dbUser.id;

          session.user.workspaceId = dbUser.workspace[0]?.workspaceId;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      console.log({
        user,
        account,
        profile,
      });

      try {
        const dbUser = await db.user.findFirst({
          where: { email: user.email },
        });

        if (!dbUser) {
          const newUser = await db.user.create({
            data: {
              email: user.email,
              name: user.name || "User",
              avatar: user.image || "",
            },
          });

          await db.workspace.create({
            data: {
              name: "My Workspace",
              members: {
                create: {
                  userId: newUser.id,
                  role: "OWNER",
                },
              },
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

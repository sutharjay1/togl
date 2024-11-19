import { db } from "@/db";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
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
            projects: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (dbUser && session.user) {
          session.user.id = dbUser.id;

          console.log({
            dbUser,
          });

          session.user.projectId = dbUser.projects[0]?.id;
          console.log({
            session,
          });
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
        const dbUser = await db.user.findUnique({
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

          await db.project.create({
            data: {
              name: "My Project",
              users: {
                connect: {
                  id: newUser.id,
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

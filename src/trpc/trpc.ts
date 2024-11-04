import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.context().create({
  isServer: true,
});

const isAuth = t.middleware(async ({ next }) => {
  const session = await getServerSession(authOptions);

  return next({ ctx: { session } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);

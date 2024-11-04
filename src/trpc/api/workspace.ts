import { z } from "zod";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "../trpc";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

const getWorkspaceByIdSchema = z.object({
  workspaceId: z.string(),
});

const addUserToWorkspaceSchema = z.object({
  workspaceId: z.string(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

const removeUserFromWorkspaceSchema = z.object({
  workspaceId: z.string(),
});

export const workspaceRouter = router({
  create: privateProcedure
    .input(createWorkspaceSchema)
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const user = await db.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const newWorkspace = await db.workspace.create({
          data: {
            name,
            members: {
              create: {
                userId: user.id,
                role: "ADMIN",
              },
            },
          },
          include: {
            members: true,
            projects: true,
            _count: true,
          },
        });

        console.log({
          workspace: newWorkspace,
        });

        return {
          workspace: newWorkspace,
          refreshToken: user.refreshToken,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "An error occurred while creating workspace.",
          });
        }
      }
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    try {
      const userId = session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be logged in",
        });
      }
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          workspace: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const workspaces = user.workspace.map((uw) => uw.workspace);

      return {
        workspaces,
        refreshToken: user.refreshToken,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching workspaces.",
        });
      }
    }
  }),

  getById: privateProcedure
    .input(getWorkspaceByIdSchema)
    .query(async ({ input, ctx }) => {
      const { workspaceId } = input;

      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const userWorkspace = await db.userWorkspace.findUnique({
          where: {
            userId_workspaceId: {
              userId: userId!,
              workspaceId,
            },
          },
          include: {
            user: true,
            workspace: true,
          },
        });

        if (!userWorkspace) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workspace not found or user does not have access",
          });
        }

        return {
          workspace: userWorkspace.workspace,
          refreshToken: userWorkspace.user.refreshToken,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          });
        }
      }
    }),

  addUser: privateProcedure
    .input(addUserToWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, role } = input;

      const { session } = ctx;
      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }
        const user = await db.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const workspace = await db.workspace.findUnique({
          where: { id: workspaceId },
        });

        if (!workspace) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workspace not found",
          });
        }

        const userWorkspace = await db.userWorkspace.create({
          data: {
            userId,
            workspaceId,
            role,
          },
        });

        return userWorkspace;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "An error occurred while adding user to workspace.",
          });
        }
      }
    }),

  removeUser: privateProcedure
    .input(removeUserFromWorkspaceSchema)
    .mutation(async ({ input, ctx }) => {
      const { workspaceId } = input;

      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        await db.userWorkspace.delete({
          where: {
            userId_workspaceId: {
              userId,
              workspaceId,
            },
          },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "An error occurred while removing user from workspace.",
          });
        }
      }
    }),

  getProjects: privateProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ input }) => {
      const { workspaceId } = input;

      try {
        const workspace = await db.workspace.findUnique({
          where: { id: workspaceId },
          include: {
            projects: true,
          },
        });

        if (!workspace) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workspace not found",
          });
        }

        return workspace.projects;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          });
        }
      }
    }),

  getMembers: privateProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { workspaceId } = input;

      try {
        const { session } = ctx;

        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const workspace = await db.workspace.findUnique({
          where: { id: workspaceId },
          include: {
            members: {
              where: {
                userId: userId,
              },
              include: {
                user: true,
              },
            },
          },
        });

        if (!workspace) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workspace not found",
          });
        }

        return workspace.members;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          });
        }
      }
    }),
});

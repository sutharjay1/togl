import { db } from "../../db";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const createTokenSchema = z.object({
  isEnabled: z.boolean(),
  rules: z.string().optional(),
  projectId: z.string(),
});

export const getTokenSchema = z.object({
  projectId: z.string(),
  workspaceId: z.string(),
});

export const getTokenByIdSchema = z.object({
  tokenId: z.string(),
  workspaceId: z.string(),
});

export const updateTokenSchema = z.object({
  isEnabled: z.boolean(),
  rules: z.string().optional(),
  projectId: z.string(),
  tokenId: z.string(),
});

export const deleteTokenSchema = z.object({
  tokenId: z.string(),
  workspaceId: z.string(),
});

export const tokenRouter = router({
  create: privateProcedure
    .input(createTokenSchema)
    .mutation(async ({ input, ctx }) => {
      const { isEnabled, rules, projectId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        // await verifyUserWorkspaceAccess(userId, projectId);

        const result = await db.token.create({
          data: {
            isEnabled,
            rules,
            projectId,
          },
          include: {
            Project: {
              include: {
                workspace: true,
                apiKeys: true,
                token: true,
                _count: true,
              },
            },
          },
        });
        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while creating token.",
        });
      }
    }),

  getTokens: privateProcedure
    .input(getTokenSchema)
    .query(async ({ input, ctx }) => {
      const { projectId, workspaceId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        await verifyUserWorkspaceAccess(userId, workspaceId);
        const result = await db.token.findMany({
          where: {
            projectId,
          },
          orderBy: { createdAt: "desc" },
        });

        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }

        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching token.",
        });
      }
    }),

  getTokenById: privateProcedure
    .input(getTokenByIdSchema)
    .query(async ({ input, ctx }) => {
      const { tokenId, workspaceId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        await verifyUserWorkspaceAccess(userId, workspaceId);
        const result = await db.token.findUnique({
          where: { id: tokenId },
        });

        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }

        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching token.",
        });
      }
    }),

  updateToken: privateProcedure
    .input(updateTokenSchema)
    .mutation(async ({ input, ctx }) => {
      const { isEnabled, rules, projectId, tokenId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const project = await db.project.findUnique({
          where: { id: projectId },
        });

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        await verifyUserWorkspaceAccess(userId, project.workspaceId);

        const featureState = await db.token.findUnique({
          where: { id: tokenId },
        });

        if (!featureState) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }

        const result = await db.token.update({
          where: { id: tokenId },
          data: {
            isEnabled,
            rules,
          },
        });

        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while updating token.",
        });
      }
    }),

  deleteToken: privateProcedure
    .input(deleteTokenSchema)
    .mutation(async ({ input, ctx }) => {
      const { tokenId, workspaceId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        await verifyUserWorkspaceAccess(userId, workspaceId);

        const featureState = await db.token.findUnique({
          where: { id: tokenId },
        });

        if (!featureState) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }

        await db.token.delete({
          where: { id: tokenId },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while deleting token.",
        });
      }
    }),
});

async function verifyUserWorkspaceAccess(userId: string, workspaceId: string) {
  if (!workspaceId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Workspace ID is missing",
    });
  }

  const userWorkspace = await db.userWorkspace.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!userWorkspace) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have access to this workspace",
    });
  }
}

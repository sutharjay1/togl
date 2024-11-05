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
  workspaceId: z.string(),
});

export const getTokenByIdSchema = z.object({
  tokenId: z.string(),
  workspaceId: z.string(),
});

export const updateFeatureStateSchema = z.object({
  isEnabled: z.boolean(),
  rules: z.string().optional(),
  projectId: z.string(),
  tokenId: z.string(),
});

export const deleteFeatureStateSchema = z.object({
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

        await verifyUserWorkspaceAccess(userId, projectId);

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
              : "An error occurred while creating feature state.",
        });
      }
    }),

  getFeatureStates: privateProcedure
    .input(getTokenSchema)
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

        await verifyUserWorkspaceAccess(userId, workspaceId);
        const result = await db.token.findMany();
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
              : "An error occurred while fetching feature states.",
        });
      }
    }),

  getFeatureStateById: privateProcedure
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
            message: "Feature state not found",
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
              : "An error occurred while fetching feature state.",
        });
      }
    }),

  updateFeatureState: privateProcedure
    .input(updateFeatureStateSchema)
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
            message: "Feature state not found",
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
              : "An error occurred while updating feature state.",
        });
      }
    }),

  deleteFeatureState: privateProcedure
    .input(deleteFeatureStateSchema)
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
            message: "Feature state not found",
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
              : "An error occurred while deleting feature state.",
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
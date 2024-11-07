import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { db } from "../../db";
import { privateProcedure, publicProcedure, router } from "../trpc";

const createAPIKeySchema = z.object({
  name: z.string(),
  projectId: z.string(),
});

const getAPIKeysSchema = z.object({
  projectId: z.string(),
});

const getAPIKeyByIdSchema = z.object({
  projectId: z.string(),
  apiKeyId: z.string(),
});

const deleteAPIKeySchema = z.object({
  projectId: z.string(),
  apiKeyId: z.string(),
});

const validateApiKeySchema = z.object({
  apiKey: z.string(),
});

export const apiKeyRouter = router({
  create: privateProcedure
    .input(createAPIKeySchema)
    .mutation(async ({ input, ctx }) => {
      const { name, projectId } = input;

      const { session } = ctx;
      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }
        await verifyUserProjectAccess(userId!, projectId);

        const apiKey = await db.apiKey.create({
          data: {
            name,
            key: uuidv4(),
            projectId,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          include: {
            project: {
              include: {
                workspace: {
                  include: {
                    members: true,
                    projects: true,
                    _count: true,
                  },
                },
              },
            },
          },
        });

        const user = await db.user.findUnique({ where: { id: userId } });

        return {
          ...apiKey,
          accessToken: user?.refreshToken,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while creating the API key.",
        });
      }
    }),

  getAPIKeys: privateProcedure
    .input(getAPIKeysSchema)
    .query(async ({ input, ctx }) => {
      const { projectId } = input;

      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }
        await verifyUserProjectAccess(userId!, projectId);

        const user = await db.user.findUnique({ where: { id: userId } });
        const apiKeys = await db.apiKey.findMany({
          where: { projectId },
          orderBy: { createdAt: "desc" },
        });

        return {
          apiKeys,
          accessToken: user?.refreshToken,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching API keys.",
        });
      }
    }),

  getAPIKeyById: privateProcedure
    .input(getAPIKeyByIdSchema)
    .query(async ({ input, ctx }) => {
      const { projectId, apiKeyId } = input;

      try {
        const userId = ctx.session?.user.id;
        await verifyUserProjectAccess(userId!, projectId);

        const apiKey = await db.apiKey.findUnique({
          where: { id: apiKeyId },
        });

        if (!apiKey) {
          throw new Error("API Key not found");
        }

        const user = await db.user.findUnique({ where: { id: userId } });
        return {
          ...apiKey,
          accessToken: user?.refreshToken,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching API keys by ID.",
        });
      }
    }),

  deleteAPIKey: privateProcedure
    .input(deleteAPIKeySchema)
    .mutation(async ({ input, ctx }) => {
      const { projectId, apiKeyId } = input;

      try {
        const userId = ctx.session?.user.id;
        await verifyUserProjectAccess(userId!, projectId);
        await db.apiKey.delete({ where: { id: apiKeyId } });

        return;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while deleting the API key.",
        });
      }
    }),

  validateApiKey: publicProcedure
    .input(validateApiKeySchema)
    .query(async ({ input }) => {
      const { apiKey } = input;
      const key = await db.apiKey.findUnique({
        where: { key: apiKey },
      });

      if (key && key.expiresAt && key.expiresAt > new Date()) {
        return { projectId: key.projectId };
      }
      throw new Error("Invalid or expired API key");
    }),
});

async function verifyUserProjectAccess(userId: string, projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });

  if (
    !project ||
    !(await verifyUserWorkspaceAccess(userId, project.workspaceId))
  ) {
    throw new Error("User does not have access to this project");
  }
}

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

  return !!userWorkspace;
}

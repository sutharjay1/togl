import { TRPCError } from "@trpc/server";
import crypto from "crypto";
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

        const rawApiKey = generateApiKey();
        const hashedApiKey = await hashApiKey(rawApiKey);

        const apiKey = await db.apiKey.create({
          data: {
            name,
            key: hashedApiKey,
            projectId,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          include: {
            project: {
              include: {
                users: true,
                token: true,
                _count: true,
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
      const { apiKeyId } = input;

      try {
        const userId = ctx.session?.user.id;

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
    .mutation(async ({ input }) => {
      const { apiKeyId } = input;

      try {
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

function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function hashApiKey(apiKey: string): Promise<string> {
  const prefix = "sk_";
  const hash = crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("base64url")
    .replaceAll("$", "")
    .replaceAll(".", "")
    .replaceAll("/", "");
  const shortenedHash = hash.substring(0, 22);
  return prefix + shortenedHash;
}

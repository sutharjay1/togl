import { db } from "../../db";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const createTokenSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  description: z.string().optional(),
  isEnabled: z.boolean(),
  rules: z.string().optional(),
  projectId: z.string(),
});

export const getTokenSchema = z.object({
  projectId: z.string(),
});

export const getTokenByIdSchema = z.object({
  tokenId: z.string(),
});

export const updateTokenSchema = z.object({
  isEnabled: z.boolean(),
  rules: z.string().optional(),
  projectId: z.string(),
  tokenId: z.string(),
});

export const deleteTokenSchema = z.object({
  tokenId: z.string(),
});

export const tokenRouter = router({
  create: privateProcedure
    .input(createTokenSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description, isEnabled, rules, projectId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const result = await db.token.create({
          data: {
            name,
            description: description ? description : "",
            isEnabled,
            rules,
            projectId,
          },
          include: {
            Project: {
              include: {
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
      const { tokenId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

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
      const { tokenId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

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
  toggle: privateProcedure
    .input(
      z.object({
        tokenId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { tokenId } = input;
      const { session } = ctx;

      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const featureState = await db.token.findUnique({
          where: { id: tokenId },
        });

        if (!featureState) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }

        await db.token.update({
          where: { id: tokenId },
          data: {
            isEnabled: !featureState.isEnabled,
          },
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

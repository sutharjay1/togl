import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

const getProjectByIdSchema = z.object({
  projectId: z.string(),
});

export const updateProjectSchema = z.object({
  projectId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

const deleteProjectSchema = z.object({
  projectId: z.string(),
});

const checkProjectNameExistsSchema = z.object({
  name: z.string(),
});

export const projectRouter = router({
  create: privateProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description } = input;

      const { session } = ctx;
      try {
        const userId = session?.user.id;

        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const project = await db.project.create({
          data: {
            name,
            description,
            users: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return project;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while creating the project.",
        });
      }
    }),

  getProjects: privateProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    try {
      const userId = session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be logged in",
        });
      }

      const projects = await db.project.findMany({
        where: {
          id: session.user.projectId,
        },
        include: {
          token: true,
          _count: true,
          users: true,
        },
      });

      return projects;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching projects.",
      });
    }
  }),

  getProjectById: privateProcedure
    .input(getProjectByIdSchema)
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

        const project = await db.project.findFirst({
          where: {
            id: projectId,
            users: { some: { id: userId } },
          },
        });

        if (!project)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });

        return project;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching project by ID.",
        });
      }
    }),

  updateProject: privateProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { projectId, name, description } = input;

      const { session } = ctx;
      try {
        const userId = session?.user.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const project = await db.project.update({
          where: {
            id: projectId,
            users: { some: { id: userId } },
          },
          data: {
            name,
            description,
          },
        });

        return project;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while updating the project.",
        });
      }
    }),

  deleteProject: privateProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input, ctx }) => {
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

        await db.project.delete({
          where: {
            id: projectId,
            users: { some: { id: userId } },
          },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while deleting the project.",
        });
      }
    }),

  checkProjectNameExists: privateProcedure
    .input(checkProjectNameExistsSchema)
    .query(async ({ input, ctx }) => {
      const { name } = input;

      const { session } = ctx;
      const id = session?.user.id;
      try {
        const project = await db.project.findFirst({
          where: {
            name,
            users: { some: { id } },
          },
        });

        return { exists: !!project };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while checking project name.",
        });
      }
    }),
});

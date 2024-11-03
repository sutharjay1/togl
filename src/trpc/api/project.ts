import { z } from "zod";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "../trpc";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),

  description: z.string().optional(),
  workspaceId: z.string(),
});

const getProjectsSchema = z.object({
  workspaceId: z.string(),
});

const getProjectByIdSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string(),
});

const updateProjectSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

const deleteProjectSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string(),
});

const checkProjectNameExistsSchema = z.object({
  name: z.string(),
  workspaceId: z.string(),
});

export const projectRouter = router({
  create: privateProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description, workspaceId } = input;

      const { session } = ctx;
      try {
        const userId = session?.user.id;

        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }
        const userWorkspace = await verifyUserWorkspaceAccess(
          userId!,
          workspaceId,
        );

        const project = await db.project.create({
          data: {
            name,
            description,
            workspaceId,
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

  getProjects: privateProcedure
    .input(getProjectsSchema)
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
        await verifyUserWorkspaceAccess(userId!, workspaceId);

        const projects = await db.project.findMany({
          where: { workspaceId },
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
      const { workspaceId, projectId } = input;

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

        const project = await db.project.findFirst({
          where: {
            id: projectId,
            workspaceId,
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
      const { workspaceId, projectId, name, description } = input;

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

        const project = await db.project.update({
          where: {
            id: projectId,
            workspaceId,
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
      const { workspaceId, projectId } = input;

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

        await db.project.delete({
          where: {
            id: projectId,
            workspaceId,
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
    .query(async ({ input }) => {
      const { name, workspaceId } = input;

      try {
        const project = await db.project.findFirst({
          where: {
            name,
            workspaceId,
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

async function verifyUserWorkspaceAccess(userId: string, workspaceId: string) {
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

  return userWorkspace;
}

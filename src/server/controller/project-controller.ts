import type { Request, Response } from "express";

import { db } from "../../db";
import type { UserOrganization } from "@prisma/client";

export class ProjectController {
  private async verifyUserOrganizationAccess(
    userId: string,
    organizationId: string,
  ): Promise<UserOrganization> {
    const userOrg = await db.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      include: {
        user: {
          select: {
            refreshToken: true,
          },
        },
      },
    });

    if (!userOrg) {
      throw new Error("User does not have access to this organization");
    }

    return userOrg;
  }

  async create(req: Request, res: Response) {
    try {
      const { name, userId, description, organizationId } = req.body;

      if (!name || !userId || !organizationId) {
        return res.status(400).json({
          message: "Missing required fields: name, userId, or organizationId",
        });
      }

      const userOrg = await this.verifyUserOrganizationAccess(
        userId,
        organizationId,
      );
      const user = await db.user.findUnique({
        where: { id: userOrg.userId },
      });

      const project = await db.project.create({
        data: {
          name,
          description,
          organizationId,
        },
        include: {
          organization: true,
          _count: true,
          apiKeys: true,
          flags: true,
        },
      });

      if (user?.refreshToken) {
        res.setHeader("Authorization", `Bearer ${user.refreshToken}`);
      }

      return res
        .status(201)
        .json({ ...project, accessToken: user?.refreshToken });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Project creation failed",
      });
    }
  }

  async getProjects(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.body;

      if (!userId || !organizationId) {
        return res.status(400).json({
          message: "Missing required fields: userId or organizationId",
        });
      }

      const userOrg = await this.verifyUserOrganizationAccess(
        userId,
        organizationId,
      );
      const user = await db.user.findUnique({
        where: { id: userOrg.userId },
      });

      const projects = await db.project.findMany({
        where: { organizationId },
      });

      if (user?.refreshToken) {
        res.setHeader("Authorization", `Bearer ${user.refreshToken}`);
      }

      return res
        .status(200)
        .json({ projects, accessToken: user?.refreshToken });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message,
        details: "Failed to fetch projects",
      });
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.body;
      const { projectId } = req.params;

      if (!userId || !organizationId || !projectId) {
        return res.status(400).json({
          message:
            "Missing required fields: userId, organizationId, or projectId",
        });
      }

      const userOrg = await this.verifyUserOrganizationAccess(
        userId,
        organizationId,
      );
      const user = await db.user.findUnique({
        where: { id: userOrg.userId },
      });

      const project = await db.project.findFirst({
        where: {
          id: projectId,
          organizationId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      if (user?.refreshToken) {
        res.setHeader("Authorization", `Bearer ${user.refreshToken}`);
      }

      return res
        .status(200)
        .json({ ...project, accessToken: user?.refreshToken });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
        details: "Project not found or access denied",
      });
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const { userId, organizationId, name, description } = req.body;
      const { projectId } = req.params;

      if (!userId || !organizationId || !projectId) {
        return res.status(400).json({
          message:
            "Missing required fields: userId, organizationId, or projectId",
        });
      }

      const userOrg = await this.verifyUserOrganizationAccess(
        userId,
        organizationId,
      );
      const user = await db.user.findUnique({
        where: { id: userOrg.userId },
      });

      const project = await db.project.update({
        where: {
          id: projectId,
          organizationId,
        },
        data: {
          name,
          description,
        },
      });

      if (user?.refreshToken) {
        res.setHeader("Authorization", `Bearer ${user.refreshToken}`);
      }

      return res
        .status(200)
        .json({ ...project, accessToken: user?.refreshToken });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Project update failed",
      });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.body;
      const { projectId } = req.params;

      if (!userId || !organizationId || !projectId) {
        return res.status(400).json({
          message:
            "Missing required fields: userId, organizationId, or projectId",
        });
      }

      await this.verifyUserOrganizationAccess(userId, organizationId);

      await db.project.delete({
        where: {
          id: projectId,
          organizationId,
        },
      });

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Project deletion failed",
      });
    }
  }

  async checkProjectNameExists(req: Request, res: Response) {
    try {
      const { name, organizationId } = req.body;

      if (!name || !organizationId) {
        return res.status(400).json({
          message: "Missing required fields: name or organizationId",
        });
      }

      const project = await db.project.findFirst({
        where: {
          name: name,
          organizationId: organizationId,
        },
      });

      return res.status(200).json({ exists: !!project });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Name check failed",
      });
    }
  }
}

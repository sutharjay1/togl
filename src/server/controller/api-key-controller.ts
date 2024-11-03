import type { Request, Response } from "express";
import { db } from "../../db";
import { v4 as uuidv4 } from "uuid";
import type { ApiKey, Project, UserOrganization } from "@prisma/client";

export class APIKeyController {
  async createAPIKey(req: Request, res: Response) {
    try {
      const { name, projectId, userId } = req.body;

      await this.verifyUserProjectAccess(userId, projectId);

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
              organization: {
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

      res.status(201).json({
        ...apiKey,
        accessToken: user?.refreshToken,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        details: "Failed to create API Key",
      });
    }
  }

  async getAPIKeys(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { userId } = req.body;

      await this.verifyUserProjectAccess(userId, projectId);

      const user = await db.user.findUnique({ where: { id: userId } });
      const apiKeys = await db.apiKey.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(
        apiKeys.map((apiKey) => ({
          ...apiKey,
          accessToken: user?.refreshToken,
        })),
      );
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        details: "Failed to get API Keys",
      });
    }
  }

  async getAPIKeyById(req: Request, res: Response) {
    try {
      const { projectId, apiKeyId } = req.params;
      const { userId } = req.body;

      await this.verifyUserProjectAccess(userId, projectId);

      const apiKey = await db.apiKey.findUnique({
        where: { id: apiKeyId },
      });

      if (!apiKey) {
        res.status(404).json({ error: "API Key not found" });
        return;
      }

      const user = await db.user.findUnique({ where: { id: userId } });
      res.status(200).json({
        ...apiKey,
        accessToken: user?.refreshToken,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        details: "Failed to get API Key",
      });
    }
  }

  async deleteAPIKey(req: Request, res: Response) {
    try {
      const { projectId, apiKeyId } = req.params;
      const { userId } = req.body;

      await this.verifyUserProjectAccess(userId, projectId);
      await db.apiKey.delete({ where: { id: apiKeyId } });

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        details: "Failed to delete API Key",
      });
    }
  }

  async validateApiKey(req: Request, res: Response, next: any) {
    const { apiKey } = req.headers;
    if (!apiKey) {
      return res.status(403).json({ error: "API key required" });
    }
    try {
      const key = await db.apiKey.findUnique({
        where: { key: apiKey as string },
      });
      if (key && key.expiresAt && key.expiresAt > new Date()) {
        req.body.projectId = key.projectId;
        return next();
      }
      res.status(403).json({ error: "Invalid or expired API key" });
    } catch (error) {
      res.status(500).json({ error: "Could not validate API key" });
    }
  }

  private async verifyUserProjectAccess(
    userId: string,
    projectId: string,
  ): Promise<Project> {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { organization: true },
    });

    if (
      !project ||
      !(await this.verifyUserOrganizationAccess(userId, project.organizationId))
    ) {
      throw new Error("User does not have access to this project");
    }
    return project;
  }

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
    });

    if (!userOrg) {
      throw new Error("User does not have access to this organization");
    }
    return userOrg;
  }
}

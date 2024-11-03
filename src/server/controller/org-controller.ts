import type { Request, Response } from "express";
import { db } from "../../db";

export class OrgController {
  async create(req: Request, res: Response) {
    try {
      const { name, userId } = req.body;

      if (!name || !userId) {
        throw new Error("Name or userId not found");
      }

      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const result = await db.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name,
            members: {
              create: {
                userId,
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

        return org;
      });

      res.setHeader("Authorization", `Bearer ${user.refreshToken!}`);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        details: "Registration failed",
      });
    }
  }

  async getOrgs(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new Error("User not found");
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const organizations = user.organizations.map((uo) => uo.organization);

      res.setHeader("Authorization", `Bearer ${user.refreshToken!}`);
      res.status(200).json({ organizations });
    } catch (error: any) {
      res.status(401).json({
        message: error.message,
        details: "Login failed",
      });
    }
  }

  async getOrgById(req: Request, res: Response) {
    try {
      const { userId, orgId } = req.body;

      if (!userId) {
        throw new Error("User not found");
      }

      if (!orgId) {
        throw new Error("Org not found");
      }

      const userOrg = await db.userOrganization.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId: orgId,
          },
        },
        include: {
          user: true,
          organization: true,
        },
      });

      if (!userOrg) {
        throw new Error("Organization not found or user does not have access");
      }

      res.setHeader("Authorization", `Bearer ${userOrg.user.refreshToken!}`);
      res.status(200).json(userOrg.organization);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async addUserToOrg(req: Request, res: Response) {
    try {
      const { userId, organizationId, role = "MEMBER" } = req.body;

      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const org = await db.organization.findUnique({
        where: { id: organizationId },
      });

      if (!org) {
        throw new Error("Organization not found");
      }

      const userOrg = await db.userOrganization.create({
        data: {
          userId,
          organizationId,
          role,
        },
      });

      res.status(201).json(userOrg);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeUserFromOrg(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.body;

      await db.userOrganization.delete({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
      });

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

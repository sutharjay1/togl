import type { Request, Response } from "express";
import { db } from "../../db";
import type { UserOrganization } from "@prisma/client";

export class FeatureStateController {
  private async verifyUserOrganizationAccess(
    userId: string,
    organizationId: string,
  ) {
    try {
      if (!organizationId) throw new Error("Organization ID is missing");

      const userOrg = await db.userOrganization.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
      });

      return userOrg;
    } catch (error) {
      throw new Error("User does not have access to this organization");
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { isEnabled, rules, userId, organizationId, projectId } = req.body;

      if (!userId || !organizationId || !projectId) {
        return res.status(400).json({
          message:
            "Missing required fields: userId or organizationId or projectId",
        });
      }

      await this.verifyUserOrganizationAccess(userId, organizationId);

      const result = await db.featureState.create({
        data: {
          isEnabled,
          rules,
          projectId,
        },
        include: {
          Project: {
            include: {
              organization: true,
              apiKeys: true,
              flags: true,
              _count: true,
            },
          },
        },
      });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Feature state creation failed",
      });
    }
  }

  async getFeatureStates(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.body;

      if (!userId || !organizationId) {
        return res.status(400).json({
          message: "Missing required fields: userId or organizationId",
        });
      }

      await this.verifyUserOrganizationAccess(userId, organizationId);
      const result = await db.featureState.findMany();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Failed to fetch feature states",
      });
    }
  }

  async getFeatureStateById(req: Request, res: Response) {
    try {
      const { featureStateId } = req.params;
      const { userId, organizationId } = req.body;

      if (!featureStateId) {
        return res.status(400).json({
          message: "Missing required field: featureStateId",
        });
      }

      await this.verifyUserOrganizationAccess(userId, organizationId);
      const result = await db.featureState.findUnique({
        where: { id: featureStateId },
      });
      if (!result)
        return res
          .status(404)
          .json({ message: "Feature state not found while getting" });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
        details: "Feature state not found while getting",
      });
    }
  }

  async updateFeatureState(req: Request, res: Response) {
    try {
      const { isEnabled, rules, userId, projectId, featureStateId } = req.body;

      if (!userId || !projectId) {
        return res.status(400).json({
          message: "Missing required fields: userId or projectId  ",
        });
      }

      if (!featureStateId) {
        return res.status(400).json({
          message: "Missing required field: featureStateId",
        });
      }

      const project = await db.project.findUnique({
        where: { id: projectId },
      });

      await this.verifyUserOrganizationAccess(
        userId,
        project?.organizationId as string,
      );

      const featureState = await db.featureState.findUnique({
        where: { id: featureStateId },
      });

      if (!featureState) {
        return res.status(404).json({
          message: "Feature state not found while updating",
        });
      }

      const result = await db.featureState.update({
        where: { id: featureStateId },
        data: {
          isEnabled,
          rules,
        },
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error updating feature state:", error);

      return res.status(400).json({
        message: error.message,
        details: "Feature state update failed",
      });
    }
  }

  async deleteFeatureState(req: Request, res: Response) {
    try {
      const { featureStateId } = req.params;
      const { userId, organizationId } = req.body;

      if (!featureStateId) {
        return res.status(400).json({
          message: "Missing required field: featureStateId",
        });
      }

      await this.verifyUserOrganizationAccess(userId, organizationId);
      const featureState = await db.featureState.findUnique({
        where: { id: featureStateId },
      });
      if (!featureState)
        throw new Error("Feature state not found while deleting");

      await db.featureState.delete({
        where: { id: featureStateId },
      });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        details: "Feature state deletion failed",
      });
    }
  }
}

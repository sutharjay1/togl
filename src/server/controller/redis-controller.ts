import type { Request, Response } from "express";
import Redis from "ioredis";
import { db } from "../../db";
import dotenv from "dotenv";
import type { FeatureState } from "@prisma/client";

dotenv.config();
const redis = new Redis(process.env.REDIS_URL!);

export class RedisCacheController {
  private generateCacheKey(projectId: string): string {
    return `flags:${projectId}`;
  }

  private generateFeatureKey(projectId: string, flagId: string): string {
    return `flag:${projectId}:${flagId}`;
  }

  private async invalidateProjectCache(projectId: string): Promise<void> {
    const cacheKey = this.generateCacheKey(projectId);
    await redis.del(cacheKey);
  }

  private async invalidateFeatureCache(
    projectId: string,
    flagId: string,
  ): Promise<void> {
    const featureKey = this.generateFeatureKey(projectId, flagId);
    await redis.del(featureKey);
  }

  async getFeatureFlags(req: Request, res: Response) {
    const { projectId, apiKey } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "ProjectId is required" });
    }

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required" });
    }

    const cacheKey = this.generateCacheKey(projectId);

    try {
      const cachedFlags = await redis.get(cacheKey);

      if (cachedFlags) {
        const parsedFlags: FeatureState[] = JSON.parse(cachedFlags);
        return res.json(parsedFlags);
      }

      const project = await db.project.findUnique({
        where: { id: projectId },
        include: { flags: true },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const enrichedFlags = Array.isArray(project.flags)
        ? project.flags.map((flag) => ({
            ...flag,
            projectId: project.id,
          }))
        : [];

      if (enrichedFlags.length > 0) {
        if (!cachedFlags || JSON.stringify(enrichedFlags) !== cachedFlags) {
          await redis.del(cacheKey);

          await redis.set(cacheKey, JSON.stringify(enrichedFlags), "EX", 3600);

          // for (const flag of enrichedFlags) {
          // 	await redis.set(
          // 		this.generateFeatureKey(projectId, flag.id),
          // 		JSON.stringify(flag),
          // 		'EX',
          // 		3600
          // 	);
          // }
        }
      }

      res.json(enrichedFlags);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      res.status(500).json({ error: "Could not fetch feature flags" });
    }
  }

  async toggleFeatureFlag(req: Request, res: Response) {
    const { flagId, projectId } = req.body;

    if (!flagId || !projectId) {
      return res.status(400).json({
        error: "FlagId and projectId are required",
      });
    }

    try {
      const result = await db.$transaction(async (prisma) => {
        const flag = await prisma.featureState.findUnique({
          where: { id: flagId },
        });

        if (!flag) {
          throw new Error("Feature flag not found");
        }

        const updatedFlag = await prisma.featureState.update({
          where: { id: flagId },
          data: { isEnabled: !flag.isEnabled },
          include: {
            Project: true,
          },
        });

        return updatedFlag;
      });

      const updatedFlag = result;

      await this.invalidateProjectCache(projectId);
      await this.invalidateFeatureCache(projectId, updatedFlag.id);

      const cachedFlags = await redis.get(this.generateCacheKey(projectId));
      if (cachedFlags) {
        const flags: FeatureState[] = JSON.parse(cachedFlags);
        const updatedFlags = flags.map((f) =>
          f.id === updatedFlag.id
            ? { ...f, isEnabled: updatedFlag.isEnabled }
            : f,
        );

        if (JSON.stringify(updatedFlags) !== cachedFlags) {
          await redis.set(
            this.generateCacheKey(projectId),
            JSON.stringify(updatedFlags),
            "EX",
            3600,
          );
        }
      } else {
        await this.invalidateProjectCache(projectId);
      }

      await redis.set(
        this.generateFeatureKey(projectId, updatedFlag.id),
        JSON.stringify(updatedFlag),
        "EX",
        3600,
      );

      res.json(updatedFlag);
    } catch (error) {
      console.error("Error toggling feature flag:", error);
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({
          error: "Could not toggle feature flag",
        });
      }
    }
  }

  async clearCache(req: Request, res: Response) {
    const { projectId } = req.params;
    try {
      await this.invalidateProjectCache(projectId);
      res.json({ message: "Cache cleared successfully" });
    } catch (error) {
      console.error("Error clearing cache:", error);
      res.status(500).json({ error: "Could not clear cache" });
    }
  }
}

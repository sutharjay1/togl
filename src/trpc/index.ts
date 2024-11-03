import { apiKeyRouter } from "./api/api-key";
import { featureStateRouter } from "./api/feature";
import { projectRouter } from "./api/project";
import { workspaceRouter } from "./api/workspace";
import { router } from "./trpc";

export const appRouter = router({
  workspace: workspaceRouter,
  project: projectRouter,
  feature: featureStateRouter,
  apiKey: apiKeyRouter,
});

export type AppRouter = typeof appRouter;

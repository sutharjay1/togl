import { apiKeyRouter } from "./api/api-key";
import { tokenRouter } from "./api/token";
import { projectRouter } from "./api/project";
import { router } from "./trpc";

export const appRouter = router({
  project: projectRouter,
  token: tokenRouter,
  apiKey: apiKeyRouter,
});

export type AppRouter = typeof appRouter;

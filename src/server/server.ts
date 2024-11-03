import dotenv from "dotenv";
import express from "express";

import { RedisCacheController } from "./controller/redis-controller";

import { apiKeyRouter } from "./route/api-key-route";
import { featureStateRouter } from "./route/feature-state-route";
import { orgRouter } from "./route/org-route";
import { projectRouter } from "./route/project-route";

import { authMiddleware } from "./middleware/auth.middleware";

dotenv.config();

const app = express();

const redisCacheController = new RedisCacheController();

const configureMiddleware = (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const configureRoutes = (app: express.Application) => {
  const protectedRoutes = [
    { path: "/api/org", router: orgRouter },
    { path: "/api/project", router: projectRouter },
    { path: "/api/key", router: apiKeyRouter },
    { path: "/api/feature-state", router: featureStateRouter },
  ];

  protectedRoutes.forEach(({ path, router }) => {
    app.use(
      path,
      async (req, res, next) => {
        await authMiddleware(req, res, next);
      },
      router,
    );
  });

  app.use("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.post(
    "/api/redis",

    (req, res) => {
      redisCacheController.getFeatureFlags(req, res);
    },
  );

  app.put("/api/redis", (req, res) => {
    redisCacheController.toggleFeatureFlag(req, res);
  });
};

const initializeApp = () => {
  configureMiddleware(app);

  configureRoutes(app);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initializeApp();

export default app;

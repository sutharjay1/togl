import { Router } from "express";
import { APIKeyController } from "../controller/api-key-controller";

const router = Router();
const apiKeyController = new APIKeyController();

router.post("/", (req, res) => apiKeyController.createAPIKey(req, res));
router.use(apiKeyController.validateApiKey);

router.get("/:projectId", (req, res) => apiKeyController.getAPIKeys(req, res));

router.get("/:projectId/:apiKeyId", (req, res) =>
  apiKeyController.getAPIKeyById(req, res),
);

router.delete("/:projectId/:apiKeyId", (req, res) =>
  apiKeyController.deleteAPIKey(req, res),
);

export { router as apiKeyRouter };

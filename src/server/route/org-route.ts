import { Router } from "express";
import { OrgController } from "../controller/org-controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const orgController = new OrgController();

router.post(
  "/",
  async (req, res, next) => {
    await authMiddleware(req, res, next);
  },
  (req, res) => {
    orgController.create(req, res);
  },
);

router.get(
  "/",
  async (req, res, next) => {
    await authMiddleware(req, res, next);
  },
  (req, res) => {
    orgController.getOrgs(req, res);
  },
);

router.get(
  "/:organizationId",
  async (req, res, next) => {
    await authMiddleware(req, res, next);
  },
  (req, res) => {
    orgController.getOrgById(req, res);
  },
);

router.post(
  "/:organizationId/members",
  async (req, res, next) => {
    await authMiddleware(req, res, next);
  },
  (req, res) => {
    orgController.addUserToOrg(req, res);
  },
);

router.delete(
  "/:organizationId/members/:userId",
  async (req, res, next) => {
    await authMiddleware(req, res, next);
  },
  (req, res) => {
    orgController.removeUserFromOrg(req, res);
  },
);

export { router as orgRouter };

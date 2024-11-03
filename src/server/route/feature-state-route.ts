import { Router } from "express";
import { FeatureStateController } from "../controller/feature-state-controller";

const router = Router();
const featureStateController = new FeatureStateController();

router.post("/", (req, res) => {
  featureStateController.create(req, res);
});

router.post("/list", (req, res) => {
  featureStateController.getFeatureStates(req, res);
});

router.post("/:featureStateId", (req, res) => {
  featureStateController.getFeatureStateById(req, res);
});

router.put("/update", (req, res) => {
  featureStateController.updateFeatureState(req, res);
});

router.delete("/:featureStateId", (req, res) => {
  featureStateController.deleteFeatureState(req, res);
});

export { router as featureStateRouter };

import { Router } from "express";
import { ProjectController } from "../controller/project-controller";

const router = Router();
const projectController = new ProjectController();

router.post("/", (req, res) => {
  projectController.create(req, res);
});

router.get("/", (req, res) => {
  projectController.getProjects(req, res);
});

router.get("/check-name", (req, res) => {
  projectController.checkProjectNameExists(req, res);
});

router.get("/:projectId", (req, res) => {
  projectController.getProjectById(req, res);
});

router.put("/:projectId", (req, res) => {
  projectController.updateProject(req, res);
});

router.delete("/:projectId", (req, res) => {
  projectController.deleteProject(req, res);
});

export { router as projectRouter };

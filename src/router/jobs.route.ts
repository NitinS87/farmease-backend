/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import JobsController from "$/controller/jobs.controller";
import { authMiddleware } from "$/middleware/auth.middleware";

const router = Router();

router.get("/all", JobsController.getJobs);
router.post("/", authMiddleware, JobsController.createJob);
router.get("/:id", JobsController.getJob);
router.put("/:id", authMiddleware, JobsController.updateJob);
router.delete("/:id", JobsController.deleteJob);
router.post("/:id/apply", JobsController.applyJob);

export default router;

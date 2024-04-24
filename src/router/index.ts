import express from "express";
import jobsRoute from "$/router/jobs.route";
import userRoute from "$/router/user.route";
const router = express.Router();

// Create a health check route
router.get("/health", (_req, res) => {
  res.status(200).json({ message: "API is healthy" });
});

// use a job route
router.use("/jobs", jobsRoute);
router.use("/user", userRoute);

export default router;

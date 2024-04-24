import { applyJobSchema, createJobSchema, updateJobSchema } from "$/utils/types";
import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "$/config/prisma.config";
import { ApplicationStatus, Status } from "@prisma/client";

const createJob = async (req: Request, res: Response) => {
  createJobSchema.parse(req.body);

  const safeBody = createJobSchema.safeParse({
    ...req.body,
    userId: req.user?.id,
  });
  if (!safeBody.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: safeBody.error });
  }

  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  const result = await prisma.job.create({
    data: {
      ...safeBody.data,
      userId: req.user.id,
      status: Status.PENDING,
    },
  });
  res.status(StatusCodes.CREATED).json({ message: "Job created", job_id: result.id });
};

const getJobs = async (req: Request, res: Response) => {
  // Get all jobs
  // req may contain query params to filter jobs
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  // Build the where clause dynamically based on the query parameters
  const where = Object.keys(req.query)
    .filter((key) => key !== "limit" && key !== "offset") // Exclude limit and offset
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: req.query[key],
      };
    }, {});

  const jobs = await prisma.job.findMany({
    skip: offset,
    take: limit,
    where,
  });

  res.status(StatusCodes.OK).json({ message: "Jobs retrieved", jobs });
};

const getJob = async (req: Request, res: Response) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  res.status(StatusCodes.OK).json({ message: "Job retrieved", job });
};

const updateJob = async (req: Request, res: Response) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
  }

  updateJobSchema.parse(req.body);

  const safeBody = createJobSchema.safeParse({
    ...req.body,
    userId: req.user?.id,
  });

  if (!safeBody.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: safeBody.error });
  }

  const result = await prisma.job.update({
    where: { id: req.params.id },
    data: safeBody.data,
    select: { id: true },
  });
  res.status(StatusCodes.OK).json({ message: "Job updated", job_id: result.id });
};

const deleteJob = async (req: Request, res: Response) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id }, select: { id: true } });

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
  }

  await prisma.job.delete({ where: { id: req.params.id } });
  res.status(StatusCodes.OK).json({ message: "Job deleted" });
};

const applyJob = async (req: Request, res: Response) => {
  applyJobSchema.parse(req.body);
  const safeBody = applyJobSchema.safeParse(req.body);
  if (!safeBody.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: safeBody.error });
  }
  const job = await prisma.job.findUnique({ where: { id: req.params.id }, select: { id: true } });

  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
  }

  const application = await prisma.jobApplication.findFirst({
    where: {
      jobId: req.params.id,
      userId: req.user?.id,
    },
  });

  if (application) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Job already applied" });
  }

  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  const result = await prisma.jobApplication.create({
    data: {
      message: safeBody.data.message,
      jobId: req.params.id,
      userId: req.user.id,
      status: ApplicationStatus.PENDING,
    },
  });

  res.status(StatusCodes.CREATED).json({ message: "Job applied", application_id: result.id });
};

export default { createJob, getJobs, getJob, updateJob, deleteJob, applyJob };

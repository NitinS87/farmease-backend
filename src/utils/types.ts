import { z } from "zod";
import { For, JobType } from "@prisma/client";

export const createJobSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3),
  latitude: z.number(),
  longitude: z.number(),
  landmark: z.string().min(3).max(255),
  completionDays: z.number().int().positive(),
  wage: z.number().int().positive(),
  images: z.array(z.string()).optional(),
  // requirements will be dynamic and can be any string or object
  requirements: z.any(),
  for: z.enum([For.CONTRACTOR, For.LABOUR, For.BOTH]),
  type: z.enum([
    JobType.HARVESTING,
    JobType.IRRIGATION,
    JobType.SOWING,
    JobType.PLOUGHING,
    JobType.CULTIVATION,
    JobType.TRANSPORTATION,
    JobType.LEVELING,
    JobType.FERTILIZATION,
    JobType.PESTICIDE_SPRAYING,
    JobType.SEED_TREATMENT,
    JobType.WEEDING,
    JobType.PRUNING,
    JobType.TRIMMING,
    JobType.PLANTING,
  ]), // Traverse through all job types
});

export const updateJobSchema = createJobSchema.partial();

export const applyJobSchema = z.object({
  message: z.string().min(3),
});

export const loginSchema = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z.string().min(10).max(10).optional(),
    password: z.string().min(6),
  })
  .refine((data) => {
    return (data.email && !data.phoneNumber) || (!data.email && data.phoneNumber);
  }, "Either email or phone number must be provided");

export const registerSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phoneNumber: z.string().min(10).max(10),
  password: z.string().min(6),
  aadharNumber: z.string().min(12).max(12).optional(),
});

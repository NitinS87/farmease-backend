/*
  Warnings:

  - A unique constraint covering the columns `[aadharNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SELLER');

-- CreateEnum
CREATE TYPE "For" AS ENUM ('LABOUR', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('TRACTOR', 'TRUCK', 'JCB', 'HARVESTER', 'COMBINE', 'TRAILER', 'CULTIVATOR', 'PLOUGH', 'PLANTER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "aadharNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "landmark" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "completionDays" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "for" "For" NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,
    "images" TEXT[],
    "rentalTerms" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_aadharNumber_key" ON "users"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `budget` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `requirements` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wage` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('HARVESTING', 'IRRIGATION', 'SOWING', 'PLOUGHING', 'CULTIVATION', 'TRANSPORTATION', 'LEVELING', 'FERTILIZATION', 'PESTICIDE_SPRAYING', 'SEED_TREATMENT', 'WEEDING', 'PRUNING', 'TRIMMING', 'PLANTING');

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "budget",
DROP COLUMN "phoneNumber",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "requirements" JSONB NOT NULL,
ADD COLUMN     "wage" DOUBLE PRECISION NOT NULL;

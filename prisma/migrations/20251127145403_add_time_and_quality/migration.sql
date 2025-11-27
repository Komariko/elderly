/*
  Warnings:

  - Added the required column `quality` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QualityRating" AS ENUM ('EXCELLENT', 'GOOD', 'BAD');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "quality" "QualityRating" NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "points" SET DATA TYPE DOUBLE PRECISION;

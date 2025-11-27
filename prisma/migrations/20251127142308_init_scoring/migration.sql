-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('NORMAL', 'WHEELCHAIR', 'BEDRIDDEN');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "patientStatus" "PatientStatus" NOT NULL,
    "points" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

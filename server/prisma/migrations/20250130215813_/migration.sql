/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId]` on the table `TechnicianReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId]` on the table `UserReview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "phone" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Technician" ALTER COLUMN "available" SET DEFAULT false;

-- AlterTable
ALTER TABLE "TechnicianReview" ADD COLUMN     "jobId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "UserReview" ADD COLUMN     "jobId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Company_phone_key" ON "Company"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianReview_jobId_key" ON "TechnicianReview"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "UserReview_jobId_key" ON "UserReview"("jobId");

-- AddForeignKey
ALTER TABLE "TechnicianReview" ADD CONSTRAINT "TechnicianReview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

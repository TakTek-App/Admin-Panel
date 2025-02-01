/*
  Warnings:

  - You are about to drop the column `available` on the `Technician` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "available";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

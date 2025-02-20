-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "customerId" TEXT DEFAULT '',
ADD COLUMN     "lastChargedCalls" INTEGER DEFAULT 0,
ADD COLUMN     "lastPaymentDate" TEXT DEFAULT '';

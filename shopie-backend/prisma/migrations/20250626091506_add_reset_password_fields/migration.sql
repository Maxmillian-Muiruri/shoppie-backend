-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordCode" TEXT,
ADD COLUMN     "resetPasswordCodeExpiry" TIMESTAMP(3);

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('UNMARRIED', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fatherOrHusbandName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT NOT NULL,
    "familyId" TEXT,
    "gotra" TEXT,
    "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'UNMARRIED',
    "education" TEXT,
    "profession" TEXT,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "ancestralVillage" TEXT NOT NULL,
    "profilePicture" TEXT,
    "bio" TEXT,
    "height" TEXT,
    "complexion" TEXT,
    "assignedVillage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_approvalStatus_idx" ON "users"("approvalStatus");

-- CreateIndex
CREATE INDEX "users_gender_idx" ON "users"("gender");

-- CreateIndex
CREATE INDEX "users_assignedVillage_idx" ON "users"("assignedVillage");

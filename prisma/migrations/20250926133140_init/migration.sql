-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('TENANT', 'LANDLORD');

-- CreateTable
CREATE TABLE "public"."UserType" (
    "id" TEXT NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'TENANT',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserType_userId_key" ON "public"."UserType"("userId");

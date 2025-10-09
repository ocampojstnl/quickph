-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "lastReadByLandlord" TIMESTAMP(3),
ADD COLUMN     "lastReadByTenant" TIMESTAMP(3);

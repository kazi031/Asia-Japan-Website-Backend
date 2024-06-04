/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `propertyId` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
DROP COLUMN "propertyId",
ADD COLUMN     "propertyId" SERIAL NOT NULL,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("propertyId");

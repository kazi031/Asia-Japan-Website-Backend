-- CreateEnum
CREATE TYPE "UPDATE_STATUS" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255) NOT NULL,
    "location" VARCHAR(80) NOT NULL,
    "detailedLocation" VARCHAR(255) NOT NULL,
    "area" VARCHAR(20) NOT NULL,
    "roadWidth" VARCHAR(20) NOT NULL,
    "landFace" VARCHAR(20) NOT NULL,
    "landDetails" TEXT NOT NULL,
    "status" "UPDATE_STATUS" NOT NULL DEFAULT 'AVAILABLE',
    "assets" TEXT[],

    CONSTRAINT "Property_pkey" PRIMARY KEY ("propertyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('NO_WORDS', 'CREATED', 'ONE_HOUR', 'ONE_DAY', 'TWO_DAYS', 'FIVE_DAYS', 'ONE_MONTH', 'COMPLETED');

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'NO_WORDS',

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "origin" VARCHAR(255) NOT NULL,
    "translation" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Word_id_collectionId_key" ON "Word"("id", "collectionId");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

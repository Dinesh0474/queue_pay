/*
  Warnings:

  - Added the required column `opennow` to the `Shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shops" ADD COLUMN     "opennow" INTEGER NOT NULL;

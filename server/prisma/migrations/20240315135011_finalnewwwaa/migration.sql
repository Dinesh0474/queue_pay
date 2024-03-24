/*
  Warnings:

  - You are about to drop the column `opennow` on the `Shops` table. All the data in the column will be lost.
  - Added the required column `title` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "content" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shops" DROP COLUMN "opennow";

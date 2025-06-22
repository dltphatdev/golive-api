/*
  Warnings:

  - You are about to drop the column `end_time` on the `steplog` table. All the data in the column will be lost.
  - Added the required column `last_time` to the `StepLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `steplog` DROP COLUMN `end_time`,
    ADD COLUMN `last_time` DATETIME(3) NOT NULL;

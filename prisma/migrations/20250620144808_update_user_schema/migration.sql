/*
  Warnings:

  - You are about to drop the column `attempts_code` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `blocked_until_code` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `attempts_code`,
    DROP COLUMN `blocked_until_code`;

/*
  Warnings:

  - You are about to drop the column `email_verify_token` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `email_verify_token`,
    ADD COLUMN `verify_code` VARCHAR(191) NULL;

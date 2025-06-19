/*
  Warnings:

  - You are about to drop the column `forgot_password_token` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `forgot_password_token`,
    ADD COLUMN `forgot_password_code` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('Male', 'FeMale') NOT NULL DEFAULT 'Male';

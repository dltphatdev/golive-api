-- DropIndex
DROP INDEX `User_email_password_idx` ON `user`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `email_verify_token` VARCHAR(191) NULL,
    ADD COLUMN `forgot_password_token` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `User_password_idx` ON `User`(`password`);

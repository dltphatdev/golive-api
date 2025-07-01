-- DropForeignKey
ALTER TABLE `steplog` DROP FOREIGN KEY `StepLog_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `streaklog` DROP FOREIGN KEY `StreakLog_user_id_fkey`;

-- AlterTable
ALTER TABLE `steplog` MODIFY `steps` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `steplog` ADD CONSTRAINT `steplog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `streaklog` ADD CONSTRAINT `streaklog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `refreshtoken` RENAME INDEX `RefreshToken_exp_idx` TO `refreshtoken_exp_idx`;

-- RenameIndex
ALTER TABLE `refreshtoken` RENAME INDEX `RefreshToken_token_key` TO `refreshtoken_token_key`;

-- RenameIndex
ALTER TABLE `steplog` RENAME INDEX `StepLog_user_id_date_key` TO `steplog_user_id_date_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_password_idx` TO `user_password_idx`;

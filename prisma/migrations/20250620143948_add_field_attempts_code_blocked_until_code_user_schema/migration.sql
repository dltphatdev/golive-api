-- AlterTable
ALTER TABLE `user` ADD COLUMN `attempts_code` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `blocked_until_code` DATETIME(3) NULL;

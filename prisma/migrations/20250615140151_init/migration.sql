-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NULL,
    `verify` ENUM('Unverified', 'Verified', 'Banned') NOT NULL DEFAULT 'Unverified',
    `avatar` VARCHAR(255) NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_password_idx`(`email`, `password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(512) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `iat` DATETIME(3) NOT NULL,
    `exp` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    INDEX `RefreshToken_exp_idx`(`exp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `user` MODIFY `email_verify_token` TEXT NULL,
    MODIFY `forgot_password_token` TEXT NULL;

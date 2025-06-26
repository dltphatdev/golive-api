-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th6 26, 2025 lúc 08:55 AM
-- Phiên bản máy phục vụ: 8.4.3
-- Phiên bản PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `golive_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refreshtoken`
--

CREATE TABLE `refreshtoken` (
  `id` int NOT NULL,
  `token` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `iat` datetime(3) NOT NULL,
  `exp` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `refreshtoken`
--

INSERT INTO `refreshtoken` (`id`, `token`, `user_id`, `iat`, `exp`) VALUES
(57, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMCwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjoiVmVyaWZpZWQiLCJpYXQiOjE3NTA4MTc1MjcsImV4cCI6MTc1MzQwOTUyN30.nPioPLHG4giR-V_oUbaDNPpLpyVLtK6380LGuBO0XTY', 20, '2025-06-25 02:12:07.000', '2025-07-25 02:12:07.000'),
(78, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMCwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjoiVmVyaWZpZWQiLCJpYXQiOjE3NTA5MjY3NTYsImV4cCI6MTc1MzUxODc1Nn0.3KSlGPWis5fJPtm1PH7_xAYriJzSrRsYP37Gvqy-h1c', 20, '2025-06-26 08:32:36.000', '2025-07-26 08:32:36.000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `steplog`
--

CREATE TABLE `steplog` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `date` datetime(3) NOT NULL,
  `steps` int NOT NULL,
  `spoint_earned` int NOT NULL DEFAULT '0',
  `start_time` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `last_time` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `steplog`
--

INSERT INTO `steplog` (`id`, `user_id`, `date`, `steps`, `spoint_earned`, `start_time`, `created_at`, `updated_at`, `last_time`) VALUES
(2, 20, '2025-06-23 17:00:00.000', 5000, 5000, '2025-06-23 17:00:00.000', '2025-06-23 17:09:25.068', '2025-06-23 13:40:26.647', '2025-06-23 13:40:23.088'),
(6, 20, '2025-06-24 00:00:00.000', 5000, 5000, '2025-06-23 17:00:00.000', '2025-06-24 13:57:19.380', '2025-06-24 14:17:12.309', '2025-06-24 14:17:07.965'),
(7, 21, '2025-06-24 00:00:00.000', 5000, 5000, '2025-06-23 17:00:00.000', '2025-06-24 14:13:56.354', '2025-06-24 14:13:56.386', '2025-06-24 14:13:52.623'),
(8, 22, '2025-06-24 00:00:00.000', 5000, 5000, '2025-06-23 17:00:00.000', '2025-06-24 14:14:40.413', '2025-06-24 14:14:40.446', '2025-06-24 14:14:36.808'),
(11, 20, '2025-06-25 00:00:00.000', 5000, 5000, '2025-06-24 17:00:00.000', '2025-06-25 01:46:23.170', '2025-06-25 01:47:44.864', '2025-06-25 01:47:42.447'),
(12, 21, '2025-06-25 00:00:00.000', 5000, 5000, '2025-06-24 17:00:00.000', '2025-06-25 01:57:21.251', '2025-06-25 01:57:21.256', '2025-06-25 01:57:18.850'),
(13, 23, '2025-06-25 00:00:00.000', 5000, 5000, '2025-06-24 17:00:00.000', '2025-06-25 06:56:49.677', '2025-06-25 06:56:49.692', '2025-06-25 06:56:47.254'),
(27, 24, '2025-06-25 00:00:00.000', 4848, 0, '2025-06-24 17:00:00.000', '2025-06-25 07:30:02.020', '2025-06-25 07:32:40.166', '2025-06-25 07:32:37.868'),
(28, 20, '2025-06-26 00:00:00.000', 4822, 0, '2025-06-25 17:00:00.000', '2025-06-26 08:32:38.250', '2025-06-26 08:35:51.494', '2025-06-26 08:35:51.202');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `streaklog`
--

CREATE TABLE `streaklog` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `last_date` datetime(3) NOT NULL,
  `count` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `streaklog`
--

INSERT INTO `streaklog` (`id`, `user_id`, `start_date`, `last_date`, `count`, `created_at`, `updated_at`) VALUES
(3, 20, '2025-06-24 00:00:00.000', '2025-06-25 00:00:00.000', 2, '2025-06-24 14:07:23.589', '2025-06-25 01:47:44.873'),
(4, 21, '2025-06-24 00:00:00.000', '2025-06-25 00:00:00.000', 2, '2025-06-24 14:13:56.438', '2025-06-25 01:57:21.264'),
(5, 22, '2025-06-24 00:00:00.000', '2025-06-24 00:00:00.000', 1, '2025-06-24 14:14:40.481', '2025-06-24 14:14:40.481'),
(8, 23, '2025-06-25 00:00:00.000', '2025-06-25 00:00:00.000', 1, '2025-06-25 06:56:49.708', '2025-06-25 06:56:49.708'),
(13, 24, '2025-06-25 00:00:00.000', '2025-06-25 00:00:00.000', 1, '2025-06-25 07:13:46.100', '2025-06-25 07:13:46.100');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `support`
--

CREATE TABLE `support` (
  `id` int NOT NULL,
  `fullname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `support`
--

INSERT INTO `support` (`id`, `fullname`, `email`, `phone`, `address`, `content`, `created_at`) VALUES
(1, 'Nguyen A', 'abc@gmail.com', '0987654321', 'hcm', 'anc', '2025-06-25 15:43:01.710');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verify` enum('Unverified','Verified','Banned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Unverified',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT NULL,
  `verify_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forgot_password_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('Male','FeMale') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Male',
  `spoint` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `fullname`, `verify`, `avatar`, `address`, `phone`, `date_of_birth`, `created_at`, `updated_at`, `verify_code`, `forgot_password_code`, `gender`, `spoint`) VALUES
(20, 'dolamthanhphat@gmail.com', 'ec9025221b8d3ae779f0b8d06555f26efb0166e4d2425d7aa2c351783f4b2c8b', 'Đỗ Lâm Thành Phát', 'Verified', 'ir3qi0y339hjug7zfgu32uuu4.jpg', 'Hcm city', '0704138356', '1998-01-29 17:00:00.000', '2025-06-19 17:45:31.994', '2025-06-26 08:42:21.621', NULL, NULL, 'Male', 10200),
(21, 'van@gmail.com', 'ec9025221b8d3ae779f0b8d06555f26efb0166e4d2425d7aa2c351783f4b2c8b', 'Nguyễn Thị Tuyết Vân', 'Verified', NULL, NULL, '0987654123', '2025-06-24 21:09:13.000', '2025-06-24 21:09:13.000', '2025-06-24 21:09:13.000', NULL, NULL, 'FeMale', 10200),
(22, 'phi@gmail.com', 'ec9025221b8d3ae779f0b8d06555f26efb0166e4d2425d7aa2c351783f4b2c8b', 'Nguyễn Nhược Phi', 'Verified', NULL, NULL, '0987654221', '2025-06-24 21:10:23.000', '2025-06-24 21:10:23.000', '2025-06-24 21:10:23.000', NULL, NULL, 'Male', 5000),
(23, 'tuyet@gmail.com', 'ec9025221b8d3ae779f0b8d06555f26efb0166e4d2425d7aa2c351783f4b2c8b', 'Ánh Tuyết', 'Verified', NULL, NULL, '0987654331', '2025-06-24 21:11:05.000', '2025-06-24 21:11:05.000', '2025-06-24 21:11:05.000', NULL, NULL, 'FeMale', 5000),
(24, 'huy@gmail.com', 'ec9025221b8d3ae779f0b8d06555f26efb0166e4d2425d7aa2c351783f4b2c8b', 'Nguyen Huy', 'Verified', NULL, NULL, '0987654321', '2025-06-24 21:21:29.000', '2025-06-24 21:21:29.000', '2025-06-24 21:21:29.000', NULL, NULL, 'Male', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1f5fbd87-e55a-4ede-b776-f6150dc66665', '863ba4145c9e55f1e5875232ea48d3c5744076b4bffeb9b211863e09fe400f63', '2025-06-22 05:14:39.262', '20250622051431_update_schema_user', NULL, NULL, '2025-06-22 05:14:38.891', 1),
('461ac734-ac8f-452b-a96b-8a9ff824ab61', 'a05e0c8ee8058e3308a75f9e9bfc20c44537269fc4d5f3af0bfdb46c1276619b', '2025-06-20 14:48:13.373', '20250620144808_update_user_schema', NULL, NULL, '2025-06-20 14:48:13.061', 1),
('621391b0-e644-434f-848e-74e6e16ef3cc', '809770c15bafb75dbe516a1675692ff010ff3b01760c262b0ec7ddeb8719f802', '2025-06-22 03:00:21.902', '20250622030014_create_step_log_and_streak_log_schema', NULL, NULL, '2025-06-22 03:00:19.087', 1),
('64ec9318-6156-480d-822e-4504a7857600', '1e1898b78335ac034d8ab346c15170d2e6fbf8999ed9f9fe33751fe3f11953ec', '2025-06-19 13:27:48.557', '20250619132743_update_schema_user', NULL, NULL, '2025-06-19 13:27:48.130', 1),
('6afa8d04-b696-4ace-9e49-0e87b3684e31', '7d92f14cb7a7b79bf7c6f5a55cc36d305f80b3a52e704a7c4303b042a78ffdee', '2025-06-25 14:56:40.500', '20250625145631_create_support_schema_update', NULL, NULL, '2025-06-25 14:56:40.213', 1),
('7e1185c4-686c-4045-b8e6-a0399a8eeebf', 'f89ed3d1a69aca306e684d2b30053d8a8aa266a1137c1218eff8951886cd05fd', '2025-06-15 14:02:39.820', '20250615140238_update_init', NULL, NULL, '2025-06-15 14:02:39.434', 1),
('8394a6fb-7337-46c5-8079-053afd30c2a9', '255f6ad3ba7d0d3429b7637bbe78c174078f5a088f86009613818408364d8d6c', '2025-06-22 03:57:42.545', '20250622035734_update_schema_step_log', NULL, NULL, '2025-06-22 03:57:41.877', 1),
('88fb5a12-9545-483d-ae42-6439bfd046cd', '73a5daebf6be2f1798f19150c60894e976a9334fc3e619a07d510f1030cb60a7', '2025-06-25 14:45:03.629', '20250625144452_create_support_schema', NULL, NULL, '2025-06-25 14:45:02.744', 1),
('92826674-77d4-49d6-b051-4044a566bffc', 'a5b6dfdc22df9bac0ca3e9406e022aab21c6590080a2313cfe1adb7704d86a9a', '2025-06-16 14:10:36.412', '20250616141033_update_field_phone_user_schema', NULL, NULL, '2025-06-16 14:10:35.500', 1),
('a0a83e92-3e79-44e0-85f2-b0b88a000c79', '2587598686e579e7eacefc331a05e09c87a1db5314547a6c5cd4eeb6477edb40', '2025-06-15 14:01:53.040', '20250615140151_init', NULL, NULL, '2025-06-15 14:01:52.141', 1),
('a8d0ba1a-36fa-413a-9704-985d3b191c63', '6f5d5594c97b8429602d5650f5de7a61b58d0bb69cfdee114eb5b8345312574c', '2025-06-16 14:38:44.336', '20250616143841_add_field_email_verify_token_and_forgot_password_token', NULL, NULL, '2025-06-16 14:38:43.671', 1),
('bd8277e0-44bf-4759-822b-dda8470eccce', '8f6cfa69f55ec7d0f4d1f61f45f26c478611b6b6cc7fece5579b521add7f35c6', '2025-06-18 16:15:29.827', '20250618161526_update_schema_user_token', NULL, NULL, '2025-06-18 16:15:28.786', 1),
('f38baaf3-2527-4de6-9829-090500fb841e', '41447483744c31964d88383cbd7100410be47af1d2610331873c3c62c8c2a658', '2025-06-20 14:39:53.069', '20250620143948_add_field_attempts_code_blocked_until_code_user_schema', NULL, NULL, '2025-06-20 14:39:52.714', 1),
('fd5b8899-2203-4ca0-9eb1-99542d0d987e', 'c7dc47e9bc13679df91aac9bac4ffbfd5567f2d6bd843c563c269f2f9953bb97', '2025-06-18 16:54:12.458', '20250618165407_update_schema_user_add_code_verify', NULL, NULL, '2025-06-18 16:54:12.051', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `refreshtoken`
--
ALTER TABLE `refreshtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `RefreshToken_token_key` (`token`),
  ADD KEY `RefreshToken_exp_idx` (`exp`);

--
-- Chỉ mục cho bảng `steplog`
--
ALTER TABLE `steplog`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `StepLog_user_id_date_key` (`user_id`,`date`);

--
-- Chỉ mục cho bảng `streaklog`
--
ALTER TABLE `streaklog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `StreakLog_user_id_fkey` (`user_id`);

--
-- Chỉ mục cho bảng `support`
--
ALTER TABLE `support`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_password_idx` (`password`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `refreshtoken`
--
ALTER TABLE `refreshtoken`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT cho bảng `steplog`
--
ALTER TABLE `steplog`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `streaklog`
--
ALTER TABLE `streaklog`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `support`
--
ALTER TABLE `support`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `steplog`
--
ALTER TABLE `steplog`
  ADD CONSTRAINT `StepLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `streaklog`
--
ALTER TABLE `streaklog`
  ADD CONSTRAINT `StreakLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 19, 2025 at 06:23 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `golive_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `refreshtoken`
--

CREATE TABLE `refreshtoken` (
  `id` int NOT NULL,
  `token` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `iat` datetime(3) NOT NULL,
  `exp` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verify` enum('Unverified','Verified','Banned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Unverified',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT NULL,
  `verify_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forgot_password_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('Male','FeMale') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Male'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `fullname`, `verify`, `avatar`, `address`, `phone`, `date_of_birth`, `created_at`, `updated_at`, `verify_code`, `forgot_password_code`, `gender`) VALUES
(20, 'dolamthanhphat@gmail.com', 'ec9025221b8d3ae779f0b8d06555f26efb0166e4d2425d7aa2c351783f4b2c8b', 'Phat dev', 'Verified', NULL, NULL, '0704138356', '1998-01-29 17:00:00.000', '2025-06-19 17:45:31.994', '2025-06-19 17:45:52.450', NULL, NULL, 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('64ec9318-6156-480d-822e-4504a7857600', '1e1898b78335ac034d8ab346c15170d2e6fbf8999ed9f9fe33751fe3f11953ec', '2025-06-19 13:27:48.557', '20250619132743_update_schema_user', NULL, NULL, '2025-06-19 13:27:48.130', 1),
('7e1185c4-686c-4045-b8e6-a0399a8eeebf', 'f89ed3d1a69aca306e684d2b30053d8a8aa266a1137c1218eff8951886cd05fd', '2025-06-15 14:02:39.820', '20250615140238_update_init', NULL, NULL, '2025-06-15 14:02:39.434', 1),
('92826674-77d4-49d6-b051-4044a566bffc', 'a5b6dfdc22df9bac0ca3e9406e022aab21c6590080a2313cfe1adb7704d86a9a', '2025-06-16 14:10:36.412', '20250616141033_update_field_phone_user_schema', NULL, NULL, '2025-06-16 14:10:35.500', 1),
('a0a83e92-3e79-44e0-85f2-b0b88a000c79', '2587598686e579e7eacefc331a05e09c87a1db5314547a6c5cd4eeb6477edb40', '2025-06-15 14:01:53.040', '20250615140151_init', NULL, NULL, '2025-06-15 14:01:52.141', 1),
('a8d0ba1a-36fa-413a-9704-985d3b191c63', '6f5d5594c97b8429602d5650f5de7a61b58d0bb69cfdee114eb5b8345312574c', '2025-06-16 14:38:44.336', '20250616143841_add_field_email_verify_token_and_forgot_password_token', NULL, NULL, '2025-06-16 14:38:43.671', 1),
('bd8277e0-44bf-4759-822b-dda8470eccce', '8f6cfa69f55ec7d0f4d1f61f45f26c478611b6b6cc7fece5579b521add7f35c6', '2025-06-18 16:15:29.827', '20250618161526_update_schema_user_token', NULL, NULL, '2025-06-18 16:15:28.786', 1),
('fd5b8899-2203-4ca0-9eb1-99542d0d987e', 'c7dc47e9bc13679df91aac9bac4ffbfd5567f2d6bd843c563c269f2f9953bb97', '2025-06-18 16:54:12.458', '20250618165407_update_schema_user_add_code_verify', NULL, NULL, '2025-06-18 16:54:12.051', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `refreshtoken`
--
ALTER TABLE `refreshtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `RefreshToken_token_key` (`token`),
  ADD KEY `RefreshToken_exp_idx` (`exp`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_password_idx` (`password`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `refreshtoken`
--
ALTER TABLE `refreshtoken`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 15 Sep 2025 pada 20.10
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `karyawan_dexa`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `employees`
--

CREATE TABLE `employees` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(125) NOT NULL,
  `departement` varchar(50) NOT NULL,
  `status_employee` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `employees`
--

INSERT INTO `employees` (`username`, `password`, `name`, `departement`, `status_employee`, `created_at`) VALUES
('andi.santoso', '$2y$10$BxwRLPglVkfRpuIboWwn6.dKhhEcRs9DM82bJBKIMkONhFwqoobla', 'Andi Santoso', 'Marketing', 'active', '2025-09-14 14:55:27'),
('jane.smith', '$2y$10$BxwRLPglVkfRpuIboWwn6.dKhhEcRs9DM82bJBKIMkONhFwqoobla', 'Jane Smith', 'HRD', 'inactive', '2025-09-14 14:55:27'),
('john.doe', '$2y$10$BxwRLPglVkfRpuIboWwn6.dKhhEcRs9DM82bJBKIMkONhFwqoobla', 'John Doe', 'Finance', 'active', '2025-09-14 14:55:27'),
('siti.nurhaliza', '$2y$10$BxwRLPglVkfRpuIboWwn6.dKhhEcRs9DM82bJBKIMkONhFwqoobla', 'Siti Nurhaliza', 'Operations', 'active', '2025-09-14 14:55:27'),
('vigo', '$2b$10$Um6JVNguD.VVKUOcbAKi5efSvOkDyF.O8nxtByp3DQakHuyjT8KpW', 'ga mau', 'HRD', 'Inactive', '2025-09-15 17:41:04'),
('vigo.made', '$2y$10$BxwRLPglVkfRpuIboWwn6.dKhhEcRs9DM82bJBKIMkONhFwqoobla', 'Vigo Made Prastyo', 'IT', 'active', '2025-09-14 14:55:27');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

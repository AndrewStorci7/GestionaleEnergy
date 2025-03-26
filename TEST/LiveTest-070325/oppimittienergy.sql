-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mar 07, 2025 alle 16:06
-- Versione del server: 10.4.27-MariaDB
-- Versione PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oppimittienergy`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `code_plastic`
--

CREATE TABLE `code_plastic` (
  `code` varchar(200) NOT NULL,
  `type` varchar(150) NOT NULL,
  `desc` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `code_plastic`
--

INSERT INTO `code_plastic` (`code`, `type`, `desc`) VALUES
('ALLUM.', 'Alluminio', '20050'),
('CAS/M', 'Cassette di plastica', '28710'),
('CHEMIX/C', 'CHEMIX/C (CHEMIX)', '27257'),
('CSS', 'CSS', '99901'),
('CTA/M', 'Contenitori di Pet azzurrato', '26010'),
('CTC/M', 'Contenitori di PET colorato', '22010'),
('CTE/M', 'Contenitori di HDPE', '24010'),
('CTL/M', 'Contenitori di PET incolore', '25010'),
('FERRO', 'Ferro', '20050'),
('FILM-C', 'Film di imballaggio colorato', '24612'),
('FILM-N', 'Film di imballaggio neutro', '2B610'),
('FLEX/S', 'Altri imballaggi misti riciclabili', '28612'),
('IPP/C', 'Imballaggi misti di Polipropilene', '2A210'),
('IPS/C', 'Imballaggi rigidi di Polistirene', '29210'),
('MCPL/M', 'MCPL/M (MCPL-PET1)', '22016'),
('MDR', 'MATERIALE DA RILAVORARE', '99902'),
('MDR PET', 'MDR PET', '99903'),
('MDR/FE', 'MDR/FE', '99904'),
('MPR/C', 'Imballaggi rigidi di poliolefine', '28411'),
('MPR/S', 'MPR/S', '99905'),
('none', '-', '-'),
('PLASMIX TL', 'Flusso residuo materiale sottoposto a vagliatura', '27213'),
('RPO/M', 'Altri imballaggi misti poliolefinici', '27253'),
('TL/ING', 'TL/ING', '99906'),
('VPET/C', 'VPET/C', '21410');

-- --------------------------------------------------------

--
-- Struttura della tabella `cond_presser_bale`
--

CREATE TABLE `cond_presser_bale` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `cond_presser_bale`
--

INSERT INTO `cond_presser_bale` (`id`, `type`) VALUES
(1, 'Intera'),
(2, 'Parziale');

-- --------------------------------------------------------

--
-- Struttura della tabella `cond_wheelman_bale`
--

CREATE TABLE `cond_wheelman_bale` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `cond_wheelman_bale`
--

INSERT INTO `cond_wheelman_bale` (`id`, `type`) VALUES
(1, 'Legata'),
(2, 'Non legata');

-- --------------------------------------------------------

--
-- Struttura della tabella `implants`
--

CREATE TABLE `implants` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `implants`
--

INSERT INTO `implants` (`id`, `name`) VALUES
(1, 'Impianto A (vecchio)'),
(2, 'Impianto B (nuovo)');

-- --------------------------------------------------------

--
-- Struttura della tabella `pb_wb`
--

CREATE TABLE `pb_wb` (
  `id_pb` int(10) UNSIGNED NOT NULL,
  `id_wb` int(10) UNSIGNED NOT NULL,
  `id_implant` int(10) UNSIGNED DEFAULT NULL,
  `status` int(11) DEFAULT 0 COMMENT 'Lo Status sarà lo stato della lavorazione e può avere valore 0(In Lavorazione)/1(Completato) oppure -1(Cambio/Modifica/Errore)',
  `id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `pb_wb`
--

INSERT INTO `pb_wb` (`id_pb`, `id_wb`, `id_implant`, `status`, `id`) VALUES
(572, 550, 1, 1, 409),
(573, 551, 1, 1, 410),
(574, 552, 1, 1, 411),
(575, 553, 1, 1, 412),
(576, 554, 1, 1, 413),
(577, 555, 1, 1, 414),
(578, 556, 1, 1, 415),
(579, 557, 1, 1, 416),
(580, 558, 1, 1, 417),
(581, 559, 1, 1, 418),
(582, 560, 1, 1, 419),
(583, 561, 1, 1, 420),
(584, 562, 1, 1, 421),
(585, 563, 1, 1, 422),
(586, 564, 1, 1, 423),
(587, 565, 1, 1, 424),
(588, 566, 1, 1, 425),
(589, 567, 1, 1, 426),
(590, 568, 1, 1, 427),
(591, 569, 1, 1, 428),
(592, 570, 1, 1, 429),
(593, 571, 1, 1, 430),
(594, 572, 1, 1, 431),
(595, 573, 1, 1, 432),
(596, 574, 1, 1, 433),
(597, 575, 1, 1, 434),
(598, 576, 1, 1, 435),
(599, 577, 1, 1, 436),
(600, 578, 1, 1, 437),
(601, 579, 1, 1, 438),
(602, 580, 1, 1, 439),
(603, 581, 1, 1, 440),
(604, 582, 1, 1, 441),
(605, 583, 1, 1, 442),
(606, 584, 1, 1, 443),
(607, 585, 1, 1, 444),
(608, 586, 1, 1, 445),
(609, 587, 1, 1, 446),
(610, 588, 1, 1, 447),
(611, 589, 1, 1, 448),
(612, 590, 1, 1, 449),
(613, 591, 1, 1, 450),
(614, 592, 1, 1, 451),
(615, 593, 1, 1, 452),
(616, 594, 1, 1, 453),
(617, 595, 1, 1, 454),
(618, 596, 1, 1, 455),
(619, 597, 1, 1, 456),
(620, 598, 1, 1, 457),
(621, 599, 1, 1, 458),
(622, 600, 1, 1, 459),
(623, 601, 1, 1, 460),
(624, 602, 1, 1, 461),
(625, 603, 1, 1, 462),
(626, 604, 1, 1, 463),
(627, 605, 1, 1, 464),
(628, 606, 1, 1, 465),
(629, 607, 1, 1, 466),
(630, 608, 1, 1, 467),
(631, 609, 1, 1, 468),
(632, 610, 1, 1, 469),
(633, 611, 1, 1, 470),
(634, 612, 1, 1, 471),
(635, 613, 1, 1, 472),
(636, 614, 1, 1, 473),
(637, 615, 1, 1, 474),
(638, 616, 1, 1, 475),
(639, 617, 1, 1, 476),
(640, 618, 1, 1, 477),
(641, 619, 1, 1, 478),
(642, 620, 1, 1, 479),
(643, 621, 1, 1, 480),
(644, 622, 1, 1, 481),
(645, 623, 1, 1, 482),
(646, 624, 1, 1, 483),
(647, 625, 1, 1, 484),
(648, 626, 1, 1, 485),
(649, 627, 1, 1, 486),
(650, 628, 1, 1, 487),
(651, 629, 1, 1, 488),
(656, 634, 1, 1, 493),
(657, 635, 1, 1, 494),
(658, 636, 1, 1, 495),
(659, 637, 1, 1, 496),
(660, 638, 1, 1, 497),
(661, 639, 1, 1, 498),
(662, 640, 1, 1, 499),
(663, 641, 1, 0, 500),
(664, 642, 1, 1, 501),
(665, 643, 1, 1, 502),
(666, 644, 1, 1, 503),
(667, 645, 1, 1, 504),
(668, 646, 1, 1, 505),
(669, 647, 1, 1, 506),
(670, 648, 1, 1, 507);

-- --------------------------------------------------------

--
-- Struttura della tabella `presser_bale`
--

CREATE TABLE `presser_bale` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_presser` int(10) UNSIGNED NOT NULL,
  `id_plastic` varchar(200) DEFAULT 'none',
  `id_rei` int(10) UNSIGNED DEFAULT 1,
  `id_cpb` int(10) UNSIGNED DEFAULT 1,
  `id_sb` int(10) UNSIGNED DEFAULT 1,
  `note` text DEFAULT NULL,
  `data_ins` datetime DEFAULT (current_timestamp() + interval 1 hour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `presser_bale`
--

INSERT INTO `presser_bale` (`id`, `id_presser`, `id_plastic`, `id_rei`, `id_cpb`, `id_sb`, `note`, `data_ins`) VALUES
(572, 2, 'MDR', 1, 1, 1, '', '2025-03-07 07:08:25'),
(573, 2, 'FILM-N', 1, 1, 1, '', '2025-03-07 07:14:33'),
(574, 2, 'FERRO', 1, 1, 1, '', '2025-03-07 07:22:35'),
(575, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 07:29:41'),
(576, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 07:30:16'),
(577, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 07:32:36'),
(578, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 07:41:34'),
(579, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 07:47:32'),
(580, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 07:47:40'),
(581, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 07:51:09'),
(582, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 07:51:54'),
(583, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 07:52:00'),
(584, 2, 'MDR', 1, 1, 1, '', '2025-03-07 07:59:45'),
(585, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 08:11:00'),
(586, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 08:17:04'),
(587, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 08:22:09'),
(588, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 08:27:14'),
(589, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 08:31:16'),
(590, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 08:31:24'),
(591, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 08:37:42'),
(592, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 08:39:47'),
(593, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 08:41:18'),
(594, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 08:43:07'),
(595, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 08:45:16'),
(596, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 08:59:51'),
(597, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 09:00:06'),
(598, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 09:03:28'),
(599, 2, 'CTE/M', 1, 1, 1, 'Viene da impianto B', '2025-03-07 09:12:04'),
(600, 2, 'MDR', 1, 1, 1, '', '2025-03-07 09:27:08'),
(601, 2, 'CTL/M', 3, 1, 1, '', '2025-03-07 09:28:27'),
(602, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 09:37:23'),
(603, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 09:43:11'),
(604, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 09:43:48'),
(605, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 09:49:58'),
(606, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 09:50:11'),
(607, 2, 'CTA/M', 4, 1, 1, '', '2025-03-07 09:54:39'),
(608, 2, 'MDR', 1, 1, 1, '', '2025-03-07 10:06:17'),
(609, 2, 'FERRO', 1, 1, 1, '', '2025-03-07 10:14:03'),
(610, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 10:23:35'),
(611, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 10:28:58'),
(612, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 10:32:18'),
(613, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 10:34:12'),
(614, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 10:39:56'),
(615, 2, 'FILM-C', 4, 1, 1, '', '2025-03-07 10:45:11'),
(616, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 10:47:12'),
(617, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 10:53:05'),
(618, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 10:54:48'),
(619, 2, 'MDR', 1, 1, 1, '', '2025-03-07 11:02:27'),
(620, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 11:07:20'),
(621, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 11:10:33'),
(622, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 11:13:42'),
(623, 2, 'CTA/M', 4, 1, 1, '', '2025-03-07 11:14:08'),
(624, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 11:20:17'),
(625, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 11:28:11'),
(626, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 11:28:19'),
(627, 2, 'CTC/M', 1, 1, 1, '', '2025-03-07 12:12:43'),
(628, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 12:18:23'),
(629, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 12:23:39'),
(630, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 12:28:16'),
(631, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 12:28:22'),
(632, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 12:31:43'),
(633, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 12:33:38'),
(634, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 12:34:00'),
(635, 2, 'PLASMIX TL', 1, 1, 1, 'Balla prodotta alle 10.20', '2025-03-07 12:35:50'),
(636, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 12:39:52'),
(637, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 12:41:05'),
(638, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 12:44:08'),
(639, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 12:48:41'),
(640, 2, 'CTL/M', 3, 1, 1, '', '2025-03-07 12:54:49'),
(641, 2, 'MDR', 1, 1, 1, '', '2025-03-07 13:01:42'),
(642, 2, 'MDR', 1, 1, 1, '', '2025-03-07 13:09:26'),
(643, 2, 'IPP/C', 4, 1, 1, '', '2025-03-07 13:10:53'),
(644, 2, 'MDR/FE', 1, 1, 1, '', '2025-03-07 13:16:46'),
(645, 2, 'CTA/M', 1, 1, 1, 'Imballata nella pressa vecchia', '2025-03-07 13:25:06'),
(646, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 13:36:15'),
(647, 2, 'FERRO', 1, 1, 1, '', '2025-03-07 13:37:43'),
(648, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 13:42:57'),
(649, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 13:53:18'),
(650, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 14:01:51'),
(651, 2, 'FILM-C', 1, 1, 1, '', '2025-03-07 14:02:07'),
(656, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 14:24:41'),
(657, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 14:24:48'),
(658, 2, 'CTL/M', 1, 1, 1, '', '2025-03-07 14:24:54'),
(659, 2, 'PLASMIX TL', 4, 1, 1, '', '2025-03-07 14:25:23'),
(660, 2, 'MDR', 1, 1, 1, '', '2025-03-07 14:25:39'),
(661, 2, 'RPO/M', 1, 1, 1, '', '2025-03-07 14:25:55'),
(662, 2, 'RPO/M', 3, 1, 1, '', '2025-03-07 14:31:01'),
(663, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 14:32:48'),
(664, 2, 'RPO/M', 1, 1, 1, 'Balla riferita alle 12.45', '2025-03-07 14:36:28'),
(665, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 14:43:25'),
(666, 2, 'CTA/M', 1, 1, 1, '', '2025-03-07 14:43:30'),
(667, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 14:43:45'),
(668, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 14:52:41'),
(669, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 14:55:33'),
(670, 2, 'PLASMIX TL', 1, 1, 1, '', '2025-03-07 14:55:41');

-- --------------------------------------------------------

--
-- Struttura della tabella `reas_not_tying`
--

CREATE TABLE `reas_not_tying` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `reas_not_tying`
--

INSERT INTO `reas_not_tying` (`id`, `name`) VALUES
(1, '-'),
(2, 'Fili strappati'),
(3, 'Fili insufficienti'),
(4, 'Filo terminato'),
(5, 'Trasporto muletto'),
(6, 'Balla caduta'),
(7, 'Altre motivazioni (vedi note)');

-- --------------------------------------------------------

--
-- Struttura della tabella `rei`
--

CREATE TABLE `rei` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `rei`
--

INSERT INTO `rei` (`id`, `name`) VALUES
(1, 'No'),
(2, 'Parziale'),
(3, 'Non legata'),
(4, 'Da magazzino');

-- --------------------------------------------------------

--
-- Struttura della tabella `selected_bale`
--

CREATE TABLE `selected_bale` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `selected_bale`
--

INSERT INTO `selected_bale` (`id`, `name`) VALUES
(1, 'No'),
(2, 'Corepla'),
(3, 'Coripet'),
(4, 'Uso interno');

-- --------------------------------------------------------

--
-- Struttura della tabella `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `surname` varchar(150) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_access` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `user`
--

INSERT INTO `user` (`id`, `type`, `name`, `surname`, `username`, `password`, `last_access`) VALUES
(1, 'admin', 'Andrea', 'Storci', 'andrea', 'c3284d0f94606de1fd2af172aba15bf3', '2024-11-19 11:09:45'),
(2, 'presser', 'Mario', 'Rossi', 'utente01', 'c3284d0f94606de1fd2af172aba15bf3', '2024-11-19 11:51:52'),
(3, 'wheelman', 'Mario', 'Bianchi', 'utente02', 'c3284d0f94606de1fd2af172aba15bf3', '2024-11-19 11:51:52'),
(4, 'both', 'Mario', 'Verdi', 'utente03', 'c3284d0f94606de1fd2af172aba15bf3', '2024-11-19 11:51:52');

-- --------------------------------------------------------

--
-- Struttura della tabella `warehouse_dest`
--

CREATE TABLE `warehouse_dest` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `warehouse_dest`
--

INSERT INTO `warehouse_dest` (`id`, `name`) VALUES
(1, 'Interno'),
(2, 'Provvisorio'),
(3, 'Corepla'),
(4, 'Coripet'),
(5, 'Altro');

-- --------------------------------------------------------

--
-- Struttura della tabella `wheelman_bale`
--

CREATE TABLE `wheelman_bale` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_wheelman` int(10) UNSIGNED DEFAULT NULL,
  `id_cwb` int(10) UNSIGNED DEFAULT 1,
  `id_rnt` int(10) UNSIGNED DEFAULT 1,
  `id_wd` int(10) UNSIGNED DEFAULT 1,
  `note` text DEFAULT NULL,
  `printed` tinyint(1) DEFAULT 0,
  `weight` int(10) UNSIGNED DEFAULT NULL,
  `data_ins` datetime DEFAULT (current_timestamp() + interval 1 hour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `wheelman_bale`
--

INSERT INTO `wheelman_bale` (`id`, `id_wheelman`, `id_cwb`, `id_rnt`, `id_wd`, `note`, `printed`, `weight`, `data_ins`) VALUES
(550, 3, 1, 1, 1, 'prima balla turno', 1, 685, '2025-03-07 07:08:25'),
(551, 3, 1, 1, 1, 'seconda baalla turmo', 1, 621, '2025-03-07 07:14:33'),
(552, 3, 1, 1, 1, NULL, 1, 907, '2025-03-07 07:22:35'),
(553, 3, 1, 1, 1, 'terza', 1, 447, '2025-03-07 07:29:42'),
(554, 3, 1, 1, 1, NULL, 1, 429, '2025-03-07 07:30:16'),
(555, 3, 1, 1, 1, '5', 1, 406, '2025-03-07 07:32:36'),
(556, 3, 1, 1, 1, NULL, 1, 448, '2025-03-07 07:41:34'),
(557, 3, 1, 1, 1, NULL, 1, 580, '2025-03-07 07:47:32'),
(558, 3, 1, 1, 1, NULL, 1, 556, '2025-03-07 07:47:40'),
(559, 3, 1, 1, 1, 'test', 1, 389, '2025-03-07 07:51:09'),
(560, 3, 1, 1, 1, NULL, 1, 371, '2025-03-07 07:51:54'),
(561, 3, 1, 1, 1, NULL, 1, 344, '2025-03-07 07:52:00'),
(562, 3, 1, 1, 1, 'seconda mdr turno', 1, 659, '2025-03-07 07:59:45'),
(563, 3, 1, 1, 1, NULL, 1, 445, '2025-03-07 08:11:00'),
(564, 3, 1, 1, 1, NULL, 1, 324, '2025-03-07 08:17:04'),
(565, 3, 1, 1, 1, NULL, 1, 341, '2025-03-07 08:22:09'),
(566, 3, 1, 1, 1, NULL, 1, 424, '2025-03-07 08:27:14'),
(567, 3, 1, 1, 1, NULL, 1, 327, '2025-03-07 08:31:16'),
(568, 3, 2, 2, 1, NULL, 1, NULL, '2025-03-07 08:31:24'),
(569, 3, 1, 1, 1, NULL, 1, 581, '2025-03-07 08:37:42'),
(570, 3, 1, 1, 1, 'gestione ritardata dopo balle imp. b', 1, 680, '2025-03-07 08:39:47'),
(571, 3, 1, 1, 1, NULL, 1, 635, '2025-03-07 08:41:18'),
(572, 3, 1, 1, 1, NULL, 1, 534, '2025-03-07 08:43:07'),
(573, 3, 1, 1, 1, NULL, 1, 449, '2025-03-07 08:45:16'),
(574, 3, 1, 1, 1, NULL, 1, 496, '2025-03-07 08:59:51'),
(575, 3, 1, 1, 1, NULL, 1, 301, '2025-03-07 09:00:06'),
(576, 3, 1, 1, 1, NULL, 1, 461, '2025-03-07 09:03:28'),
(577, 3, 1, 1, 1, 'da imp. b', 1, 344, '2025-03-07 09:12:04'),
(578, 3, 1, 1, 1, NULL, 1, 367, '2025-03-07 09:27:08'),
(579, 3, 1, 1, 1, NULL, 1, 613, '2025-03-07 09:28:27'),
(580, 3, 1, 1, 1, NULL, 1, 475, '2025-03-07 09:37:23'),
(581, 3, 1, 1, 1, NULL, 1, 356, '2025-03-07 09:43:11'),
(582, 3, 1, 1, 1, NULL, 1, 365, '2025-03-07 09:43:48'),
(583, 3, 1, 1, 1, NULL, 1, 383, '2025-03-07 09:49:58'),
(584, 3, 1, 1, 1, 'pre reimballo test', 1, 467, '2025-03-07 09:50:11'),
(585, 3, 1, 1, 1, 'attualmente non viene pesata', 1, NULL, '2025-03-07 09:54:39'),
(586, 3, 1, 1, 1, NULL, 1, 276, '2025-03-07 10:06:17'),
(587, 3, 1, 1, 1, NULL, 1, 1109, '2025-03-07 10:14:03'),
(588, 3, 1, 1, 1, NULL, 1, 490, '2025-03-07 10:23:35'),
(589, 3, 1, 1, 1, NULL, 1, 446, '2025-03-07 10:28:58'),
(590, 3, 1, 1, 1, 'erorre inserimento peso', 1, 512, '2025-03-07 10:32:18'),
(591, 3, 1, 1, 1, NULL, 1, 634, '2025-03-07 10:34:12'),
(592, 3, 1, 1, 1, NULL, 1, 493, '2025-03-07 10:39:56'),
(593, 3, 1, 1, 1, 'attualmente non viene pesata', 1, NULL, '2025-03-07 10:45:11'),
(594, 3, 1, 1, 1, NULL, 1, 420, '2025-03-07 10:47:12'),
(595, 3, 1, 1, 1, NULL, 1, 395, '2025-03-07 10:53:05'),
(596, 3, 2, 2, 1, NULL, 1, NULL, '2025-03-07 10:54:48'),
(597, 3, 1, 1, 1, NULL, 1, 748, '2025-03-07 11:02:27'),
(598, 3, 1, 1, 1, NULL, 1, 652, '2025-03-07 11:07:20'),
(599, 3, 1, 1, 1, NULL, 1, 562, '2025-03-07 11:10:33'),
(600, 3, 1, 1, 1, NULL, 1, 650, '2025-03-07 11:13:42'),
(601, 3, 1, 1, 1, 'non viene pesata nella gestine attuale', 1, NULL, '2025-03-07 11:14:08'),
(602, 3, 1, 1, 1, NULL, 1, 420, '2025-03-07 11:20:17'),
(603, 3, 1, 1, 1, NULL, 1, 397, '2025-03-07 11:28:11'),
(604, 3, 2, 5, 1, 'ultima balla prima della pausa', 1, NULL, '2025-03-07 11:28:19'),
(605, 3, 1, 1, 1, 'prima balla dopo pausa', 1, 285, '2025-03-07 12:12:43'),
(606, 3, 1, 1, 1, NULL, 1, 302, '2025-03-07 12:18:23'),
(607, 3, 1, 1, 1, NULL, 1, 358, '2025-03-07 12:23:39'),
(608, 3, 1, 1, 1, NULL, 1, 343, '2025-03-07 12:28:16'),
(609, 3, 1, 1, 1, 'balla gestita non in coda', 1, 321, '2025-03-07 12:28:22'),
(610, 3, 1, 1, 1, 'gestito non in coda', 1, 310, '2025-03-07 12:31:43'),
(611, 3, 2, 7, 1, 'unita con balla di film c', 1, NULL, '2025-03-07 12:33:38'),
(612, 3, 1, 1, 1, 'gestita non in fila', 1, 276, '2025-03-07 12:34:00'),
(613, 3, 1, 1, 1, 'materiale gestito ore 10:10 circa', 1, 462, '2025-03-07 12:35:50'),
(614, 3, 1, 1, 1, 'balla non in fila', 1, 398, '2025-03-07 12:39:52'),
(615, 3, 1, 1, 1, 'balla non in fila', 1, 412, '2025-03-07 12:41:05'),
(616, 3, 2, 7, 1, 'unita con balla di rpo', 1, NULL, '2025-03-07 12:44:08'),
(617, 3, 1, 1, 1, NULL, 1, 530, '2025-03-07 12:48:41'),
(618, 3, 1, 1, 1, NULL, 1, 498, '2025-03-07 12:54:49'),
(619, NULL, 1, 1, 1, NULL, 1, NULL, '2025-03-07 13:01:42'),
(620, NULL, 1, 1, 1, NULL, 0, 267, '2025-03-07 13:09:26'),
(621, 3, 1, 1, 1, 'non viene pesata nella gestione attuale', 1, NULL, '2025-03-07 13:10:53'),
(622, NULL, 1, 1, 1, NULL, 0, NULL, '2025-03-07 13:16:46'),
(623, 3, 1, 1, 1, NULL, 1, 415, '2025-03-07 13:25:06'),
(624, 3, 1, 1, 1, NULL, 1, 415, '2025-03-07 13:36:15'),
(625, 3, 1, 1, 1, NULL, 1, 1122, '2025-03-07 13:37:43'),
(626, 3, 1, 1, 1, NULL, 1, 414, '2025-03-07 13:42:57'),
(627, 3, 1, 1, 1, NULL, 1, 414, '2025-03-07 13:53:18'),
(628, 3, 1, 1, 1, NULL, 1, 498, '2025-03-07 14:01:51'),
(629, 3, 1, 1, 1, NULL, 1, 302, '2025-03-07 14:02:08'),
(634, 3, 1, 1, 1, NULL, 1, 420, '2025-03-07 14:24:42'),
(635, 3, 1, 1, 1, NULL, 1, 429, '2025-03-07 14:24:48'),
(636, 3, 1, 1, 1, NULL, 1, 552, '2025-03-07 14:24:54'),
(637, 3, 1, 1, 1, NULL, 1, 569, '2025-03-07 14:25:23'),
(638, 3, 1, 1, 1, NULL, 1, 542, '2025-03-07 14:25:39'),
(639, 3, 1, 1, 1, NULL, 1, 414, '2025-03-07 14:25:55'),
(640, 3, 1, 1, 1, NULL, 1, 426, '2025-03-07 14:31:01'),
(641, NULL, 1, 1, 1, NULL, 0, NULL, '2025-03-07 14:32:48'),
(642, 3, 1, 1, 1, 'inserita dopo', 1, 414, '2025-03-07 14:36:28'),
(643, 3, 1, 1, 1, NULL, 1, 434, '2025-03-07 14:43:25'),
(644, 3, 1, 1, 1, NULL, 1, 455, '2025-03-07 14:43:30'),
(645, NULL, 1, 1, 1, NULL, 1, 569, '2025-03-07 14:43:45'),
(646, 3, 1, 1, 1, NULL, 1, 489, '2025-03-07 14:52:41'),
(647, 3, 1, 1, 1, NULL, 1, 558, '2025-03-07 14:55:33'),
(648, 3, 1, 1, 1, NULL, 1, 444, '2025-03-07 14:55:41');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `code_plastic`
--
ALTER TABLE `code_plastic`
  ADD PRIMARY KEY (`code`);

--
-- Indici per le tabelle `cond_presser_bale`
--
ALTER TABLE `cond_presser_bale`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `cond_wheelman_bale`
--
ALTER TABLE `cond_wheelman_bale`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `implants`
--
ALTER TABLE `implants`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `pb_wb`
--
ALTER TABLE `pb_wb`
  ADD PRIMARY KEY (`id_pb`,`id_wb`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `id_wb` (`id_wb`);

--
-- Indici per le tabelle `presser_bale`
--
ALTER TABLE `presser_bale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_presser` (`id_presser`),
  ADD KEY `id_plastic` (`id_plastic`),
  ADD KEY `id_rei` (`id_rei`),
  ADD KEY `id_cpb` (`id_cpb`),
  ADD KEY `id_sb` (`id_sb`);

--
-- Indici per le tabelle `reas_not_tying`
--
ALTER TABLE `reas_not_tying`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `rei`
--
ALTER TABLE `rei`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `selected_bale`
--
ALTER TABLE `selected_bale`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indici per le tabelle `warehouse_dest`
--
ALTER TABLE `warehouse_dest`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `wheelman_bale`
--
ALTER TABLE `wheelman_bale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_wd` (`id_wd`),
  ADD KEY `id_wheelman` (`id_wheelman`),
  ADD KEY `id_cwb` (`id_cwb`),
  ADD KEY `id_rnt` (`id_rnt`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `cond_presser_bale`
--
ALTER TABLE `cond_presser_bale`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `cond_wheelman_bale`
--
ALTER TABLE `cond_wheelman_bale`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `implants`
--
ALTER TABLE `implants`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `pb_wb`
--
ALTER TABLE `pb_wb`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=508;

--
-- AUTO_INCREMENT per la tabella `presser_bale`
--
ALTER TABLE `presser_bale`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=671;

--
-- AUTO_INCREMENT per la tabella `reas_not_tying`
--
ALTER TABLE `reas_not_tying`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `rei`
--
ALTER TABLE `rei`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `selected_bale`
--
ALTER TABLE `selected_bale`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `warehouse_dest`
--
ALTER TABLE `warehouse_dest`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `wheelman_bale`
--
ALTER TABLE `wheelman_bale`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=649;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `pb_wb`
--
ALTER TABLE `pb_wb`
  ADD CONSTRAINT `pb_wb_ibfk_1` FOREIGN KEY (`id_wb`) REFERENCES `wheelman_bale` (`id`),
  ADD CONSTRAINT `pb_wb_ibfk_2` FOREIGN KEY (`id_pb`) REFERENCES `presser_bale` (`id`);

--
-- Limiti per la tabella `presser_bale`
--
ALTER TABLE `presser_bale`
  ADD CONSTRAINT `presser_bale_ibfk_1` FOREIGN KEY (`id_presser`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_10` FOREIGN KEY (`id_sb`) REFERENCES `selected_bale` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_2` FOREIGN KEY (`id_plastic`) REFERENCES `code_plastic` (`code`),
  ADD CONSTRAINT `presser_bale_ibfk_3` FOREIGN KEY (`id_rei`) REFERENCES `rei` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_4` FOREIGN KEY (`id_cpb`) REFERENCES `cond_presser_bale` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_5` FOREIGN KEY (`id_sb`) REFERENCES `selected_bale` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_6` FOREIGN KEY (`id_presser`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_7` FOREIGN KEY (`id_plastic`) REFERENCES `code_plastic` (`code`),
  ADD CONSTRAINT `presser_bale_ibfk_8` FOREIGN KEY (`id_rei`) REFERENCES `rei` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_9` FOREIGN KEY (`id_cpb`) REFERENCES `cond_presser_bale` (`id`);

--
-- Limiti per la tabella `wheelman_bale`
--
ALTER TABLE `wheelman_bale`
  ADD CONSTRAINT `wheelman_bale_ibfk_1` FOREIGN KEY (`id_wheelman`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_2` FOREIGN KEY (`id_cwb`) REFERENCES `cond_wheelman_bale` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_3` FOREIGN KEY (`id_rnt`) REFERENCES `reas_not_tying` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_4` FOREIGN KEY (`id_wd`) REFERENCES `warehouse_dest` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_5` FOREIGN KEY (`id_wheelman`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_6` FOREIGN KEY (`id_cwb`) REFERENCES `cond_wheelman_bale` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_7` FOREIGN KEY (`id_rnt`) REFERENCES `reas_not_tying` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

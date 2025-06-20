-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Giu 04, 2025 alle 08:56
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
  `id` int(10) UNSIGNED NOT NULL,
  `gam` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{"is_rei_altro_mag":false,"id_implant":0}' COMMENT 'Oggetto che indica se la balla è da gestire su un impianto diverso: `{ is_rei_altro_mag(bool): [true | false], id_implant(int): [number] }`',
  `deleted` tinyint(1) DEFAULT 0 COMMENT 'La balla come prima fase non viene eliminata definitivamente ma viene tracciata come "eliminata"'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `presser_bale`
--

CREATE TABLE `presser_bale` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_presser` int(10) UNSIGNED NOT NULL,
  `id_plastic` varchar(200) NOT NULL,
  `id_rei` int(10) UNSIGNED DEFAULT 1,
  `id_cpb` int(10) UNSIGNED DEFAULT 1,
  `id_sb` int(10) UNSIGNED DEFAULT 1,
  `note` text DEFAULT NULL,
  `data_ins` datetime DEFAULT (current_timestamp() + interval 1 hour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(3, 'Non legata al carrello'),
(4, 'Da magazzino'),
(5, 'REI Altro Mag. ');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `presser_bale`
--
ALTER TABLE `presser_bale`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `reas_not_tying`
--
ALTER TABLE `reas_not_tying`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `rei`
--
ALTER TABLE `rei`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `presser_bale_ibfk_2` FOREIGN KEY (`id_plastic`) REFERENCES `code_plastic` (`code`),
  ADD CONSTRAINT `presser_bale_ibfk_3` FOREIGN KEY (`id_rei`) REFERENCES `rei` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_4` FOREIGN KEY (`id_cpb`) REFERENCES `cond_presser_bale` (`id`),
  ADD CONSTRAINT `presser_bale_ibfk_5` FOREIGN KEY (`id_sb`) REFERENCES `selected_bale` (`id`);

--
-- Limiti per la tabella `wheelman_bale`
--
ALTER TABLE `wheelman_bale`
  ADD CONSTRAINT `wheelman_bale_ibfk_1` FOREIGN KEY (`id_wheelman`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_2` FOREIGN KEY (`id_cwb`) REFERENCES `cond_wheelman_bale` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_3` FOREIGN KEY (`id_rnt`) REFERENCES `reas_not_tying` (`id`),
  ADD CONSTRAINT `wheelman_bale_ibfk_4` FOREIGN KEY (`id_wd`) REFERENCES `warehouse_dest` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

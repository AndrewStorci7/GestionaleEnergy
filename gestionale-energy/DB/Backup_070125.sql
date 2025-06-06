-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: oppimittienergy
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `code_plastic`
--

DROP TABLE IF EXISTS `code_plastic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_plastic` (
  `code` varchar(200) NOT NULL,
  `type` varchar(150) NOT NULL,
  `desc` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_plastic`
--

LOCK TABLES `code_plastic` WRITE;
/*!40000 ALTER TABLE `code_plastic` DISABLE KEYS */;
INSERT INTO `code_plastic` VALUES ('ALLUM.','Alluminio','20050'),('CAS/M','Cassette di plastica','28710'),('CHEMIX/C','CHEMIX/C (CHEMIX)','27257'),('CSS','CSS','99901'),('CTA/M','Contenitori di Pet azzurrato','26010'),('CTC/M','Contenitori di PET colorato','22010'),('CTE/M','Contenitori di HDPE','24010'),('CTL/M','Contenitori di PET incolore','25010'),('FERRO','Ferro','20050'),('FILM-C','Film di imballaggio colorato','24612'),('FILM-N','Film di imballaggio neutro','2B610'),('FLEX/S','Altri imballaggi misti riciclabili','28612'),('IPP/C','Imballaggi misti di Polipropilene','2A210'),('IPS/C','Imballaggi rigidi di Polistirene','29210'),('MCPL/M','MCPL/M (MCPL-PET1)','22016'),('MDR','MATERIALE DA RILAVORARE','99902'),('MDR PET','MDR PET','99903'),('MDR/FE','MDR/FE','99904'),('MPR/C','Imballaggi rigidi di poliolefine','28411'),('MPR/S','MPR/S','99905'),('none','-','-'),('PLASMIX TL','Flusso residuo materiale sottoposto a vagliatura','27213'),('RPO/M','Altri imballaggi misti poliolefinici','27253'),('TL/ING','TL/ING','99906'),('VPET/C','VPET/C','21410');
/*!40000 ALTER TABLE `code_plastic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cond_presser_bale`
--

DROP TABLE IF EXISTS `cond_presser_bale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cond_presser_bale` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cond_presser_bale`
--

LOCK TABLES `cond_presser_bale` WRITE;
/*!40000 ALTER TABLE `cond_presser_bale` DISABLE KEYS */;
INSERT INTO `cond_presser_bale` VALUES (1,'Intera'),(2,'Parziale');
/*!40000 ALTER TABLE `cond_presser_bale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cond_wheelman_bale`
--

DROP TABLE IF EXISTS `cond_wheelman_bale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cond_wheelman_bale` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cond_wheelman_bale`
--

LOCK TABLES `cond_wheelman_bale` WRITE;
/*!40000 ALTER TABLE `cond_wheelman_bale` DISABLE KEYS */;
INSERT INTO `cond_wheelman_bale` VALUES (1,'Legata'),(2,'Non legata');
/*!40000 ALTER TABLE `cond_wheelman_bale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `implants`
--

DROP TABLE IF EXISTS `implants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `implants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `implants`
--

LOCK TABLES `implants` WRITE;
/*!40000 ALTER TABLE `implants` DISABLE KEYS */;
INSERT INTO `implants` VALUES (1,'Impianto B'),(2,'Impianto A');
/*!40000 ALTER TABLE `implants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pb_wb`
--

DROP TABLE IF EXISTS `pb_wb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pb_wb` (
  `id_pb` int unsigned NOT NULL,
  `id_wb` int unsigned NOT NULL,
  `id_implant` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_pb`,`id_wb`),
  KEY `id_wb` (`id_wb`),
  CONSTRAINT `pb_wb_ibfk_1` FOREIGN KEY (`id_wb`) REFERENCES `wheelman_bale` (`id`),
  CONSTRAINT `pb_wb_ibfk_2` FOREIGN KEY (`id_pb`) REFERENCES `presser_bale` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pb_wb`
--

LOCK TABLES `pb_wb` WRITE;
/*!40000 ALTER TABLE `pb_wb` DISABLE KEYS */;
INSERT INTO `pb_wb` VALUES (28,23,1),(29,24,1),(31,25,1),(36,26,2),(37,27,2),(38,28,1),(39,29,1),(40,30,1),(43,33,1),(44,34,1),(45,35,1),(46,36,1),(47,37,1),(48,38,1),(49,39,1),(50,40,1),(51,41,1),(52,42,1),(53,43,1),(54,44,1),(55,45,1),(56,46,1),(57,47,1),(58,48,1),(59,49,1),(60,50,1),(61,51,1),(62,52,1),(63,53,1),(64,54,1),(65,55,1),(66,56,1),(67,57,1),(68,58,1),(69,59,1),(70,60,1),(71,61,1),(72,62,1),(73,63,1),(74,64,1),(75,65,1),(76,66,1),(77,67,1),(78,68,1),(79,69,1),(80,70,2),(81,71,2),(82,72,1),(83,73,1),(84,74,1),(85,75,2),(86,76,2),(87,77,2),(88,78,1),(89,79,1),(93,83,1),(94,84,1);
/*!40000 ALTER TABLE `pb_wb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presser_bale`
--

DROP TABLE IF EXISTS `presser_bale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presser_bale` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_presser` int unsigned NOT NULL,
  `id_plastic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'none',
  `id_rei` int unsigned DEFAULT '1',
  `id_cpb` int unsigned DEFAULT '1',
  `id_sb` int unsigned DEFAULT '1',
  `note` text,
  `data_ins` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `id_presser` (`id_presser`),
  KEY `id_plastic` (`id_plastic`),
  KEY `id_rei` (`id_rei`),
  KEY `id_cpb` (`id_cpb`),
  KEY `id_sb` (`id_sb`),
  CONSTRAINT `presser_bale_ibfk_1` FOREIGN KEY (`id_presser`) REFERENCES `user` (`id`),
  CONSTRAINT `presser_bale_ibfk_10` FOREIGN KEY (`id_sb`) REFERENCES `selected_bale` (`id`),
  CONSTRAINT `presser_bale_ibfk_2` FOREIGN KEY (`id_plastic`) REFERENCES `code_plastic` (`code`),
  CONSTRAINT `presser_bale_ibfk_3` FOREIGN KEY (`id_rei`) REFERENCES `rei` (`id`),
  CONSTRAINT `presser_bale_ibfk_4` FOREIGN KEY (`id_cpb`) REFERENCES `cond_presser_bale` (`id`),
  CONSTRAINT `presser_bale_ibfk_5` FOREIGN KEY (`id_sb`) REFERENCES `selected_bale` (`id`),
  CONSTRAINT `presser_bale_ibfk_6` FOREIGN KEY (`id_presser`) REFERENCES `user` (`id`),
  CONSTRAINT `presser_bale_ibfk_7` FOREIGN KEY (`id_plastic`) REFERENCES `code_plastic` (`code`),
  CONSTRAINT `presser_bale_ibfk_8` FOREIGN KEY (`id_rei`) REFERENCES `rei` (`id`),
  CONSTRAINT `presser_bale_ibfk_9` FOREIGN KEY (`id_cpb`) REFERENCES `cond_presser_bale` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presser_bale`
--

LOCK TABLES `presser_bale` WRITE;
/*!40000 ALTER TABLE `presser_bale` DISABLE KEYS */;
INSERT INTO `presser_bale` VALUES (27,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(28,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(29,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(30,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(31,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(36,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(37,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(38,2,'CHEMIX/C',2,2,2,'dawdawda','2024-12-16 10:44:26'),(39,2,'CTL/M',2,2,2,'Prova inserimento','2024-12-16 11:10:17'),(40,2,'MPR/S',4,2,3,'Prova inserimento dopo merge','2024-12-16 11:46:34'),(41,2,'none',1,1,1,NULL,'2024-12-17 11:33:02'),(42,2,'none',1,1,1,NULL,'2024-12-17 11:33:06'),(43,2,'none',1,1,1,NULL,'2024-12-17 11:49:47'),(44,2,'none',1,1,1,NULL,'2024-12-17 12:07:29'),(45,2,'none',1,1,1,NULL,'2024-12-17 12:07:36'),(46,2,'none',1,1,1,NULL,'2024-12-17 12:08:22'),(47,2,'none',1,1,1,NULL,'2024-12-17 12:09:03'),(48,2,'none',1,1,1,NULL,'2024-12-17 12:09:05'),(49,2,'none',1,1,1,NULL,'2024-12-17 12:09:12'),(50,2,'none',1,1,1,NULL,'2024-12-17 12:13:29'),(51,2,'none',1,1,1,NULL,'2024-12-17 12:13:42'),(52,2,'none',1,1,1,NULL,'2024-12-17 12:13:48'),(53,2,'none',1,1,1,NULL,'2024-12-17 12:13:52'),(54,2,'none',1,1,1,NULL,'2024-12-17 12:14:22'),(55,2,'none',1,1,1,NULL,'2024-12-17 12:40:34'),(56,2,'none',1,1,1,NULL,'2024-12-19 08:50:42'),(57,2,'none',1,1,1,NULL,'2024-12-19 08:52:10'),(58,2,'none',1,1,1,NULL,'2024-12-19 08:56:15'),(59,2,'CTL/M',3,2,2,'prova','2024-12-19 10:00:25'),(60,2,'IPS/C',4,1,2,'jhdkjahdjkaksjdhkasjhd','2024-12-19 10:00:49'),(61,2,'none',1,1,1,NULL,'2024-12-19 11:21:04'),(62,2,'none',1,1,1,NULL,'2024-12-19 11:21:59'),(63,2,'none',1,1,1,NULL,'2024-12-19 11:28:07'),(64,2,'none',1,1,1,NULL,'2024-12-19 11:29:33'),(65,2,'none',1,1,1,NULL,'2024-12-19 11:30:15'),(66,2,'none',1,1,1,NULL,'2024-12-19 11:30:42'),(67,2,'none',1,1,1,NULL,'2024-12-19 11:31:08'),(68,2,'none',1,1,1,NULL,'2024-12-19 11:31:31'),(69,2,'none',1,1,1,NULL,'2024-12-19 11:35:53'),(70,2,'none',1,1,1,NULL,'2024-12-19 11:36:31'),(71,2,'none',1,1,1,NULL,'2024-12-19 11:45:47'),(72,2,'none',1,1,1,NULL,'2024-12-19 11:47:17'),(73,2,'none',1,1,1,NULL,'2024-12-19 11:53:02'),(74,2,'none',1,1,1,NULL,'2024-12-19 11:53:39'),(75,2,'none',1,1,1,NULL,'2024-12-24 08:57:22'),(76,2,'none',1,1,1,NULL,'2024-12-24 10:03:35'),(77,2,'none',1,1,1,NULL,'2024-12-24 12:01:29'),(78,2,'none',1,1,1,NULL,'2024-12-24 12:04:22'),(79,2,'CTA/M',3,2,2,'34234dfsfsd','2024-12-24 12:06:10'),(80,2,'CHEMIX/C',3,2,2,'fafdnasjdhaksjd','2024-12-27 09:31:23'),(81,2,'none',1,1,1,NULL,'2024-12-27 09:31:26'),(82,2,'CAS/M',1,2,2,'ciao','2024-12-27 09:42:18'),(83,2,'CHEMIX/C',2,2,1,'ee','2024-12-27 09:59:46'),(84,2,'CHEMIX/C',2,1,2,'hhh','2024-12-27 10:00:01'),(85,2,'none',1,1,1,NULL,'2024-12-27 10:55:26'),(86,2,'none',1,1,1,NULL,'2024-12-27 11:45:20'),(87,2,'none',1,1,1,NULL,'2024-12-27 11:45:47'),(88,2,'CTC/M',2,1,1,NULL,'2024-12-30 09:38:26'),(89,2,'CTL/M',4,1,1,NULL,'2024-12-30 11:06:10'),(90,2,'none',1,1,1,NULL,'2024-12-30 11:34:30'),(91,2,'none',1,1,1,NULL,'2024-12-30 11:34:30'),(92,2,'none',1,1,1,NULL,'2024-12-30 11:35:14'),(93,2,'CSS',3,1,1,NULL,'2024-12-30 11:47:45'),(94,2,'FERRO',3,1,1,NULL,'2024-12-30 11:55:45');
/*!40000 ALTER TABLE `presser_bale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reas_not_tying`
--

DROP TABLE IF EXISTS `reas_not_tying`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reas_not_tying` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reas_not_tying`
--

LOCK TABLES `reas_not_tying` WRITE;
/*!40000 ALTER TABLE `reas_not_tying` DISABLE KEYS */;
INSERT INTO `reas_not_tying` VALUES (1,'-'),(2,'Fili strappati'),(3,'Fili insufficienti'),(4,'Filo terminato'),(5,'Trasporto muletto'),(6,'Balla caduta'),(7,'Altre motivazioni (vedi note)');
/*!40000 ALTER TABLE `reas_not_tying` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rei`
--

DROP TABLE IF EXISTS `rei`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rei` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rei`
--

LOCK TABLES `rei` WRITE;
/*!40000 ALTER TABLE `rei` DISABLE KEYS */;
INSERT INTO `rei` VALUES (1,'No'),(2,'Parziale'),(3,'Non legata'),(4,'Da magazzino');
/*!40000 ALTER TABLE `rei` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selected_bale`
--

DROP TABLE IF EXISTS `selected_bale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `selected_bale` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selected_bale`
--

LOCK TABLES `selected_bale` WRITE;
/*!40000 ALTER TABLE `selected_bale` DISABLE KEYS */;
INSERT INTO `selected_bale` VALUES (1,'No'),(2,'Corepla'),(3,'Coripet'),(4,'Uso interno');
/*!40000 ALTER TABLE `selected_bale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `surname` varchar(150) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_access` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','Andrea','Storci','andrea','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:09:45'),(2,'presser','Pressista','1','utente01','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:51:52'),(3,'wheelman','Carrellista','1','utente02','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:51:52'),(4,'both','Amministratore','1','utente03','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:51:52');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse_dest`
--

DROP TABLE IF EXISTS `warehouse_dest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_dest` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_dest`
--

LOCK TABLES `warehouse_dest` WRITE;
/*!40000 ALTER TABLE `warehouse_dest` DISABLE KEYS */;
INSERT INTO `warehouse_dest` VALUES (1,'Interno'),(2,'Provvisorio'),(3,'Corepla'),(4,'Coripet'),(5,'Altro');
/*!40000 ALTER TABLE `warehouse_dest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wheelman_bale`
--

DROP TABLE IF EXISTS `wheelman_bale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wheelman_bale` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_wheelman` int unsigned DEFAULT NULL,
  `id_cwb` int unsigned DEFAULT '1',
  `id_rnt` int unsigned DEFAULT '1',
  `id_wd` int unsigned DEFAULT '1',
  `note` text,
  `printed` tinyint(1) DEFAULT '0',
  `weight` int unsigned DEFAULT NULL,
  `data_ins` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `id_wd` (`id_wd`),
  KEY `id_wheelman` (`id_wheelman`),
  KEY `id_cwb` (`id_cwb`),
  KEY `id_rnt` (`id_rnt`),
  CONSTRAINT `wheelman_bale_ibfk_1` FOREIGN KEY (`id_wheelman`) REFERENCES `user` (`id`),
  CONSTRAINT `wheelman_bale_ibfk_2` FOREIGN KEY (`id_cwb`) REFERENCES `cond_wheelman_bale` (`id`),
  CONSTRAINT `wheelman_bale_ibfk_3` FOREIGN KEY (`id_rnt`) REFERENCES `reas_not_tying` (`id`),
  CONSTRAINT `wheelman_bale_ibfk_4` FOREIGN KEY (`id_wd`) REFERENCES `warehouse_dest` (`id`),
  CONSTRAINT `wheelman_bale_ibfk_5` FOREIGN KEY (`id_wheelman`) REFERENCES `user` (`id`),
  CONSTRAINT `wheelman_bale_ibfk_6` FOREIGN KEY (`id_cwb`) REFERENCES `cond_wheelman_bale` (`id`),
  CONSTRAINT `wheelman_bale_ibfk_7` FOREIGN KEY (`id_rnt`) REFERENCES `reas_not_tying` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wheelman_bale`
--

LOCK TABLES `wheelman_bale` WRITE;
/*!40000 ALTER TABLE `wheelman_bale` DISABLE KEYS */;
INSERT INTO `wheelman_bale` VALUES (22,2,1,1,2,'Prova 1',1,887,'2024-12-10 09:09:15'),(23,2,1,2,1,'Prova 2',1,456,'2024-12-16 09:09:15'),(24,1,1,1,1,NULL,0,NULL,'2024-12-10 09:13:51'),(25,1,1,1,1,NULL,0,NULL,'2024-12-10 14:15:24'),(26,NULL,1,1,1,NULL,0,NULL,'2024-12-12 16:18:06'),(27,NULL,1,1,1,NULL,0,NULL,'2024-12-12 16:18:27'),(28,NULL,1,1,1,NULL,0,NULL,'2024-12-16 10:41:43'),(29,NULL,1,1,1,NULL,0,NULL,'2024-12-16 11:10:03'),(30,NULL,1,1,1,NULL,0,NULL,'2024-12-16 11:45:54'),(31,NULL,1,1,1,NULL,0,NULL,'2024-12-17 11:33:03'),(32,NULL,1,1,1,NULL,0,NULL,'2024-12-17 11:33:06'),(33,NULL,1,1,1,NULL,0,NULL,'2024-12-17 11:49:47'),(34,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:07:29'),(35,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:07:36'),(36,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:08:22'),(37,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:09:03'),(38,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:09:05'),(39,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:09:12'),(40,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:13:29'),(41,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:13:42'),(42,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:13:48'),(43,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:13:52'),(44,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:14:22'),(45,NULL,1,1,1,NULL,0,NULL,'2024-12-17 12:40:34'),(46,NULL,1,1,1,NULL,0,NULL,'2024-12-19 08:50:42'),(47,NULL,1,1,1,NULL,0,NULL,'2024-12-19 08:52:10'),(48,NULL,1,1,1,NULL,0,NULL,'2024-12-19 08:56:15'),(49,NULL,1,1,1,NULL,0,NULL,'2024-12-19 09:50:02'),(50,NULL,1,1,1,NULL,0,NULL,'2024-12-19 10:00:36'),(51,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:21:04'),(52,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:21:59'),(53,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:28:07'),(54,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:29:33'),(55,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:30:15'),(56,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:30:42'),(57,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:31:08'),(58,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:31:31'),(59,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:35:53'),(60,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:36:31'),(61,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:45:47'),(62,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:47:17'),(63,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:53:02'),(64,NULL,1,1,1,NULL,0,NULL,'2024-12-19 11:53:39'),(65,NULL,1,1,1,NULL,0,NULL,'2024-12-24 08:57:22'),(66,NULL,1,1,1,NULL,0,NULL,'2024-12-24 10:03:35'),(67,NULL,1,1,1,NULL,0,NULL,'2024-12-24 12:01:29'),(68,NULL,1,1,1,NULL,0,NULL,'2024-12-24 12:04:22'),(69,NULL,1,1,1,NULL,0,NULL,'2024-12-24 12:06:01'),(70,NULL,1,1,1,NULL,0,NULL,'2024-12-27 09:31:12'),(71,NULL,1,1,1,NULL,0,NULL,'2024-12-27 09:31:26'),(72,NULL,1,1,1,NULL,0,NULL,'2024-12-27 09:42:07'),(73,NULL,1,1,1,NULL,0,NULL,'2024-12-27 09:59:36'),(74,NULL,1,1,1,NULL,0,NULL,'2024-12-27 09:59:53'),(75,NULL,1,1,1,NULL,0,NULL,'2024-12-27 10:55:26'),(76,NULL,1,1,1,NULL,0,NULL,'2024-12-27 11:45:20'),(77,NULL,1,1,1,NULL,0,NULL,'2024-12-27 11:45:47'),(78,NULL,1,1,1,NULL,0,NULL,'2024-12-30 09:38:26'),(79,NULL,1,1,1,NULL,0,NULL,'2024-12-30 11:06:10'),(80,NULL,1,1,1,NULL,0,NULL,'2024-12-30 11:34:30'),(81,NULL,1,1,1,NULL,0,NULL,'2024-12-30 11:34:30'),(82,NULL,1,1,1,NULL,0,NULL,'2024-12-30 11:35:14'),(83,NULL,1,1,1,NULL,0,NULL,'2024-12-30 11:47:45'),(84,NULL,1,1,1,NULL,0,NULL,'2024-12-30 11:55:45');
/*!40000 ALTER TABLE `wheelman_bale` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-07 10:17:38

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_plastic`
--

LOCK TABLES `code_plastic` WRITE;
/*!40000 ALTER TABLE `code_plastic` DISABLE KEYS */;
INSERT INTO `code_plastic` VALUES ('ALLUM.','Alluminio','20050'),('CAS/M','Cassette di plastica','28710'),('CHEMIX/C','CHEMIX/C (CHEMIX)','27257'),('CSS','CSS','99901'),('CTA/M','Contenitori di Pet azzurrato','26010'),('CTC/M','Contenitori di PET colorato','22010'),('CTE/M','Contenitori di HDPE','24010'),('CTL/M','Contenitori di PET incolore','25010'),('FERRO','Ferro','20050'),('FILM-C','Film di imballaggio colorato','24612'),('FILM-N','Film di imballaggio neutro','2B610'),('FLEX/S','Altri imballaggi misti riciclabili','28612'),('IPP/C','Imballaggi misti di Polipropilene','2A210'),('IPS/C','Imballaggi rigidi di Polistirene','29210'),('MCPL/M','MCPL/M (MCPL-PET1)','22016'),('MDR','MATERIALE DA RILAVORARE','99902'),('MDR PET','MDR PET','99903'),('MDR/FE','MDR/FE','99904'),('MPR/C','Imballaggi rigidi di poliolefine','28411'),('MPR/S','MPR/S','99905'),('PLASMIX TL','Flusso residuo materiale sottoposto a vagliatura','27213'),('RPO/M','Altri imballaggi misti poliolefinici','27253'),('TL/ING','TL/ING','99906'),('VPET/C','VPET/C','21410');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`id_pb`,`id_wb`),
  KEY `id_wb` (`id_wb`),
  CONSTRAINT `pb_wb_ibfk_1` FOREIGN KEY (`id_wb`) REFERENCES `wheelman_bale` (`id`),
  CONSTRAINT `pb_wb_ibfk_2` FOREIGN KEY (`id_pb`) REFERENCES `presser_bale` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pb_wb`
--

LOCK TABLES `pb_wb` WRITE;
/*!40000 ALTER TABLE `pb_wb` DISABLE KEYS */;
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
  `id_presser` int unsigned DEFAULT NULL,
  `id_plastic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_rei` int unsigned DEFAULT NULL,
  `id_cpb` int unsigned DEFAULT NULL,
  `id_sb` int unsigned DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presser_bale`
--

LOCK TABLES `presser_bale` WRITE;
/*!40000 ALTER TABLE `presser_bale` DISABLE KEYS */;
INSERT INTO `presser_bale` VALUES (39,3,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:44:09'),(40,3,'FERRO',1,1,1,'Prova test','2024-11-28 16:44:09'),(41,3,'FILM-C',1,1,1,'Prova test','2024-11-28 16:44:09'),(42,3,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:44:09'),(43,3,'VPET/C',1,1,1,'Prova test','2024-11-28 16:44:09'),(44,3,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:44:09'),(45,3,'FERRO',1,1,1,'Prova test','2024-11-28 16:44:09'),(46,3,'FILM-C',1,1,1,'Prova test','2024-11-28 16:44:09'),(47,3,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:44:09'),(48,3,'VPET/C',1,1,1,'Prova test','2024-11-28 16:44:09'),(49,3,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:44:09'),(50,3,'FERRO',1,1,1,'Prova test','2024-11-28 16:44:09'),(51,3,'FILM-C',1,1,1,'Prova test','2024-11-28 16:44:09'),(52,3,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:44:09'),(53,3,'VPET/C',1,1,1,'Prova test','2024-11-28 16:44:09'),(54,3,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:44:09'),(55,3,'FERRO',1,1,1,'Prova test','2024-11-28 16:44:09'),(56,3,'FILM-C',1,1,1,'Prova test','2024-11-28 16:44:09'),(57,3,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:44:09'),(58,3,'VPET/C',1,1,1,'Prova test','2024-11-28 16:44:09'),(59,3,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:44:09'),(60,3,'FERRO',1,1,1,'Prova test','2024-11-28 16:44:09'),(61,3,'FILM-C',1,1,1,'Prova test','2024-11-28 16:44:09'),(62,3,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:44:09'),(63,3,'VPET/C',1,1,1,'Prova test','2024-11-28 16:44:09'),(64,2,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:48:47'),(65,2,'FERRO',1,1,1,'Prova test','2024-11-28 16:48:47'),(66,2,'FILM-C',1,1,1,'Prova test','2024-11-28 16:48:47'),(67,2,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:48:47'),(68,2,'VPET/C',1,1,1,'Prova test','2024-11-28 16:48:47'),(69,2,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:48:47'),(70,2,'FERRO',1,1,1,'Prova test','2024-11-28 16:48:47'),(71,2,'FILM-C',1,1,1,'Prova test','2024-11-28 16:48:47'),(72,2,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:48:47'),(73,2,'VPET/C',1,1,1,'Prova test','2024-11-28 16:48:47'),(74,2,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:48:47'),(75,2,'FERRO',1,1,1,'Prova test','2024-11-28 16:48:47'),(76,2,'FILM-C',1,1,1,'Prova test','2024-11-28 16:48:47'),(77,2,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:48:47'),(78,2,'VPET/C',1,1,1,'Prova test','2024-11-28 16:48:47'),(79,2,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:48:47'),(80,2,'FERRO',1,1,1,'Prova test','2024-11-28 16:48:47'),(81,2,'FILM-C',1,1,1,'Prova test','2024-11-28 16:48:47'),(82,2,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:48:47'),(83,2,'VPET/C',1,1,1,'Prova test','2024-11-28 16:48:47'),(84,2,'MCPL/M',1,1,1,'Prova test','2024-11-28 16:48:47'),(85,2,'FERRO',1,1,1,'Prova test','2024-11-28 16:48:47'),(86,2,'FILM-C',1,1,1,'Prova test','2024-11-28 16:48:47'),(87,2,'PLASMIX TL',1,1,1,'Prova test','2024-11-28 16:48:47'),(88,2,'VPET/C',1,1,1,'Prova test','2024-11-28 16:48:47');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','Andrea','Storci','andrea','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:09:45'),(2,'presser','Gianluca','Oppimitti','utente01','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:51:52'),(3,'wheelman','Mario','Rossi','utente02','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:51:52'),(4,'both','Isabella','Bozzuffi','utente03','c3284d0f94606de1fd2af172aba15bf3','2024-11-19 11:51:52');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id_cwb` int unsigned DEFAULT NULL,
  `id_rnt` int unsigned DEFAULT NULL,
  `id_wd` int unsigned DEFAULT NULL,
  `note` text,
  `printed` tinyint(1) DEFAULT '0',
  `data_ins` datetime DEFAULT (now()),
  `weight` int unsigned DEFAULT NULL COMMENT 'Peso intero',
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wheelman_bale`
--

LOCK TABLES `wheelman_bale` WRITE;
/*!40000 ALTER TABLE `wheelman_bale` DISABLE KEYS */;
INSERT INTO `wheelman_bale` VALUES (3,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(4,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(5,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(6,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(7,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(8,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(9,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(10,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(11,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(12,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(13,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(14,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(15,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(16,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(17,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(18,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(19,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(20,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(21,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(22,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(23,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(24,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(25,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(26,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(27,3,1,1,1,'testo prova',0,'2024-11-28 16:47:26',340),(28,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(29,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(30,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(31,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(32,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(33,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(34,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(35,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(36,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(37,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(38,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(39,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(40,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(41,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(42,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(43,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(44,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(45,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(46,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(47,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(48,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(49,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(50,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(51,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340),(52,2,1,1,1,'testo prova',0,'2024-11-28 16:48:49',340);
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

-- Dump completed on 2024-12-02 10:22:01

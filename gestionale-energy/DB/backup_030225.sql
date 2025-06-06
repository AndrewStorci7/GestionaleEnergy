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
  `id_implant` int unsigned DEFAULT NULL,
  `status` int DEFAULT '0' COMMENT 'Lo Status sarà lo stato della lavorazione e può avere valore 0(In Lavorazione)/1(Completato) oppure -1(Cambio/Modifica/Errore)',
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_pb`,`id_wb`),
  UNIQUE KEY `id` (`id`),
  KEY `id_wb` (`id_wb`),
  CONSTRAINT `pb_wb_ibfk_1` FOREIGN KEY (`id_wb`) REFERENCES `wheelman_bale` (`id`),
  CONSTRAINT `pb_wb_ibfk_2` FOREIGN KEY (`id_pb`) REFERENCES `presser_bale` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pb_wb`
--

LOCK TABLES `pb_wb` WRITE;
/*!40000 ALTER TABLE `pb_wb` DISABLE KEYS */;
INSERT INTO `pb_wb` VALUES (144,134,1,0,1),(145,135,1,0,2),(146,136,1,0,3),(147,137,1,0,4),(148,138,1,0,5),(149,139,2,0,6),(150,140,2,0,7),(151,141,2,0,8),(152,142,2,0,9),(153,143,2,0,10),(154,144,2,0,11),(155,145,2,0,12),(156,146,2,0,13),(157,147,2,0,14),(158,148,2,0,15),(159,149,2,0,16),(160,150,2,0,17),(161,151,2,1,18),(163,153,2,1,19),(164,154,2,1,20),(165,155,2,0,21),(167,157,2,0,23),(168,158,2,0,24),(169,159,2,0,25),(170,160,2,0,26),(171,161,2,0,27),(172,162,2,0,28),(173,163,2,0,29),(174,164,2,0,30),(175,165,2,0,31),(176,166,2,0,32),(177,167,2,0,33),(178,168,2,0,34),(180,170,2,0,35),(181,171,2,0,36),(182,172,2,0,37),(183,173,2,0,38),(184,174,2,0,39),(185,175,2,0,40),(186,176,2,0,41),(187,177,2,0,42),(188,178,2,0,43),(189,179,2,0,44),(190,180,2,0,45),(191,181,2,0,46),(192,182,2,0,47),(193,183,2,0,48),(194,184,2,0,49),(195,185,2,0,50),(197,187,2,-1,51),(199,189,2,0,52),(201,191,2,-1,53),(202,192,2,0,54),(203,193,2,0,55),(207,197,1,0,56),(208,198,1,0,57);
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
  `id_plastic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'none',
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
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presser_bale`
--

LOCK TABLES `presser_bale` WRITE;
/*!40000 ALTER TABLE `presser_bale` DISABLE KEYS */;
INSERT INTO `presser_bale` VALUES (149,2,'CTC/M',3,1,4,'rraewaf','2025-01-27 07:52:55'),(150,2,'CHEMIX/C',2,2,1,'dadasdsa','2025-01-27 08:55:06'),(151,2,'IPP/C',1,2,2,'dadasdsa','2025-01-27 15:56:22'),(152,2,'CTA/M',1,2,3,'sfsdfs','2025-01-27 17:05:32'),(153,2,'CAS/M',1,1,2,'sfsdfs','2025-01-27 23:05:48'),(154,2,'ALLUM.',1,2,1,NULL,'2025-01-27 23:16:49'),(155,2,'CAS/M',1,1,4,'rraewaf','2025-01-28 09:43:39'),(156,2,'CHEMIX/C',3,2,2,'sfsdfs','2025-01-29 22:44:46'),(157,2,'IPP/C',1,1,1,NULL,'2025-01-30 01:45:04'),(158,2,'CAS/M',1,2,2,'dadasdsa','2025-01-29 14:52:07'),(159,2,'ALLUM.',1,1,1,NULL,'2025-01-29 14:07:54'),(160,2,'CHEMIX/C',1,1,1,NULL,'2025-01-29 08:19:25'),(161,2,'CAS/M',2,1,1,NULL,'2025-01-29 09:02:24'),(162,2,'none',1,1,1,NULL,'2025-01-30 14:34:58'),(163,2,'RPO/M',1,1,1,NULL,'2025-01-30 14:10:00'),(164,2,'FILM-C',1,1,1,NULL,'2025-01-30 14:15:00'),(165,2,'MDR',1,1,1,NULL,'2025-01-30 14:30:00'),(167,2,'CTL/M',1,1,1,NULL,'2025-01-30 14:55:00'),(168,2,'CTA/M',1,1,1,NULL,'2025-01-30 15:05:00'),(169,2,'FERRO',1,1,1,NULL,'2025-01-30 15:10:00'),(170,2,'FILM-C',1,1,1,NULL,'2025-01-30 15:20:00'),(171,2,'RPO/M',1,1,1,NULL,'2025-01-30 15:35:00'),(172,2,'TL/ING',1,1,1,NULL,'2025-01-30 15:40:00'),(173,2,'CTC/M',4,1,1,NULL,'2025-01-30 15:50:00'),(174,2,'RPO/M',1,1,1,NULL,'2025-01-30 16:00:00'),(175,2,'MDR',1,1,1,NULL,'2025-01-30 16:10:00'),(176,2,'FILM-C',1,1,1,NULL,'2025-01-30 16:20:00'),(177,2,'RPO/M',1,1,1,NULL,'2025-01-30 16:40:00'),(178,2,'CTA/M',1,1,1,NULL,'2025-01-30 16:50:00'),(180,2,'MPR/C',4,1,1,NULL,'2025-01-30 17:00:00'),(181,2,'MDR',1,1,1,NULL,'2025-01-30 17:05:00'),(182,2,'FILM-C',1,1,1,NULL,'2025-01-30 17:10:00'),(183,2,'CTL/M',1,1,1,NULL,'2025-01-30 17:25:00'),(184,2,'RPO/M',1,1,1,NULL,'2025-01-30 17:35:00'),(185,2,'TL/ING',1,1,1,NULL,'2025-01-30 17:45:00'),(186,2,'FILM-C',1,1,1,NULL,'2025-01-30 17:50:00'),(187,2,'FERRO',4,1,1,NULL,'2025-01-30 17:10:00'),(188,2,'RPO/M',1,1,1,NULL,'2025-01-30 18:15:00'),(189,2,'MDR',1,1,1,NULL,'2025-01-30 18:10:00'),(190,2,'CTA/M',1,1,1,NULL,'2025-01-30 18:20:00'),(191,2,'CTC/M',1,1,1,NULL,'2025-01-30 18:25:00'),(192,2,'FILM-C',1,1,1,NULL,'2025-01-30 18:35:00'),(193,2,'RPO/M',1,1,1,NULL,'2025-01-30 18:50:00'),(194,2,'ALLUM.',1,1,1,NULL,'2025-01-30 19:32:30'),(195,2,'CTE/M',1,1,1,NULL,'2025-01-30 19:33:22'),(197,2,'CAS/M',3,1,1,NULL,'2025-01-30 20:20:33'),(199,2,'CSS',1,1,1,NULL,'2025-01-30 14:34:51'),(201,2,'IPS/C',2,1,1,NULL,'2025-01-30 14:35:07'),(202,2,'CTC/M',1,1,1,NULL,'2025-01-30 14:35:41'),(203,2,'MCPL/M',1,1,1,NULL,'2025-01-30 16:06:20'),(204,2,'none',1,1,1,NULL,'2025-02-03 09:05:36'),(205,2,'none',1,1,1,NULL,'2025-02-03 09:05:51'),(206,2,'none',1,1,1,NULL,'2025-02-03 09:09:29'),(207,2,'FILM-C',1,1,1,NULL,'2025-02-03 09:12:04'),(208,2,'CTL/M',1,1,1,NULL,'2025-02-03 09:12:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wheelman_bale`
--

LOCK TABLES `wheelman_bale` WRITE;
/*!40000 ALTER TABLE `wheelman_bale` DISABLE KEYS */;
INSERT INTO `wheelman_bale` VALUES (134,NULL,1,1,1,NULL,0,NULL,'2025-01-23 11:36:52'),(135,3,2,1,1,NULL,0,670,'2025-01-23 11:37:01'),(136,3,1,1,1,NULL,0,450,'2025-01-23 11:37:09'),(137,3,1,1,1,NULL,0,350,'2025-01-24 11:37:13'),(138,3,1,1,1,NULL,0,200,'2025-01-23 11:37:16'),(139,NULL,1,1,1,NULL,0,NULL,'2025-01-27 08:55:06'),(140,NULL,1,1,1,NULL,0,NULL,'2025-01-27 08:55:06'),(141,NULL,1,1,1,NULL,0,NULL,'2025-01-27 15:56:22'),(142,NULL,1,1,1,NULL,0,NULL,'2025-01-27 17:05:32'),(143,NULL,1,1,1,NULL,0,NULL,'2025-01-27 23:16:49'),(144,NULL,1,1,1,NULL,0,NULL,'2025-01-27 23:16:49'),(145,NULL,1,1,1,NULL,0,NULL,'2025-01-28 09:43:39'),(146,NULL,1,1,1,NULL,0,NULL,'2025-01-29 22:44:46'),(147,NULL,1,1,1,NULL,0,NULL,'2025-01-30 01:45:04'),(148,NULL,1,1,1,NULL,0,NULL,'2025-01-29 14:52:07'),(149,NULL,1,1,1,NULL,0,NULL,'2025-01-29 14:07:54'),(150,NULL,1,1,1,NULL,0,NULL,'2025-01-29 08:19:25'),(151,NULL,1,1,1,NULL,0,NULL,'2025-01-29 09:02:24'),(152,3,1,1,1,NULL,0,NULL,'2025-01-30 14:34:58'),(153,NULL,1,1,1,NULL,0,NULL,'2025-01-30 14:43:32'),(154,NULL,1,1,1,NULL,0,NULL,'2025-01-30 14:44:55'),(155,NULL,1,1,1,NULL,0,NULL,'2025-01-30 14:45:56'),(157,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:47:19'),(158,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:48:14'),(159,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:48:46'),(160,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:49:18'),(161,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:50:04'),(162,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:50:43'),(163,NULL,1,1,1,NULL,0,NULL,'2025-01-30 08:51:33'),(164,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:09:49'),(165,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:10:27'),(166,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:11:10'),(167,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:11:41'),(168,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:12:40'),(169,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:13:18'),(170,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:20:51'),(171,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:21:37'),(172,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:22:18'),(173,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:22:50'),(174,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:23:51'),(175,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:24:39'),(176,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:24:59'),(177,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:29:57'),(178,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:31:04'),(179,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:31:34'),(180,NULL,1,1,1,NULL,0,NULL,'2025-01-30 09:48:33'),(181,NULL,1,1,2,NULL,0,NULL,'2025-01-30 09:49:07'),(182,NULL,1,1,2,NULL,0,NULL,'2025-01-30 09:49:30'),(183,NULL,1,1,3,NULL,0,NULL,'2025-01-30 09:49:52'),(184,NULL,1,1,3,NULL,0,NULL,'2025-01-30 10:32:30'),(185,NULL,1,1,1,NULL,0,NULL,'2025-01-30 10:33:22'),(187,NULL,1,1,2,NULL,0,NULL,'2025-01-30 12:20:33'),(189,NULL,2,1,1,NULL,0,NULL,'2025-01-30 14:34:51'),(191,NULL,2,1,1,NULL,0,NULL,'2025-01-30 14:35:07'),(192,NULL,2,1,1,NULL,0,NULL,'2025-01-30 14:35:41'),(193,NULL,1,1,1,NULL,0,NULL,'2025-01-30 16:06:20'),(194,NULL,1,1,1,NULL,0,NULL,'2025-02-03 09:05:36'),(195,NULL,1,1,1,NULL,0,NULL,'2025-02-03 09:05:51'),(196,NULL,1,1,1,NULL,0,NULL,'2025-02-03 09:09:29'),(197,NULL,1,1,1,NULL,0,NULL,'2025-02-03 09:12:04'),(198,NULL,1,1,1,NULL,0,NULL,'2025-02-03 09:12:26');
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

-- Dump completed on 2025-02-03  9:15:48

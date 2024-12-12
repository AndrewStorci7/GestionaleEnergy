CREATE TABLE `code_plastic` (
  `code` varchar(200) PRIMARY KEY NOT NULL,
  `type` varchar(150) NOT NULL,
  `desc` varchar(255) NOT NULL DEFAULT ''
);

CREATE TABLE `warehouse_dest` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(150)
);

CREATE TABLE `rei` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `user` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type` varchar(255),
  `name` varchar(150),
  `surname` varchar(150),
  `username` varchar(150) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_access` datatime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `implants` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL
);

CREATE TABLE `cond_presser_bale` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type` varchar(150) NOT NULL
);

CREATE TABLE `cond_wheelman_bale` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type` varchar(150) NOT NULL
);

CREATE TABLE `selected_bale` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL
);

CREATE TABLE `reas_not_tying` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL
);

CREATE TABLE `presser_bale` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_presser` INT UNSIGNED NULL,
  `id_plastic` varchar(200) NULL,
  `id_rei` INT UNSIGNED NULL,
  `id_cpb` INT UNSIGNED NULL,
  `id_sb` INT UNSIGNED NULL,
  `note` text,
  `data_ins` datatime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `wheelman_bale` (
  `id` INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_wheelman` INT UNSIGNED NULL,
  `id_cwb` INT UNSIGNED NULL,
  `id_rnt` INT UNSIGNED NULL,
  `id_wd` INT UNSIGNED NULL,
  `note` text,
  `printed` bool DEFAULT false,
  `data_ins` datatime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `pb_wb` (
  `id_pb` INT UNSIGNED NOT NULL,
  `id_wb` INT UNSIGNED NOT NULL,
  `id_implants` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_pb`, `id_wb`)
);

ALTER TABLE `presser_bale` ADD FOREIGN KEY (`id_presser`) REFERENCES `user` (`id`);

ALTER TABLE `presser_bale` ADD FOREIGN KEY (`id_plastic`) REFERENCES `code_plastic` (`code`);

ALTER TABLE `presser_bale` ADD FOREIGN KEY (`id_rei`) REFERENCES `rei` (`id`);

ALTER TABLE `presser_bale` ADD FOREIGN KEY (`id_cpb`) REFERENCES `cond_presser_bale` (`id`);

ALTER TABLE `presser_bale` ADD FOREIGN KEY (`id_sb`) REFERENCES `selected_bale` (`id`);

ALTER TABLE `wheelman_bale` ADD FOREIGN KEY (`id_wheelman`) REFERENCES `user` (`id`);

ALTER TABLE `wheelman_bale` ADD FOREIGN KEY (`id_cwb`) REFERENCES `cond_wheelman_bale` (`id`);

ALTER TABLE `wheelman_bale` ADD FOREIGN KEY (`id_rnt`) REFERENCES `reas_not_tying` (`id`);

ALTER TABLE `wheelman_bale` ADD FOREIGN KEY (`id_wd`) REFERENCES `warehouse_dest` (`id`);

ALTER TABLE `pb_wb` ADD FOREIGN KEY (`id_wb`) REFERENCES `wheelman_bale` (`id`);

ALTER TABLE `pb_wb` ADD FOREIGN KEY (`id_pb`) REFERENCES `presser_bale` (`id`);

ALTER TABLE `pb_wb` ADD FOREIGN KEY (`id_implants`) REFERENCES `implants` (`id`);


/* create gabble database */
CREATE SCHEMA `gabble` ;


/* create users table */
CREATE TABLE `gabble`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25) NOT NULL,
  `password` BINARY(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC));

/* create gab table */
  CREATE TABLE `gabble`.`gab` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `author` INT NOT NULL,
  `content` VARCHAR(140) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

  /* create likes table */
  CREATE TABLE `gabble`.`likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gab_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`));

/* add unique constraint for user_id and gab_id */
ALTER TABLE gabble.likes
ADD CONSTRAINT uq_user_gab UNIQUE(gab_id, user_id);

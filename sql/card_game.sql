-- Drop the database if it exists
DROP DATABASE IF EXISTS `card_game`;

-- Creates the database
CREATE DATABASE `card_game`;

-- Sets the table to run commands on
USE `card_game`; 

-- Create the scores table
CREATE TABLE `tags_and_scores` (
  `tag` varchar(55) NOT NULL,
  `difficulty` varchar(55) NOT NULL,
  `duration` bigint(20) unsigned NOT NULL DEFAULT '0',
  `score` bigint(20) unsigned NOT NULL DEFAULT '0',
  `date` bigint(20) unsigned NOT NULL DEFAULT '0',
  CONSTRAINT tags_and_scores_pk PRIMARY KEY (`tag`, `date`)
);

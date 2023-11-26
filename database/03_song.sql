/*
Author:			This code was generated by DALGen Web available at https://dalgen.opendevtools.org
Date:			02/05/2023
Description:		Creates the Song table and respective stored procedures

*/

USE eclecticpickupdb;


-- Create Table 

CREATE TABLE `eclecticpickupdb`.`Song` (
id INT AUTO_INCREMENT,
artistId INT NOT NULL,
albumId INT NOT NULL,
name VARCHAR(255),
songPath VARCHAR(512),
trackNumber INT,
CONSTRAINT pk_Song_id PRIMARY KEY (id),
CONSTRAINT fk_Song_artistId_Artist_id FOREIGN KEY (artistId) REFERENCES Artist (id),
CONSTRAINT fk_Song_albumId_Album_id FOREIGN KEY (albumId) REFERENCES Album (id)
);


DELIMITER //
CREATE PROCEDURE `eclecticpickupdb`.`usp_Song_Load`
(
	IN paramid INT
)
BEGIN
	SELECT
		`Song`.`id` AS `id`,
		`Song`.`artistId` AS `artistId`,
		`Song`.`albumId` AS `albumId`,
		`Song`.`name` AS `name`,
		`Song`.`songPath` AS `songPath`,
		`Song`.`trackNumber` AS `trackNumber`
	FROM `Song`
	WHERE `Song`.`id` = paramid;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `eclecticpickupdb`.`usp_Song_LoadAll`
(
)
BEGIN
	SELECT
		`Song`.`id` AS `id`,
		`Song`.`artistId` AS `artistId`,
		`Song`.`albumId` AS `albumId`,
		`Song`.`name` AS `name`,
		`Song`.`songPath` AS `songPath`,
		`Song`.`trackNumber` AS `trackNumber`
	FROM `Song`;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `eclecticpickupdb`.`usp_Song_Add`
(
	IN paramartistId INT,
	IN paramalbumId INT,
	IN paramname VARCHAR(255),
	IN paramsongPath VARCHAR(512),
	IN paramtrackNumber INT
)
BEGIN
	INSERT INTO `Song` (artistId,albumId,name,songPath,trackNumber)
	VALUES (paramartistId,paramalbumId,paramname,paramsongPath,paramtrackNumber);
	-- Return last inserted ID as result
	SELECT LAST_INSERT_ID() as id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `eclecticpickupdb`.`usp_Song_Update`
(
	IN paramid INT,
	IN paramartistId INT,
	IN paramalbumId INT,
	IN paramname VARCHAR(255),
	IN paramsongPath VARCHAR(512),
	IN paramtrackNumber INT
)
BEGIN
	UPDATE `Song`
	SET
		artistId = paramartistId,
		albumId = paramalbumId,
		name = paramname,
		songPath = paramsongPath,
		trackNumber = paramtrackNumber
	WHERE 
		id = paramid;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `eclecticpickupdb`.`usp_Song_Delete`
(
	IN paramid INT
)
BEGIN
	DELETE FROM `Song`
	WHERE `Song`.`id` = paramid;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `eclecticpickupdb`.`usp_Song_Search`
(
	IN paramid INT,
	IN paramartistId INT,
	IN paramalbumId INT,
	IN paramname VARCHAR(255),
	IN paramsongPath VARCHAR(512),
	IN paramtrackNumber INT
)
BEGIN
	SELECT
		`Song`.`id` AS `id`,
		`Song`.`artistId` AS `artistId`,
		`Song`.`albumId` AS `albumId`,
		`Song`.`name` AS `name`,
		`Song`.`songPath` AS `songPath`,
		`Song`.`trackNumber` AS `trackNumber`
	FROM `Song`
	WHERE 
		COALESCE(`Song`.`id`,0) = COALESCE(paramid,`Song`.`id`,0)
		 AND COALESCE(`Song`.`artistId`,0) = COALESCE(paramartistId,`Song`.`artistId`,0)
		 AND COALESCE(`Song`.`albumId`,0) = COALESCE(paramalbumId,`Song`.`albumId`,0)
		 AND COALESCE(`Song`.`name`,'') LIKE COALESCE(CONCAT('%', paramname, '%'),`Song`.`name`,'')
		 AND COALESCE(`Song`.`songPath`,'') LIKE COALESCE(CONCAT('%', paramsongPath, '%'),`Song`.`songPath`,'')
		 AND COALESCE(`Song`.`trackNumber`,0) = COALESCE(paramtrackNumber,`Song`.`trackNumber`,0);
END //
DELIMITER ;


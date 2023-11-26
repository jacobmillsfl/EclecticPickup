-- ------------------------------
-- Author: Jacob Mills
-- Date: 07/09/23
-- Asana Task: https://app.asana.com/0/1204113129752279/1204752567040536
-- Description: This script adds spaces between song names in the
--              Soul On Fire album playlist / album.
-- ------------------------------


UPDATE `eclecticpickupdb`.`Song`
SET name = 'Free Your Mind'
WHERE name = 'FreeYourMind';

UPDATE `eclecticpickupdb`.`Song`
SET name = 'Jumping It Up'
WHERE name = 'JumpingItUp';

UPDATE `eclecticpickupdb`.`Song`
SET name = 'Heaven Light My Candle'
WHERE name = 'HeavenLightMyCandle';

UPDATE `eclecticpickupdb`.`Song`
SET name = 'The Distance Between Us'
WHERE name = 'TheDistanceBetweenUs';

UPDATE `eclecticpickupdb`.`Song`
SET name = 'Soul On Fire'
WHERE name = 'SoulOnFire';

UPDATE `eclecticpickupdb`.`Song`
SET name = 'Abyss of Bliss'
WHERE name = 'AbyssOfBliss';

UPDATE `eclecticpickupdb`.`Song`
SET name = 'Bring It Back'
WHERE name = 'BringItBack';
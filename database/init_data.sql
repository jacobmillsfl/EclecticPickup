-- ------------------------------------------------------
-- Initializes tables with default data
-- WARNING: This should be the final script called during
--          database initialization
-- ------------------------------------------------------

-- Create Artists
CALL `eclecticpickupdb`.`usp_Artist_Add`('The Ambient Funk','','artist/the_ambient_funk.png');
SET @tafArtistId := LAST_INSERT_ID();
CALL `eclecticpickupdb`.`usp_Artist_Add`('Brigand','','artist/brigand.png');
SET @brigandArtistId := LAST_INSERT_ID();

-- Create Albums
CALL `eclecticpickupdb`.`usp_Album_Add`(@tafArtistId, 'TAF', 'album/taf.png','2020-12-18');
SET @tafAlbumId := LAST_INSERT_ID();
CALL `eclecticpickupdb`.`usp_Album_Add`(@tafArtistId, 'Soul On Fire', 'album/soul_on_fire.png','2022-08-01');
SET @tafAlbumSOF := LAST_INSERT_ID();
CALL `eclecticpickupdb`.`usp_Album_Add`(@brigandArtistId, 'The Vault', 'album/the_vault.jpg','2020-02-14');
SET @brigandAlbumId := LAST_INSERT_ID();

-- Create Songs

CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Think With Your Heart', 'song/ThinkWithYourHeart.mp3', 1);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Fallen', 'song/Fallen.mp3', 2);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Divinity', 'song/Divinity.mp3', 3);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Love and Try', 'song/LoveAndTry.mp3', 4);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'State of Mind', 'song/StateOfMind.mp3', 5);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Day in the Life', 'song/DayInTheLife.mp3', 6);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Indigo Eye', 'song/IndigoEye.mp3', 7);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Star Child', 'song/StarChild.mp3', 8);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Otherside', 'song/Otherside.mp3', 9);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumId, 'Trifold Ecstacy', 'song/TrifoldEcstacy.mp3', 10);

CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Rudimentary', 'song/Rudimentary.mp3', 1);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Free Your Mind', 'song/FreeYourMind.mp3', 2);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Jumping It Up', 'song/JumpingItUp.mp3', 3);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Vinculum', 'song/Vinculum.mp3', 4);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Heaven Light My Candle', 'song/HeavenLightMyCandle.mp3', 5);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'The Distance Between Us', 'song/TheDistanceBetweenUs.mp3', 6);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Acrophobia', 'song/Acrophobia.mp3', 7);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Soul On Fire', 'song/SoulOnFire.mp3', 8);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Abyss of Bliss', 'song/AbyssOfBliss.mp3', 9);
CALL `eclecticpickupdb`.`usp_Song_Add`(@tafArtistId, @tafAlbumSOF, 'Bring It Back', 'song/BringItBack.mp3', 10);

CALL `eclecticpickupdb`.`usp_Song_Add`(@brigandArtistId, @brigandAlbumId, 'All That Remains', 'song/AllThatRemains.mp3', 1);
CALL `eclecticpickupdb`.`usp_Song_Add`(@brigandArtistId, @brigandAlbumId, 'Another Domino', 'song/AnotherDomino.mp3', 2);
CALL `eclecticpickupdb`.`usp_Song_Add`(@brigandArtistId, @brigandAlbumId, 'Bleed the Same', 'song/BleedTheSame.mp3', 3);
CALL `eclecticpickupdb`.`usp_Song_Add`(@brigandArtistId, @brigandAlbumId, 'Life of Regret', 'song/LifeOfRegret.mp3', 4);
CALL `eclecticpickupdb`.`usp_Song_Add`(@brigandArtistId, @brigandAlbumId, 'Mouth of the Divine', 'song/MouthOfTheDivine.mp3', 5);
CALL `eclecticpickupdb`.`usp_Song_Add`(@brigandArtistId, @brigandAlbumId, 'Never Speak Again', 'song/NeverSpeakAgain.mp3', 6);


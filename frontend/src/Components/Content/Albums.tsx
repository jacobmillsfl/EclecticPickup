import { SocialLinks } from "./SocialLinks";
import {
  SiApplemusic,
  SiBandcamp,
  SiSpotify,
  SiYoutubemusic,
} from "react-icons/si";
import volume1Cover from "../../media/album-volume-1-800.webp";
import volume1CoverSmall from "../../media/album-volume-1-400.webp";
import volume2Cover from "../../media/album-volume-2-800.webp";
import volume2CoverSmall from "../../media/album-volume-2-400.webp";
import liveCover from "../../media/album-live-at-breck-800.webp";
import liveCoverSmall from "../../media/album-live-at-breck-400.webp";

const albums = [
  { title: "Volume 1", cover: volume1Cover, smallCover: volume1CoverSmall },
  { title: "Volume 2", cover: volume2Cover, smallCover: volume2CoverSmall },
  { title: "LIVE at Breck", cover: liveCover, smallCover: liveCoverSmall },
];
const artistLinks = [
  {
    text: "Spotify",
    hrefUrl: "https://open.spotify.com/artist/0HU4opVeWSZBryB0vZzxu4",
    imgUrl: "",
    icon: SiSpotify,
    iconColor: "#1DB954",
  },
  {
    text: "YouTube Music",
    hrefUrl: "https://music.youtube.com/@EclecticPickup",
    imgUrl: "",
    icon: SiYoutubemusic,
    iconColor: "#FF0000",
  },
  {
    text: "Apple Music",
    hrefUrl: "https://music.apple.com/us/artist/eclectic-pickup/1788079254",
    imgUrl: "",
    icon: SiApplemusic,
    iconColor: "#FA243C",
  },
  {
    text: "Bandcamp",
    hrefUrl: "https://eclecticpickup.bandcamp.com/",
    imgUrl: "",
    icon: SiBandcamp,
    iconColor: "#629AA9",
  },
];

export const Albums = () => (
  <section
    id="albums"
    className="page-section albums-section"
    aria-labelledby="albums-heading"
  >
    <div className="section-heading">
      <h2 id="albums-heading">Discography</h2>
    </div>
    <ul className="album-grid" aria-label="Albums">
      {albums.map(({ title, cover, smallCover }) => (
        <li className="album-card" key={title}>
          <img
            src={cover}
            srcSet={`${smallCover} 400w, ${cover} 800w`}
            sizes="(max-width: 600px) calc(100vw - 2.5rem), (max-width: 1240px) 33vw, 380px"
            alt={`${title} album cover`}
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
          />
          <h3>{title}</h3>
        </li>
      ))}
    </ul>
    <div className="album-platforms">
      <SocialLinks listings={artistLinks} label="Listen to Eclectic Pickup" />
    </div>
  </section>
);

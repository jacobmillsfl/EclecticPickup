import { SocialLinks } from "./SocialLinks";

const albums = ["Volume 1", "Volume 2", "LIVE at Breck"];
const artistLinks = [
  {
    text: "Spotify",
    hrefUrl: "https://open.spotify.com/artist/0HU4opVeWSZBryB0vZzxu4",
    imgUrl: "",
  },
  {
    text: "YouTube Music",
    hrefUrl: "https://music.youtube.com/@EclecticPickup",
    imgUrl: "",
  },
  {
    text: "Apple Music",
    hrefUrl: "https://music.apple.com/us/artist/eclectic-pickup/1788079254",
    imgUrl: "",
  },
  {
    text: "Bandcamp",
    hrefUrl: "https://eclecticpickup.bandcamp.com/",
    imgUrl: "",
  },
];

export const Albums = () => (
  <section
    id="albums"
    className="page-section albums-section"
    aria-labelledby="albums-heading"
  >
    <div className="section-heading">
      <div>
        <p className="eyebrow">The discography</p>
        <h2 id="albums-heading">Find your next favorite.</h2>
      </div>
      <p>Three albums to make your own. Listen wherever you feel at home.</p>
    </div>
    <ul className="album-grid" aria-label="Albums">
      {albums.map((title) => (
        <li className="album-card" key={title}>
          <p className="eyebrow">Eclectic Pickup</p>
          <h3>{title}</h3>
        </li>
      ))}
    </ul>
    <div className="album-platforms">
      <p>Explore all three albums on our artist pages:</p>
      <SocialLinks listings={artistLinks} label="Listen to Eclectic Pickup" />
    </div>
  </section>
);

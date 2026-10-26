import "../HomePage.css";
import { useContext, useState } from "react";
import { BandPhotoCarousel } from "../Components/Content/ImageCarousel";
import {
  BandMember,
  BandMemberList,
} from "../Components/Content/BandMemberList";
import { InfoBox } from "../Components/Content/InfoBox";
import { GigsComponent } from "../Components/Content/GigsComponent";
import { VideoCarousel } from "../Components/Content/VideoCarousel";
import { MailChimpComponent } from "../Components/MailChimp/MailChimpComponent";
import appContext from "../Contexts/AppContext";
import heroImage from "../media/EclecticPickup-22.jpg";
import logo from "../media/eclectic-pickup-logo-1200.webp";
import logoSmall from "../media/eclectic-pickup-logo-600.webp";
import { Albums } from "../Components/Content/Albums";
import { SocialLinks } from "../Components/Content/SocialLinks";
import liamPortrait from "../media/band-liam.webp";
import jacobPortrait from "../media/band-jacob.webp";
import jesterPortrait from "../media/band-jester.webp";
import robPortrait from "../media/band-rob.webp";
import Misc from "../Utilities/Misc";
import { SiBandcamp, SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const homepageVideos = [
  {
    src: "https://www.youtube.com/embed/RBed2sk8vsk",
    alt: "Too Much Too Late",
    youtube: true,
  },
  {
    src: "https://www.youtube.com/embed/1db_WARusxQ",
    alt: "The Devil You Know",
    youtube: true,
  },
  {
    src: "https://www.youtube.com/embed/TCicfS5Ix04",
    alt: "Six Reasons",
    youtube: true,
  },
];

const homepageSocialLinks = [
  {
    text: "Facebook",
    hrefUrl: "https://www.facebook.com/eclecticpickup",
    imgUrl: "",
    icon: SiFacebook,
    iconColor: "#1877F2",
  },
  {
    text: "Instagram",
    hrefUrl: "https://www.instagram.com/EclecticPickup/",
    imgUrl: "",
    icon: SiInstagram,
    iconColor: "#E4405F",
  },
  {
    text: "YouTube",
    hrefUrl: "https://youtube.com/@eclecticpickup",
    imgUrl: "",
    icon: SiYoutube,
    iconColor: "#FF0000",
  },
  {
    text: "Bandcamp",
    hrefUrl: "https://eclecticpickup.bandcamp.com/",
    imgUrl: "",
    icon: SiBandcamp,
    iconColor: "#629AA9",
  },
  {
    text: "Email",
    hrefUrl: "mailto:eclecticpickup@gmail.com",
    imgUrl: "",
    icon: MdEmail,
  },
];

const homepageBandMembers: BandMember[] = [
  { name: "Liam", text: "Drums", imgUrl: liamPortrait },
  { name: "Jacob", text: "Guitar, Bass, Vocals", imgUrl: jacobPortrait },
  { name: "Jester", text: "Guitar, Bass, Vocals", imgUrl: jesterPortrait },
  { name: "Rob", text: "Guitar, Vocals", imgUrl: robPortrait },
];

const homepageBio =
  "It's a jam, but this isn't your typical jam band. While the music is rooted in rock, blues, and funk, the shows are a jazz-like experience. The songs, whether original or covers, are always fresh reinterpretations, depending on the players and the chemistry that session.";

export default function LandingPage() {
  const [bandMembers] = useState(() =>
    Misc.shuffleArray([...homepageBandMembers])
  );
  const { images, gigs, gigsLoading, gigsError, reloadGigs } =
    useContext(appContext);
  const heroPhotos = [
    {
      id: -1,
      filename: heroImage,
      caption: "The members of Eclectic Pickup",
    },
    ...images,
  ];

  return (
    <div className="landing-page">
      <section id="home" className="hero" aria-labelledby="hero-heading">
        <BandPhotoCarousel
          images={heroPhotos}
          className="hero-carousel"
          label="Eclectic Pickup band photos"
          showCaptions={false}
          eagerFirst
        />
        <div className="hero-copy">
          <h1 id="hero-heading">
            <img
              className="hero-logo"
              src={logo}
              srcSet={`${logoSmall} 600w, ${logo} 1200w`}
              sizes="(max-width: 1064px) 72vw, 720px"
              alt="Eclectic Pickup"
              width={1200}
              height={800}
            />
          </h1>
          <p className="eyebrow">
            <span className="live-dot" aria-hidden="true" />
            Fort Collins, Colorado
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#albums">
              Discography <span aria-hidden="true">&#8599;</span>
            </a>
            <a className="button-secondary" href="#shows">
              Events <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>
      </section>
      <Albums />
      <GigsComponent
        gigs={gigs}
        loading={gigsLoading}
        error={gigsError}
        onRetry={reloadGigs}
      />
      <section
        id="about"
        className="page-section about-section"
        aria-labelledby="about-heading"
      >
        <InfoBox
          props={{ heading: "A sound of our own.", paragraph: homepageBio }}
        />
        <BandMemberList props={bandMembers} />
      </section>
      <VideoCarousel props={homepageVideos} />
      <section
        id="socials"
        className="page-section follow-section"
        aria-labelledby="socials-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Social Media</p>
            <h2 id="socials-heading">Follow us online</h2>
          </div>
          <p>More music, band moments, and news. Find us on social media.</p>
        </div>
        <SocialLinks listings={homepageSocialLinks} label="Band social media" />
      </section>
      <MailChimpComponent />
    </div>
  );
}

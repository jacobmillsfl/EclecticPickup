import "../HomePage.css";
import { useContext } from "react";
import { ImageCarousel } from "../Components/Content/ImageCarousel";
import { BandMemberList } from "../Components/Content/BandMemberList";
import { InfoBox } from "../Components/Content/InfoBox";
import { GigsComponent } from "../Components/Content/GigsComponent";
import { VideoCarousel } from "../Components/Content/VideoCarousel";
import { MailChimpComponent } from "../Components/MailChimp/MailChimpComponent";
import appContext from "../Contexts/AppContext";
import heroImage from "../media/EclecticPickup-22.jpg";
import { Albums } from "../Components/Content/Albums";
import { SocialLinks } from "../Components/Content/SocialLinks";

export default function LandingPage() {
  const {
    images,
    bandMembers,
    videos,
    gigs,
    settings,
    gigsLoading,
    gigsError,
    reloadGigs,
    socialLinks,
  } = useContext(appContext);
  const bio = settings.find((setting) => setting.name === "BAND_BIO")?.value;
  const motto = settings.find(
    (setting) => setting.name === "BAND_MOTTO"
  )?.value;

  return (
    <div className="landing-page">
      <section id="home" className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" aria-hidden="true" />
            Fort Collins, Colorado
          </p>
          <h1 id="hero-heading">
            Eclectic
            <br />
            <span>Pickup</span>
          </h1>
          <p className="hero-description">
            {motto || "Good music. Good company. Come be part of it."}
          </p>
          <p className="hero-albums">
            Volume 1. Volume 2. LIVE at Breck.
            <br />
            Our music, ready when you are.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#albums">
              Listen to the albums <span aria-hidden="true">&#8599;</span>
            </a>
            <a className="button-secondary" href="#shows">
              Find a show <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>
        <div className="hero-photo">
          <img src={heroImage} alt="The members of Eclectic Pickup" />
          <span className="photo-label">Better together. Better live.</span>
        </div>
      </section>
      <div className="hero-strip" aria-hidden="true">
        <span>Independent music</span>
        <span>Colorado roots</span>
        <span>Live &amp; loud</span>
      </div>
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
          props={{ heading: "A sound of our own.", paragraph: bio || "" }}
        />
        {bandMembers.length > 0 && <BandMemberList props={bandMembers} />}
      </section>
      {images.length > 0 && <ImageCarousel props={images} />}
      <VideoCarousel props={videos} />
      {socialLinks.socialMedia.length > 0 && (
        <section
          id="socials"
          className="page-section follow-section"
          aria-labelledby="socials-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Between shows</p>
              <h2 id="socials-heading">Keep good company.</h2>
            </div>
            <p>More music, band moments, and news. Find us on social media.</p>
          </div>
          <SocialLinks
            listings={socialLinks.socialMedia}
            label="Band social media"
          />
        </section>
      )}
      <MailChimpComponent />
    </div>
  );
}

import "../HomePage.css";
import { useContext, useEffect, useState } from "react";
import { ImageCarousel } from "../Components/Content/ImageCarousel";
import { ContentContainer } from "../Components/Controls/ContentContainer";
import {
  BandMember,
  BandMemberList,
} from "../Components/Content/BandMemberList";
import { InfoBox, InfoBoxProps } from "../Components/Content/InfoBox";
import { GigsProps, GigsComponent } from "../Components/Content/GigsComponent";
import { Socials, AllSocialLinks } from "../Components/Content/Socials";
import { QuoteBox, QuoteBoxProps } from "../Components/Content/QuoteBox";
import { BandVideo, VideoCarousel } from "../Components/Content/VideoCarousel";
import { MailChimpComponent } from "../Components/MailChimp/MailChimpComponent";
import appContext from "../Contexts/AppContext";

export default function LandingPage() {
  const { images, bandMembers, videos, gigs, settings, socialLinks } =
    useContext(appContext);

  const [upcomingGigs, setUpcomingGigs] = useState<GigsProps>({
    heading: "",
    gigs: new Array(),
  });
  const [pastGigs, setPastGigs] = useState<GigsProps>({
    heading: "",
    gigs: new Array(),
  });
  const [aboutInfo, setAboutInfo] = useState<InfoBoxProps>({
    heading: "",
    paragraph: "",
  });
  const [motto, setMotto] = useState<QuoteBoxProps>({ quote: "" });

  useEffect(() => {
    const upcomingGigs = {
      heading: "Upcoming Gigs",
      gigs: gigs.filter((gig) => gig.date.getTime() > Date.now()),
    };

    const pastGigs = {
      heading: "Previous Gigs",
      gigs: gigs.filter((gig) => gig.date.getTime() < Date.now()),
    };

    if (upcomingGigs.gigs.length > 0) {
      setUpcomingGigs(upcomingGigs);
    }

    if (pastGigs.gigs.length > 0) {
      setPastGigs(pastGigs);
    }
  }, [gigs]);

  useEffect(() => {
    const bandBio = settings.find((setting) => setting.name === "BAND_BIO");

    if (bandBio) {
      const infoBoxProps = {
        heading: "Eclectic Pickup",
        paragraph: bandBio.value,
      };

      setAboutInfo(infoBoxProps);
    }

    const bandMotto = settings.find((setting) => setting.name === "BAND_MOTTO");
    if (bandMotto) {
      const quoteBoxProps = {
        quote: bandMotto.value,
      };
      setMotto(quoteBoxProps);
    }
  }, [settings]);

  return (
    <ContentContainer>
      <div id="home"></div>
      <ImageCarousel props={images} />
      <InfoBox props={aboutInfo} />
      <BandMemberList props={bandMembers} />
      <VideoCarousel props={videos} />
      <GigsComponent props={upcomingGigs}/>
      <GigsComponent props={pastGigs}/>
      {/* <MediaPlayer /> */}
      {/* <Socials props={socialLinks} /> */}
      <MailChimpComponent />
      {/* <QuoteBox props={motto}/> */}
    </ContentContainer>
  );
}

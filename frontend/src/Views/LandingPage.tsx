import "../HomePage.css";
import { useContext, useEffect, useState } from "react";
import { ImageCarousel } from "../Components/Content/ImageCarousel";
import { ContentContainer } from "../Components/Controls/ContentContainer";
import { BandMemberList } from "../Components/Content/BandMemberList";
import { InfoBox, InfoBoxProps } from "../Components/Content/InfoBox";
import { GigsProps, GigsComponent } from "../Components/Content/GigsComponent";
import { VideoCarousel } from "../Components/Content/VideoCarousel";
import { MailChimpComponent } from "../Components/MailChimp/MailChimpComponent";
import appContext from "../Contexts/AppContext";

export default function LandingPage() {
  const { images, bandMembers, videos, gigs, settings } = useContext(appContext);

  const [upcomingGigs, setUpcomingGigs] = useState<GigsProps>({
    heading: "",
    gigs: [],
  });
  const [pastGigs, setPastGigs] = useState<GigsProps>({
    heading: "",
    gigs: [],
  });
  const [aboutInfo, setAboutInfo] = useState<InfoBoxProps>({
    heading: "",
    paragraph: "",
  });

  useEffect(() => {
    const upcoming = {
      heading: "Upcoming Gigs",
      gigs: gigs.filter((gig) => gig.date.getTime() > Date.now()),
    };

    const past = {
      heading: "Previous Gigs",
      gigs: gigs.filter((gig) => gig.date.getTime() < Date.now()),
    };

    if (upcoming.gigs.length > 0) {
      setUpcomingGigs(upcoming);
    }

    if (past.gigs.length > 0) {
      setPastGigs(past);
    }
  }, [gigs]);

  useEffect(() => {
    const bandBio = settings.find((setting) => setting.name === "BAND_BIO");

    if (bandBio) {
      setAboutInfo({
        heading: "Eclectic Pickup",
        paragraph: bandBio.value,
      });
    }
  }, [settings]);

  return (
    <ContentContainer>
      <div id="home"></div>
      {images.length > 0 && <ImageCarousel props={images} />}
      <InfoBox props={aboutInfo} />
      {bandMembers.length > 0 && <BandMemberList props={bandMembers} />}
      <VideoCarousel props={videos} />
      <GigsComponent props={upcomingGigs} />
      <GigsComponent props={pastGigs} />
      <MailChimpComponent />
    </ContentContainer>
  );
}

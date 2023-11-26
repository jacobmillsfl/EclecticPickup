import '../HomePage.css';
import { useEffect, useState } from "react";
import { ImageCarousel, Image } from "../Components/Content/ImageCarousel";
import { ContentContainer } from "./ContentContainer/ContentContainer";
import { BandMember, BandMemberList} from "../Components/Content/BandMemberList";
import { InfoBox, InfoBoxProps } from "../Components/Content/InfoBox";
import { Show, UpcomingShows } from "../Components/Content/UpcomingShows";
import { Socials, AllSocialLinks } from "../Components/Content/Socials";
import MediaPlayer from "../Components/MediaPlayer/MediaPlayer";
import QuoteBox from "../Components/Content/QuoteBox";
import ApiClient from "../Utilities/ApiClient";

export default function LandingPage() {
  const [aboutInfo, setAboutInfo] = useState<InfoBoxProps>({"heading":"","paragraph":""});
  const [bandMembers, setBandMembers] = useState<Array<BandMember>>(new Array());
  const [images, setImages] = useState<Array<Image>>(new Array());
  const [upcomingShows, setUpcomingShows] = useState<Array<Show>>(new Array());
  const [socialLinks, setSocailLinks] = useState<AllSocialLinks>({
    "email": new Array(),
    "merch": new Array(),
    "socialMedia": new Array(),
    "streaming": new Array(),
  });

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const aboutInfo = await ApiClient.getAboutInfo();
        setAboutInfo(aboutInfo);
      } catch (error) {
        console.error('Error fetching about info:', error);
      }
    };

    const fetchBandMembers = async () => {
      const bandMembers = await ApiClient.getBandMembers();
      setBandMembers(bandMembers);
    }

    const fetchImages = async () => {
      const images = await ApiClient.getCarouselImages();
      setImages(images);
    }

    const fetchUpcomingShows = async () => {
      const upcomingShows = await ApiClient.getUpcomingShows();
      setUpcomingShows(upcomingShows);
    }

    const fetchSocialLinks = async () => {
      const socialLinks = await ApiClient.getAllSocialLinks();
      setSocailLinks(socialLinks);
    }

    fetchAboutInfo();
    fetchBandMembers();
    fetchImages();
    fetchUpcomingShows();
    fetchSocialLinks();
  }, []);

  return (
    <ContentContainer>
      <ImageCarousel props={images} />
      <InfoBox props={aboutInfo}/>
      <BandMemberList props={bandMembers} />
      <UpcomingShows props={upcomingShows}/>

      {/* <MediaPlayer /> */}

      <QuoteBox />
      <Socials props={socialLinks} />
    </ContentContainer>
  );
}

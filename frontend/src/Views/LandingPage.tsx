import '../HomePage.css';
import { useEffect, useState } from "react";
import { ImageCarousel, Image } from "../Components/Content/ImageCarousel";
import { ContentContainer } from "../Components/Controls/ContentContainer";
import { BandMember, BandMemberList} from "../Components/Content/BandMemberList";
import { InfoBox, InfoBoxProps } from "../Components/Content/InfoBox";
import { Show, UpcomingShows } from "../Components/Content/UpcomingShows";
import { Socials, AllSocialLinks } from "../Components/Content/Socials";
import MediaPlayer from "../Components/MediaPlayer/MediaPlayer";
import QuoteBox from "../Components/Content/QuoteBox";
import ApiClient from "../Utilities/ApiClient";
import { Video, VideoCarousel } from '../Components/Content/VideoCarousel';

export default function LandingPage() {
  const [aboutInfo, setAboutInfo] = useState<InfoBoxProps>({"heading":"","paragraph":""});
  const [bandMembers, setBandMembers] = useState<Array<BandMember>>(new Array());
  const [images, setImages] = useState<Array<Image>>(new Array());
  const [videos, setVideos] = useState<Array<Video>>(new Array());
  const [upcomingShows, setUpcomingShows] = useState<Array<Show>>(new Array());
  const [socialLinks, setSocialLinks] = useState<AllSocialLinks>({
    "email": new Array(),
    "merch": new Array(),
    "socialMedia": new Array(),
    "streaming": new Array(),
  });

  function shuffle(array: Array<any>) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

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
      setBandMembers(shuffle(bandMembers));
    }

    const fetchImages = async () => {
      const images = await ApiClient.getCarouselImages();
      setImages(shuffle(images));
    }

    const fetchUpcomingShows = async () => {
      const upcomingShows = await ApiClient.getUpcomingShows();
      setUpcomingShows(upcomingShows);
    }

    const fetchSocialLinks = async () => {
      const socialLinks = await ApiClient.getAllSocialLinks();
      setSocialLinks(socialLinks);
    }

    const fetchVideos = async () => {
      const videos = await ApiClient.getCarouselVideos();
      setVideos(videos);
    }

    fetchAboutInfo();
    fetchBandMembers();
    fetchImages();
    fetchUpcomingShows();
    fetchSocialLinks();
    fetchVideos();
  }, []);

  return (
    <ContentContainer>
      <div id="home"></div>
      <ImageCarousel props={images} />
      <InfoBox props={aboutInfo}/>
      <BandMemberList props={bandMembers} />
      <VideoCarousel props={videos} />
      <UpcomingShows props={upcomingShows}/>
      <QuoteBox />
      {/* <MediaPlayer /> */}
      {/* <Socials props={socialLinks} /> */}
    </ContentContainer>
  );
}

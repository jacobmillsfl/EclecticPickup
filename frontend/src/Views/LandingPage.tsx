import '../HomePage.css';
import { useEffect, useState } from "react";
import { ImageCarousel, Image } from "../Components/Content/ImageCarousel";
import { ContentContainer } from "../Components/Controls/ContentContainer";
import { BandMember, BandMemberList} from "../Components/Content/BandMemberList";
import { InfoBox, InfoBoxProps } from "../Components/Content/InfoBox";
import { UpcomingGigsProps, UpcomingShows } from "../Components/Content/UpcomingShows";
import { Socials, AllSocialLinks } from "../Components/Content/Socials";
import MediaPlayer from "../Components/MediaPlayer/MediaPlayer";
import { QuoteBox, QuoteBoxProps } from "../Components/Content/QuoteBox";
import ApiClient from "../Utilities/Api/ApiClient";
import { Video, VideoCarousel } from '../Components/Content/VideoCarousel';
import { MailChimpComponent } from '../Components/MailChimp/MailChimpComponent';

export default function LandingPage() {
  const [aboutInfo, setAboutInfo] = useState<InfoBoxProps>({"heading":"","paragraph":""});
  const [motto, setMotto] = useState<QuoteBoxProps>({"quote":""});
  const [bandMembers, setBandMembers] = useState<Array<BandMember>>(new Array());
  const [images, setImages] = useState<Array<Image>>(new Array());
  const [videos, setVideos] = useState<Array<Video>>(new Array());
  const [upcomingGigs, setUpcomingGigs] = useState<UpcomingGigsProps>({"heading":"", gigs: new Array()});
  const [pastGigs, setPastGigs] = useState<UpcomingGigsProps>({"heading":"", gigs: new Array()});
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
        const aboutInfo = await ApiClient.settings.getSettingByName("BAND_BIO");
        if (aboutInfo.data) {
          const info = {
            "heading":"Eclectic Pickup",
            "paragraph": aboutInfo.data.value
          }
          setAboutInfo(info);
        }
      } catch (error) {
        console.error('Error fetching about info:', error);
      }
    };

    const fetchMotto = async () => {
      try {
        const response = await ApiClient.settings.getSettingByName("BAND_MOTTO");
        if (response.data) {
          const quoteProps = {
            "quote":response.data.value
          }
          setMotto(quoteProps);
        }
      } catch (error) {
        console.error('Error fetching about info:', error);
      }
    }

    const fetchBandMembers = async () => {
      const bandMembers = await ApiClient.getBandMembers();
      setBandMembers(shuffle(bandMembers));
    }

    const fetchImages = async () => {
      const images = await ApiClient.getCarouselImages();
      setImages(shuffle(images));
    }

    const fetchUpcomingShows = async () => {
      const response = await ApiClient.event.all();
      if (response.data) {
        const upcomingGigs = {
          heading: "Upcoming Gigs",
          gigs: response.data.filter( (gig) => gig.date.getTime() > Date.now()),
        }

        const pastGigs = {
          heading: "Previous Gigs",
          gigs: response.data.filter( (gig) => gig.date.getTime() < Date.now()),
        }

        setUpcomingGigs(upcomingGigs);
        setPastGigs(pastGigs)
      }
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
    fetchMotto();
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
      <UpcomingShows props={upcomingGigs}/>
      <UpcomingShows props={pastGigs}/>
      {/* <MediaPlayer /> */}
      <Socials props={socialLinks} />
      <MailChimpComponent />
      <QuoteBox props={motto}/>
    </ContentContainer>
  );
}

import { useEffect, useState } from "react";

import VideoContainer from "../Components/Media/VideoContainer";
import appContext from "./AppContext";
import { BandMember } from "../Components/Content/BandMemberList";
import { BandVideo } from "../Components/Content/VideoCarousel";
import { AllSocialLinks } from "../Components/Content/Socials";
import AuthManager from "../Utilities/AuthManager";
import ApiClient from "../Utilities/Api/ApiClient";
import Misc from "../Utilities/Misc";
import { EventModel, SettingsModel, BandImageModel } from "../Types/DbModels";

const AppContextProvider = (props: any) => {
  const [loggedIn, setLoggedIn] = useState(AuthManager.isAuthenticated());
  const [bandMembers, setBandMembers] = useState<Array<BandMember>>(
    []
  );
  const [images, setImages] = useState<Array<BandImageModel>>([]);
  const [videos, setVideos] = useState<Array<BandVideo>>([]);
  const [gigs, setGigs] = useState<Array<EventModel>>([]);
  const [settings, setSettings] = useState<Array<SettingsModel>>([]);
  const [socialLinks, setSocialLinks] = useState<AllSocialLinks>({
    email: [],
    merch: [],
    socialMedia: [],
    streaming: [],
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await ApiClient.settings.all();
      if (response.data) {
        setSettings(response.data);
      }
    };

    const fetchBandMembers = async () => {
      const bandMembers = await ApiClient.getBandMembers();
      setBandMembers(Misc.shuffleArray(bandMembers));
    };

    const fetchImages = async () => {
      const response = await ApiClient.bandImage.all();
      if (response.data) {
        setImages(Misc.shuffleArray(response.data));
      }
    };

    const fetchGigs = async () => {
      const response = await ApiClient.event.all();
      if (response.data) {
        setGigs(response.data);
      }
    };

    const fetchSocialLinks = async () => {
      const socialLinks = await ApiClient.getAllSocialLinks();
      setSocialLinks(socialLinks);
    };

    const fetchVideos = async () => {
      const videos = await ApiClient.getCarouselVideos();
      setVideos(videos);
    };

    fetchVideos();
    fetchSocialLinks();
    fetchGigs();
    fetchImages();
    fetchBandMembers();
    fetchSettings();
  }, []);


  return (
    <appContext.Provider
      value={{
        loggedIn: loggedIn,
        settings: settings,
        bandMembers: bandMembers,
        images: images,
        videos: videos,
        gigs: gigs,
        socialLinks: socialLinks,
        setLoggedIn: setLoggedIn,
        setSettings: setSettings,
        setBandMembers: setBandMembers,
        setImages: setImages,
        setVideos: setVideos,
        setGigs: setGigs,
        setSocialLinks: setSocialLinks,
      }}
    >
      <VideoContainer />
      {props.children}
    </appContext.Provider>
  );
};

export default AppContextProvider;

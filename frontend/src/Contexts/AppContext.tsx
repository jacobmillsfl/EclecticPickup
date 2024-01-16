import { createContext } from 'react';
import { BandMember } from '../Components/Content/BandMemberList';
import { AllSocialLinks } from '../Components/Content/Socials';
import { BandImage } from "../Components/Content/ImageCarousel";
import { BandVideo } from "../Components/Content/VideoCarousel";
import { EventModel, SettingsModel } from '../Types/DbModels';

interface ApplicationContext {
    loggedIn: boolean;
    bandMembers: Array<BandMember>;
    images: Array<BandImage>;
    videos: Array<BandVideo>;
    gigs: Array<EventModel>;
    settings: Array<SettingsModel>;
    socialLinks: AllSocialLinks;
  
    setLoggedIn: (jwt: boolean) => void;
    setSettings: (settings: Array<SettingsModel>) => void;
    setBandMembers: (members: Array<BandMember>) => void;
    setImages: (images: Array<BandImage>) => void;
    setVideos: (videos: Array<BandVideo>) => void;
    setGigs: (props: Array<EventModel>) => void;
    setSocialLinks: (links: AllSocialLinks) => void;
  }
  
  const appContext = createContext<ApplicationContext>({
    loggedIn: false,
    bandMembers: new Array(),
    images: new Array(),
    videos: new Array(),
    settings: new Array(),
    gigs: new Array(),
    socialLinks: {
      email: new Array(),
      merch: new Array(),
      socialMedia: new Array(),
      streaming: new Array(),
    },
    setLoggedIn: () => {},
    setSettings: () => {},
    setBandMembers: () => {},
    setImages: () => {},
    setVideos: () => {},
    setGigs: () => {},
    setSocialLinks: () => {},
  });

  export default appContext;
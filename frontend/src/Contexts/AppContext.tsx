import { createContext, type Dispatch, type SetStateAction } from 'react';
import { BandMember } from '../Components/Content/BandMemberList';
import { AllSocialLinks } from '../Components/Content/Socials';
import { BandVideo } from "../Components/Content/VideoCarousel";
import { EventModel, SettingsModel, BandImageModel } from '../Types/DbModels';

interface ApplicationContext {
    loggedIn: boolean;
    bandMembers: Array<BandMember>;
    images: Array<BandImageModel>;
    videos: Array<BandVideo>;
    gigs: Array<EventModel>;
    settings: Array<SettingsModel>;
    socialLinks: AllSocialLinks;
  
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    setSettings: Dispatch<SetStateAction<Array<SettingsModel>>>;
    setBandMembers: Dispatch<SetStateAction<Array<BandMember>>>;
    setImages: Dispatch<SetStateAction<Array<BandImageModel>>>;
    setVideos: Dispatch<SetStateAction<Array<BandVideo>>>;
    setGigs: Dispatch<SetStateAction<Array<EventModel>>>;
    setSocialLinks: Dispatch<SetStateAction<AllSocialLinks>>;
  }
  
  const appContext = createContext<ApplicationContext>({
    loggedIn: false,
    bandMembers: [],
    images: [],
    videos: [],
    settings: [],
    gigs: [],
    socialLinks: {
      email: [],
      merch: [],
      socialMedia: [],
      streaming: [],
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
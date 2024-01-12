import { InfoBoxProps } from "../../Components/Content/InfoBox";
import { Image } from "../../Components/Content/ImageCarousel";
import { BandMember } from "../../Components/Content/BandMemberList";
import { Gig } from "../../Types";
import { AllSocialLinks } from "../../Components/Content/Socials";
import { SocialListing } from "../../Components/Content/SocialList";
import { Video } from "../../Components/Content/VideoCarousel";
import { ApiConfig, ApiResponse } from "./ApiTypes";
import { EventApi } from "./Endpoints/EventApi";
import { SettingsApi } from "./Endpoints/SettingsApi";
import { AuthApi } from "./Endpoints/AuthApi";


class ApiClient {
  config: ApiConfig;
  event: EventApi;
  settings: SettingsApi;
  auth: AuthApi;

  constructor(config: ApiConfig) {
    this.config = config;
    this.event = new EventApi(config);
    this.settings = new SettingsApi(config);
    this.auth = new AuthApi(config);
  }

  async getBandMembers(): Promise<Array<BandMember>> {
    const bandMembers = new Array<BandMember>(
      {
        name: "Jester",
        imgUrl: "img/band/Jester.png",
        text: "Guitar, Bass, Vocals",
      },
      {
        name: "Jacob",
        imgUrl: "img/band/Jacob2.jpg",
        text: "Guitar, Bass",
      },
      {
        name: "Rob",
        imgUrl: "img/band/Rob.jpg",
        text: "Guitar, Vocals",
      },
      {
        name: "Big Obie",
        imgUrl: "img/band/bigobie3.png",
        text: "Mandolin, Vocals, Percussion",
      },
      {
        name: "Liam",
        imgUrl: "img/band/Liam2.jpg",
        text: "Percussion",
      }
    );
    return bandMembers;
  }

  async getCarouselVideos(): Promise<Array<Video>> {
    const videos = new Array<Video>(
      {
        src: `${this.config.baseUrl}/vids/EclecticPickup_WakeUpCall.mp4`,
        alt: "Video Clip",
        youtube: false
      },
      {
        src: `https://www.youtube.com/embed/fjvXvEQSXrI?si=CzJAUOQqjuIsRCni`,
        alt: "Funk'n A",
        youtube: true,
      },
      {
        src: `https://www.youtube.com/embed/Gbcc9EOd2ik?si=3_h__QsQATo9Ea-5`,
        alt: "Stepping Stones",
        youtube: true,
      },
      {
        src: `${this.config.baseUrl}/vids/1.mov`,
        alt: "Video Clip",
        youtube: false
      },
      {
        src: `${this.config.baseUrl}/vids/2.mov`,
        alt: "Video Clip",
        youtube: false
      },
      {
        src: `${this.config.baseUrl}/vids/3.mov`,
        alt: "Video Clip",
        youtube: false
      }
    );
    return videos;
  }

  async getCarouselImages(): Promise<Array<Image>> {
    const images = new Array<Image>(
      // {
      //   src: `${this.config.baseUrl}/img/EclecticPickup-224x300.gif`,
      //   alt: "",
      // },
      {
        src: `${this.config.baseUrl}/img/photos/1.jpg`,
        alt: "@ Purpose Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/2.jpg`,
        alt: "@ Fort Collins Block Party",
      },
      {
        src: `${this.config.baseUrl}/img/photos/3.jpg`,
        alt: "@ Purpose Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/4.jpg`,
        alt: "@ Fort Collins Block Party",
      },
      {
        src: `${this.config.baseUrl}/img/photos/5.jpg`,
        alt: "@ Funkwerks Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/6.jpg`,
        alt: "@ Funkwerks Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/7.jpg`,
        alt: "@ Fort Collins Block Party",
      },
      {
        src: `${this.config.baseUrl}/img/photos/8.jpg`,
        alt: "@ Purpose Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/9.jpg`,
        alt: "@ Funkwerks Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/10.jpg`,
        alt: "@ Funkwerks Brewery",
      },
      {
        src: `${this.config.baseUrl}/img/photos/11.jpg`,
        alt: "@ Fort Collins Block Party",
      },
      {
        src: `${this.config.baseUrl}/img/photos/12.jpg`,
        alt: "@ Funkwerks Brewery",
      },
    );

    return images;
  }

  // async getUpcomingShows(): Promise<Array<Gig>> {
  //   const shows = new Array<Gig>(
  //     {
  //       id: 1,
  //       date: new Date("09-23-2023"),
  //       time: "2-4 pm",
  //       venue: "Funkwerks Brewing",
  //       address: "1900 E Lincoln Ave, Fort Collins",
  //     },
  //     {
  //       id: 2,
  //       date: new Date("10-14-2023"),
  //       time: "4-6 pm",
  //       venue: "Funkwerks Brewing",
  //       address: "1900 E Lincoln Ave, Fort Collins",
  //     },
  //     {
  //       id: 3,
  //       date: new Date("04-22-2023"),
  //       time: "12-4 pm",
  //       venue: "Jessup Farm Barrel House",
  //       address: "1921 Jessup Dr, Fort Collins, CO 80525",
  //     },
  //     {
        
  //       id: 4,
  //       date: new Date("08-25-2023"),
  //       time: "6-8 pm",
  //       venue: "Purpose Brewing and Cellars",
  //       address: "4025 S Mason St unit c, Fort Collins, CO 80525",
  //     },
  //     {
        
  //       id: 5,
  //       date: new Date("06-23-2023"),
  //       time: "6-8 pm",
  //       venue: "Purpose Brewing and Cellars",
  //       address: "4025 S Mason St unit c, Fort Collins, CO 80525",
  //     },
  //     {
        
  //       id: 6,
  //       date: new Date("07-22-2023"),
  //       time: "1-4 pm",
  //       venue: "Rock Bottom Resaurant & Brewery",
  //       address: "6025 Sky Pond Dr, Loveland, CO 80538",
  //     },
  //     {
        
  //       id: 7,
  //       date: new Date("12-15-2023"),
  //       time: "7-10 pm",
  //       venue: "Black and Blues Music and Brews",
  //       address: "423 N Cleveland Ave, Loveland, CO 80537",
  //     }
  //   );
  //   return shows;
  // }

  async getAllSocialLinks(): Promise<AllSocialLinks> {
    const streamingList = new Array<SocialListing>(
      {
        hrefUrl: "#",
        imgUrl: `${this.config.baseUrl}/img/socials/spotify.jpg`,
        text: "Spotify",
      },
      {
        hrefUrl: "#",
        imgUrl: `${this.config.baseUrl}/img/socials/youtube.jpg`,
        text: "YouTube",
      },
      {
        hrefUrl: "#",
        imgUrl: `${this.config.baseUrl}/img/socials/itunes.jpg`,
        text: "iTunes",
      },
      {
        hrefUrl: "#",
        imgUrl: `${this.config.baseUrl}/img/socials/applemusic.jpg`,
        text: "Apple Music",
      },
      {
        hrefUrl: "#",
        imgUrl: `${this.config.baseUrl}/img/socials/soundcloud.jpg`,
        text: "SoundCloud",
      }
    );

    const socialMediaList = new Array<SocialListing>(
      {
        hrefUrl: "#",
        imgUrl: `${this.config.baseUrl}/img/socials/facebook.png`,
        text: "Facebook",
      },
      {
        hrefUrl: "https://www.instagram.com/EclecticPickup/",
        imgUrl: `${this.config.baseUrl}/img/socials/instagram.jpg`,
        text: "Instagram",
      }
    );

    const merchList = new Array<SocialListing>({
      hrefUrl: "#",
      imgUrl: `${this.config.baseUrl}/img/socials/ebay.jpg`,
      text: "eBay",
    });

    const emailList = new Array<SocialListing>({
      hrefUrl: "mailto:eclecticpickup@gmail.com",
      imgUrl: `${this.config.baseUrl}/img/socials/email.png`,
      text: "eclecticpickup@gmail.com",
    });

    return {
      email: emailList,
      merch: merchList,
      streaming: streamingList,
      socialMedia: socialMediaList,
    };
  }
}

// Singleton Pattern
const config = {
  apiUrl: process.env.REACT_APP_API_URL ?? "localhost",
  baseUrl: process.env.PUBLIC_URL,
  useApi: false,
};
const apiClientInstance = new ApiClient(config);
export default apiClientInstance;

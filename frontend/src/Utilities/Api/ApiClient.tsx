import { BandMember } from "../../Components/Content/BandMemberList";
import { AllSocialLinks } from "../../Components/Content/Socials";
import { SocialListing } from "../../Components/Content/SocialList";
import { BandVideo } from "../../Components/Content/VideoCarousel";
import { ApiConfig } from "./ApiTypes";
import { EventApi } from "./Endpoints/EventApi";
import { SettingsApi } from "./Endpoints/SettingsApi";
import { AuthApi } from "./Endpoints/AuthApi";
import { UserApi } from "./Endpoints/UserApi";
import { BandImageApi } from "./Endpoints/BandImageApi";
import { FileApi } from "./Endpoints/FileApi";


class ApiClient {
  config: ApiConfig;
  event: EventApi;
  settings: SettingsApi;
  auth: AuthApi;
  user: UserApi;
  bandImage: BandImageApi;
  file: FileApi;

  constructor(config: ApiConfig) {
    this.config = config;
    this.event = new EventApi(config);
    this.settings = new SettingsApi(config);
    this.auth = new AuthApi(config);
    this.user = new UserApi(config);
    this.bandImage = new BandImageApi(config);
    this.file = new FileApi(config);
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

  async getCarouselVideos(): Promise<Array<BandVideo>> {
    const videos = new Array<BandVideo>(
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

  // async getCarouselImages(): Promise<Array<BandImage>> {
  //   const images = new Array<BandImage>(
  //     // {
  //     //   src: `${this.config.baseUrl}/img/EclecticPickup-224x300.gif`,
  //     //   alt: "",
  //     // },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/1.jpg`,
  //       alt: "@ Purpose Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/2.jpg`,
  //       alt: "@ Fort Collins Block Party",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/3.jpg`,
  //       alt: "@ Purpose Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/4.jpg`,
  //       alt: "@ Fort Collins Block Party",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/5.jpg`,
  //       alt: "@ Funkwerks Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/6.jpg`,
  //       alt: "@ Funkwerks Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/7.jpg`,
  //       alt: "@ Fort Collins Block Party",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/8.jpg`,
  //       alt: "@ Purpose Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/9.jpg`,
  //       alt: "@ Funkwerks Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/10.jpg`,
  //       alt: "@ Funkwerks Brewery",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/11.jpg`,
  //       alt: "@ Fort Collins Block Party",
  //     },
  //     {
  //       src: `${this.config.baseUrl}/img/photos/12.jpg`,
  //       alt: "@ Funkwerks Brewery",
  //     },
  //   );

  //   return images;
  // }

  async getAllSocialLinks(): Promise<AllSocialLinks> {
    const streamingList = new Array<SocialListing>(
      {
        hrefUrl: "https://theeclecticpickup.bandcamp.com/",
        imgUrl: `${this.config.baseUrl}/img/socials/bandcamp.png`,
        text: "BandCamp",
      }
    );

    const socialMediaList = new Array<SocialListing>(
      {
        hrefUrl: "https://www.facebook.com/eclecticpickup",
        imgUrl: `${this.config.baseUrl}/img/socials/facebook.png`,
        text: "Facebook",
      },
      {
        hrefUrl: "https://www.instagram.com/EclecticPickup/",
        imgUrl: `${this.config.baseUrl}/img/socials/instagram.jpg`,
        text: "Instagram",
      }
    );

    const merchList = new Array<SocialListing>();

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

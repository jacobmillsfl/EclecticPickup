import { SongDetail } from "../Models/SongDetail";
import { InfoBoxProps } from "../Components/Content/InfoBox";
import { Image } from "../Components/Content/ImageCarousel";
import { BandMember } from "../Components/Content/BandMemberList";
import { Show } from "../Components/Content/UpcomingShows";
import { AllSocialLinks } from "../Components/Content/Socials";
import { SocialListing } from "../Components/Content/SocialList";
import { Video } from "../Components/Content/VideoCarousel";

type ApiClientConfig = {
  apiUrl: string;
  baseUrl: string;
  useApi: boolean;
};

class ApiClient {
  config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  async getSongs(): Promise<Array<SongDetail>> {
    if (this.config.useApi) {
      const response = await fetch(`${this.config.apiUrl}/songs`);
      const data = await (response.json() as Promise<SongDetail[]>);
      return data;
    } else {
      return new Array<SongDetail>();
    }
  }

  async getAboutInfo(): Promise<InfoBoxProps> {
    return {
      heading: "Eclectic Pickup",
      paragraph:
        "It's a jam, but this isn't your typical jam band. While the music is rooted in rock, blues, and funk, the shows are a jazz-like experience. The songs, whether original or covers, are always fresh reinterpretations, depending on the players and the chemistry that session.",
    };
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
        imgUrl: "img/band/Jacob.png",
        text: "Guitar, Bass",
      },
      {
        name: "Rob",
        imgUrl: "img/band/Rob.jpg",
        text: "Guitar, Vocals",
      },
      {
        name: "Big Obie",
        imgUrl: "img/band/BigOb2.png",
        text: "Mandolin, Vocals, Percussion",
      },
      {
        name: "Liam",
        imgUrl: "img/band/Unknown.png",
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
      {
        src: `${this.config.baseUrl}/img/EclecticPickup-224x300.gif`,
        alt: "",
      },
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

  async getUpcomingShows(): Promise<Array<Show>> {
    const shows = new Array<Show>(
      {
        date: new Date("09-23-2023"),
        time: "2-4 pm",
        venue: "Funkwerks Brewing",
        address: "1900 E Lincoln Ave, Fort Collins",
      },
      {
        date: new Date("10-14-2023"),
        time: "4-6 pm",
        venue: "Funkwerks Brewing",
        address: "1900 E Lincoln Ave, Fort Collins",
      }
    );
    return shows;
  }

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

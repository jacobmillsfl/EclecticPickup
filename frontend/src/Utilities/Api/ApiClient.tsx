import { BandMember } from "../../Components/Content/BandMemberList";
import { AllSocialLinks } from "../../Components/Content/Socials";
import { BandVideo } from "../../Components/Content/VideoCarousel";
import { ApiConfig } from "./ApiTypes";
import { EventApi } from "./Endpoints/EventApi";
import { SettingsApi } from "./Endpoints/SettingsApi";
import { AuthApi } from "./Endpoints/AuthApi";
import { UserApi } from "./Endpoints/UserApi";
import { BandImageApi } from "./Endpoints/BandImageApi";
import { FileApi } from "./Endpoints/FileApi";
import { BandVideoApi } from "./Endpoints/BandVideoApi";
import { BandMemberApi } from "./Endpoints/BandMemberApi";
import { SocialLinkApi } from "./Endpoints/SocialLinkApi";
import {
  groupSocialLinksByCategory,
  mapApiBandMemberToUi,
  mapApiBandVideoToCarousel,
  resolvePublicAssetUrl,
} from "./publicContentMappers";

class ApiClient {
  config: ApiConfig;
  event: EventApi;
  settings: SettingsApi;
  auth: AuthApi;
  user: UserApi;
  bandImage: BandImageApi;
  bandVideo: BandVideoApi;
  file: FileApi;
  bandMember: BandMemberApi;
  socialLink: SocialLinkApi;

  constructor(config: ApiConfig) {
    this.config = config;
    this.event = new EventApi(config);
    this.settings = new SettingsApi(config);
    this.auth = new AuthApi(config);
    this.user = new UserApi(config);
    this.bandImage = new BandImageApi(config);
    this.bandVideo = new BandVideoApi(config);
    this.file = new FileApi(config);
    this.bandMember = new BandMemberApi(config);
    this.socialLink = new SocialLinkApi(config);
  }

  async getBandMembers(): Promise<Array<BandMember>> {
    const res = await this.bandMember.all();
    if (!res.data || res.status !== 200) {
      return [];
    }
    return res.data.map((row) =>
      mapApiBandMemberToUi(row, this.config.apiUrl, this.config.baseUrl)
    );
  }

  async getCarouselVideos(): Promise<Array<BandVideo>> {
    const res = await this.bandVideo.all();
    if (!res.data || res.status !== 200) {
      return [];
    }
    const youtubeOnly = res.data.filter((v) => v.youtube);
    return youtubeOnly.map((v) =>
      mapApiBandVideoToCarousel(
        {
          src: v.src,
          description: v.description,
          youtube: v.youtube,
        },
        this.config.apiUrl
      )
    );
  }

  async getAllSocialLinks(): Promise<AllSocialLinks> {
    const res = await this.socialLink.all();
    if (!res.data || res.status !== 200) {
      return {
        email: [],
        merch: [],
        socialMedia: [],
        streaming: [],
      };
    }
    const resolveImg = (u: string) =>
      resolvePublicAssetUrl(u, this.config.baseUrl);
    return groupSocialLinksByCategory(res.data, resolveImg);
  }
}

const config = {
  apiUrl: process.env.REACT_APP_API_URL ?? "http://localhost:8081",
  baseUrl: process.env.PUBLIC_URL,
  useApi: true,
};
const apiClientInstance = new ApiClient(config);
export default apiClientInstance;

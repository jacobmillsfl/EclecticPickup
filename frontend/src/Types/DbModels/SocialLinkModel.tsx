type SocialLinkModel = {
  id: number;
  href_url: string;
  img_url: string;
  text: string;
  category: string;
  /** Preset platform key; icon is fixed server-side. */
  platform: string | null;
  enabled: boolean;
};

export default SocialLinkModel;

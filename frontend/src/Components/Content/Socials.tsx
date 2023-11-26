import { SocialList, SocialListing } from "./SocialList";

export type AllSocialLinks = {
  streaming: Array<SocialListing>;
  socialMedia: Array<SocialListing>;
  merch: Array<SocialListing>;
  email: Array<SocialListing>;
};

export const Socials: React.FC<{ props: AllSocialLinks }> = ({ props }) => {
  return (
    <div id="socials" className="row">
      <div className="col-md-6 col-sm-12">
        <SocialList listings={props.socialMedia} heading="Social Media" />
        <SocialList listings={props.merch} heading="Merch" />
        <SocialList listings={props.email} heading="Email" />
      </div>
      <div className="col-md-6 col-sm-12">
        <SocialList listings={props.streaming} heading="Music" />
      </div>
    </div>
  );
};

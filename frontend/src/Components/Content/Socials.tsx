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
      <div className="col-md-12 col-sm-12">
        {props.socialMedia.length > 0 && (
          <SocialList listings={props.socialMedia} heading="Social Media" />
        )}
        {props.merch.length > 0 && (
          <SocialList listings={props.merch} heading="Merch" />
        )}
        {props.email.length > 0 && (
          <SocialList listings={props.email} heading="Email" />
        )}
        {props.streaming.length > 0 && (
          <SocialList listings={props.streaming} heading="Music" />
        )}
      </div>
    </div>
  );
};

import { SocialListing } from "./SocialList";

export const SocialLinks = ({
  listings,
  label,
}: {
  listings: SocialListing[];
  label: string;
}) => (
  <nav className="social-links" aria-label={label}>
    {listings.map((listing, index) => (
      <a
        key={`${listing.hrefUrl}-${index}`}
        href={listing.hrefUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {listing.imgUrl && <img src={listing.imgUrl} alt="" loading="lazy" />}
        {listing.text}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    ))}
  </nav>
);

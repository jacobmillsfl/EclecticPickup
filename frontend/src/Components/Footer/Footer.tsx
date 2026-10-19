import { useContext } from "react";
import { Link } from "react-router-dom";
import appContext from "../../Contexts/AppContext";
import { SocialLinks } from "../Content/SocialLinks";

function Footer() {
  const { socialLinks, loggedIn } = useContext(appContext);
  const listings = [
    ...socialLinks.email,
    ...socialLinks.merch,
    ...socialLinks.socialMedia,
    ...socialLinks.streaming,
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <a href="/#home" className="footer-brand">
            Eclectic Pickup
          </a>
          <p>From Fort Collins, with love.</p>
        </div>
        {listings.length > 0 && (
          <SocialLinks listings={listings} label="Follow Eclectic Pickup" />
        )}
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Eclectic Pickup</span>
        <Link to={loggedIn ? "/admin" : "/login"}>Band admin</Link>
      </div>
    </footer>
  );
}

export default Footer;

import { useState, useEffect, useContext } from 'react';
import appContext from '../../Contexts/AppContext';
import { SocialListing } from '../Content/SocialList';

function Footer() {
    const { socialLinks } = useContext(appContext);
    const [listings, setListings] = useState<SocialListing[]>([]);

    useEffect(() => {
        const tempListings: SocialListing[] = [];
        
        [
            ...socialLinks.email,
            ...socialLinks.merch,
            ...socialLinks.socialMedia,
            ...socialLinks.streaming
        ].forEach(link => tempListings.push(link));

        setListings(tempListings);
    }, [socialLinks]);

    return (
        <div className="footerLayer">
            <div className="footerLayerBg">
                {listings.map((listing, key) => (
                    <div className="footerItem" key={key}>
                                                <a 
                            href={listing.hrefUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={listing.text}
                        >
                            <img src={listing.imgUrl} alt={listing.text} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Footer;
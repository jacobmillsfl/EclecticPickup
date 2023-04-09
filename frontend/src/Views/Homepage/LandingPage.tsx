import { useEffect } from "react";
import TafCarousel from "../Promo/TafCarousel";
import { SocialList, SocialListing } from "../../Components/Controls/SocialList";

export default function LandingPage()
{
    const streamingList = new Array<SocialListing>(
        {
            hrefUrl: "https://open.spotify.com/album/2x6ud6V4iFkBWXer2wa6jJ",
            imgUrl: process.env.PUBLIC_URL + "/img/spotify.jpg",
            text: "Spotify"
        },
        {
            hrefUrl: "https://www.youtube.com/channel/UCsazgqlooNADQr14A7HQdFw",
            imgUrl: process.env.PUBLIC_URL + "/img/youtube.jpg",
            text: "YouTube"
        },
        {
            hrefUrl: "https://music.apple.com/us/album/taf/1545717073",
            imgUrl: process.env.PUBLIC_URL + "/img/itunes.jpg",
            text: "iTunes"
        },
        {
            hrefUrl: "https://music.apple.com/us/album/taf/1545717073",
            imgUrl: process.env.PUBLIC_URL + "/img/applemusic.jpg",
            text: "Apple Music"
        },
        {
            hrefUrl: "https://soundcloud.com/theambientfunk",
            imgUrl: process.env.PUBLIC_URL + "/img/soundcloud.jpg",
            text: "SoundCloud"
        },
    );

    const socialMediaList = new Array<SocialListing>(
        {
            hrefUrl: "https://www.facebook.com/theambientfunk/",
            imgUrl: process.env.PUBLIC_URL + "/img/facebook.png",
            text: "Facebook"
        },
        {
            hrefUrl: "https://www.instagram.com/theambientfunk/",
            imgUrl: process.env.PUBLIC_URL + "/img/instagram.png",
            text: "Instagram"
        },
    );

    const merchList = new Array<SocialListing>(
        {
            hrefUrl: "https://www.ebay.com/usr/theambientfunk",
            imgUrl: process.env.PUBLIC_URL + "/img/ebay.jpg",
            text: "eBay"
        },
    );

    const emailList = new Array<SocialListing>(
        {
            hrefUrl: "mailto:theambientfunk@gmail.com",
            imgUrl: process.env.PUBLIC_URL + "/img/email.png",
            text: "theambientfunk@gmail.com"
        },
    );

    return (
        <div style={PaddingBottomStyle}>
            <div className="row">
                <div className="col-md-12">
                    <TafCarousel />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <SocialList listings={socialMediaList} heading="Social Media"></SocialList>
                    <SocialList listings={merchList} heading="Merch"></SocialList>
                    <SocialList listings={emailList} heading="Email"></SocialList>
                </div>
                <div className="col-md-6 col-sm-12">
                    <SocialList listings={streamingList} heading="Music"></SocialList>
                </div>
            </div>
        </div>
    );
}

const PaddingBottomStyle = {
    "paddingBottom":"5em"
}
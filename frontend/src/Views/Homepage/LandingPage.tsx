import { useEffect } from "react";
import TafCarousel from "../Album/TafCarousel";
import { SocialList, SocialListing } from "../../Components/Controls/SocialList";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import ShadowBox from "../../Components/Controls/ShadowBox";
import { BandMember, BandMemberList } from "../../Components/Controls/BandMemberList";
import HomePage from "./Homepage"

export default function LandingPage() {
    const bandMembers = new Array<BandMember>(
        {
            name: "Brad",
            imgUrl: "Brad.jpg",
            text: "Guitar, Keys",
        },
        {
            name: "Jacob",
            imgUrl: "Jacob.png",
            text: "Guitar, Bass, Keys",
        },
        {
            name: "Clayton",
            imgUrl: "Clayton.jpg",
            text: "Percussion",
        },
        {
            name: "Thomas",
            imgUrl: "Thomas.jpg",
            text: "Vocals",
        },
        {
            name: "Rick",
            imgUrl: "Rick.png",
            text: "Vocals",
        },
    );
    
    const streamingList = new Array<SocialListing>(
        {
            hrefUrl: "https://open.spotify.com/album/2x6ud6V4iFkBWXer2wa6jJ",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/spotify.jpg",
            text: "Spotify"
        },
        {
            hrefUrl: "https://www.youtube.com/channel/UCsazgqlooNADQr14A7HQdFw",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/youtube.jpg",
            text: "YouTube"
        },
        {
            hrefUrl: "https://music.apple.com/us/album/taf/1545717073",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/itunes.jpg",
            text: "iTunes"
        },
        {
            hrefUrl: "https://music.apple.com/us/album/taf/1545717073",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/applemusic.jpg",
            text: "Apple Music"
        },
        {
            hrefUrl: "https://soundcloud.com/theambientfunk",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/soundcloud.jpg",
            text: "SoundCloud"
        },
    );

    const socialMediaList = new Array<SocialListing>(
        {
            hrefUrl: "https://www.facebook.com/theambientfunk/",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/facebook.png",
            text: "Facebook"
        },
        {
            hrefUrl: "https://www.instagram.com/theambientfunk/",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/instagram.jpg",
            text: "Instagram"
        },
    );

    const merchList = new Array<SocialListing>(
        {
            hrefUrl: "https://www.ebay.com/usr/theambientfunk",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/ebay.jpg",
            text: "eBay"
        },
    );

    const emailList = new Array<SocialListing>(
        {
            hrefUrl: "mailto:theambientfunk@gmail.com",
            imgUrl: process.env.PUBLIC_URL + "/img/socials/email.png",
            text: "theambientfunk@gmail.com"
        },
    );

    return (
        <ContentContainer>
            <div className="row">
                <div className="col-md-12">
                    <TafCarousel />
                </div>
            </div>
            <HomePage />
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
            <div className="layer4">
            <div className="layer4Bg">
                <div className="layer4Content">
                    <div className="layer4Text">
                        <div className="layer4TextHeading">
                            Heading
                        </div>
                        <div className="layer4TextSubtext">
                            Subtext
                        </div>
                    </div>
                    <div className="layer4ContactContainer">
                        <div className="layer4Contact">
                            Contact
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="layer3">
        <a className="layer3BgSource" href="https://www.pixiv.net/en/users/1508165" target="_blank" rel="noreferrer">Background illustration by: ryosios</a>
        <div className="layer3Text">
            {/* <div className="layer3Quote">
                layer 3 quote
            </div>
            <div className="layer3QuoteFrom">
                layer 3 quote from
            </div> */}
                        <ShadowBox mode="top">
                <div style={AboutBodyStyle}>
                    <h2>
                        About Us
                    </h2>
                    <p style={AboutContentStyle}>
                        The Ambient Funk is an alternative rock band combining elements of jazz, funk, blues, rock, and electronica. Founded in 2018, the sounds of The Ambient Funk take listeners on a passively engaging journey through evolving soundscapes.
                        The Ambient Funk released their debut album "TAF" in 2020 and is expected to release a second album in 2023.
                    </p>
                </div>
            </ShadowBox>
            <BandMemberList members={bandMembers} />
        </div>
    </div>
    
        </ContentContainer>
    );
}

const EmailStyle = {
    "paddingTop": "2em"
}

const AboutBodyStyle = {
    "maxWidth": "600px",
    "textAlign": "center" as const,
    "margin": "auto",
    "marginBotton": "1em"
}

const AboutContentStyle = {
    "color": "white",
    "paddingTop": "2em",
    "fontSize": "22px",
    "fontFamily": "Ariel",
    "textAlign": "justify" as const,
}
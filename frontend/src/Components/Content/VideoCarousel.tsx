import { useMemo } from "react";
import ShadowBox from "../Controls/ShadowBox";
import Carousel from "react-bootstrap/Carousel";

export type BandVideo = {
  src: string;
  alt: string;
  youtube: boolean;
};

export const VideoCarousel: React.FC<{ props: Array<BandVideo> }> = ({ props }) => {
  const videoEmbed = (video: BandVideo) => {
    if (video.youtube) {
      return (
        <div style={VideoContainerStyle}>
          <iframe
            style={VideoContainerInnerStyle}
            src={video.src}
            title={video.alt}
            allowFullScreen
            frameBorder="0"
          ></iframe>
        </div>
      );
    } else {
      return (
        <div style={VideoContainerStyle}>
          <video
            style={VideoContainerInnerStyle}
            controls
            src={video.src}
          >
            <source src={video.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  const memoizedCarouselItem = useMemo(() => {
    return props.map((video, index) => (
      <Carousel.Item key={index}>
        <div className="row" style={CarouselRowStyle}>
          <div className="col-sm-2"></div>
          <div className="col-sm-8" style={VideoStyle}>
            {videoEmbed(video)}
          </div>
          <div className="col-sm-2"></div>
        </div>
      </Carousel.Item>
    ));
  }, [props]);

  return (
    <ShadowBox mode="top">
      <div id="videos" style={HeaderStyle}>
        <h2>Videos</h2>
      </div>
      <Carousel slide interval={null} controls={false} prevIcon={false} nextIcon={false}>
        {memoizedCarouselItem}
      </Carousel>
    </ShadowBox>
  );
};

const VideoStyle = {
  // maxWidth: "100vw",
  // maxHeight: "300px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "auto",
  marginBottom: "auto",
};

const CarouselRowStyle = {
  minHeight: "350px",
  paddingBottom: "4em",
};

const HeaderStyle = {
  textAlign: "center" as const,
  textShadow: "5px 5px black",
  paddingBottom: "2em",
};

const VideoContainerStyle = {
  position: "relative" as const,
  width: "100%",
  height: "600px",
  paddingTop: "56.25%", /* 16:9 aspect ratio (height/width * 100) */
} as React.CSSProperties

const VideoContainerInnerStyle = {
  position: "absolute" as const,
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  // objectFit: 'cover',
} as React.CSSProperties
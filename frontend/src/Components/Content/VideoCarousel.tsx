import ShadowBox from "../Controls/ShadowBox";
import Carousel from "react-bootstrap/Carousel";

export type Video = {
  src: string;
  alt: string;
  youtube: boolean;
};

export const VideoCarousel: React.FC<{ props: Array<Video> }> = ({ props }) => {
  const videoEmbed = (video: Video) => {
    if (video.youtube) {
      return (
        <iframe
          width="100%"
          height="300px"
          src={video.src}
          title={video.alt}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      );
    } else {
      return <div></div>;
    }
  };

  const carouselItemData = props.map((video, index) => {
    return (
      <Carousel.Item key={index}>
        <div className="row" style={CarouselRowStyle}>
          <div className="col-sm-2"></div>
          <div className="col-sm-8" style={VideoStyle}>
            {videoEmbed(video)}
          </div>
          <div className="col-sm-2"></div>
        </div>
      </Carousel.Item>
    );
  });

  return (
    <ShadowBox mode="top">
      <div id="videos" style={HeaderStyle}>
        <h2>Videos</h2>
      </div>
      <Carousel slide interval={null}>
        {carouselItemData}
      </Carousel>
    </ShadowBox>
  );
};

const VideoStyle = {
  maxWidth: "100vw",
  maxHeight: "300px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "auto",
  marginBottom: "auto",
};

const CarouselRowStyle = {
  minHeight: "350px",
};

const HeaderStyle = {
  textAlign: "center" as const,
  textShadow: "5px 5px black",
  paddingBottom: "2em",
};

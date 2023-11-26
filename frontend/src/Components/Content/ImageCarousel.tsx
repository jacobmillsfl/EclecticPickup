import ShadowBox from "../Controls/ShadowBox";
import Carousel from "react-bootstrap/Carousel";

export type Image = {
  src: string;
  alt: string;
};
/** TODO: Create utility to create ImageCarouselData and VideoCarouselData */
export const ImageCarousel: React.FC<{ props: Array<Image> }> = ({ props }) => {
  const carouselItemData = props.map((item) => {
    return (
      <Carousel.Item>
        <div className="row" style={CarouselRowStyle}>
          <div className="col-lg-12">
            <img src={item.src} alt={item.alt} style={ImageStyle} />
          </div>
        </div>
      </Carousel.Item>
    );
  });

  return (
    <ShadowBox mode="top">
      <Carousel>{carouselItemData}</Carousel>
    </ShadowBox>
  );
};

const ImageStyle = {
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

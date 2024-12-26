import { BandImageModel } from "../../Types/DbModels";
import ShadowBox from "../Controls/ShadowBox";
import Carousel from "react-bootstrap/Carousel";

export const ImageCarousel: React.FC<{ props: Array<BandImageModel> }> = ({ props }) => {
  const carouselItemData = props.map((item, index) => {
    return (
      <Carousel.Item key={index}>
        <img src={item.filename} alt={item.caption} style={ImageStyle} />
        <Carousel.Caption style={CaptionStyle}>
          <p>{item.caption}</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  });

  return (
    <ShadowBox mode="top">
      <Carousel fade pause={"hover"}>
        {carouselItemData}
      </Carousel>
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

const CaptionStyle = {
  //backgroundColor: "rgba(0, 0, 0, 0.6)", // Transparent black background
  color: "#fff",
  fontFamily: "fantasy",
  textAlign: "center",
  padding: "10px",
  fontSize: "larger",
  textShadow: "6px 6px 10px rgba(0,0,0, 1.0)",
} as React.CSSProperties;
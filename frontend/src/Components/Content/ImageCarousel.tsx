import { BandImageModel } from "../../Types/DbModels";
import Carousel from "react-bootstrap/Carousel";

export const ImageCarousel: React.FC<{ props: BandImageModel[] }> = ({
  props,
}) => {
  if (!props.length) return null;

  return (
    <section
      className="page-section gallery-section"
      aria-labelledby="gallery-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">On &amp; off the stage</p>
          <h2 id="gallery-heading">A few good moments.</h2>
        </div>
      </div>
      <Carousel
        className="photo-gallery"
        interval={null}
        indicators={props.length > 1}
        controls={props.length > 1}
      >
        {props.map((item) => (
          <Carousel.Item key={item.id}>
            <img src={item.filename} alt={item.caption} loading="lazy" />
            {item.caption && (
              <Carousel.Caption>
                <p>{item.caption}</p>
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

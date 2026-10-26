import { BandImageModel } from "../../Types/DbModels";
import Carousel from "react-bootstrap/Carousel";

export const BandPhotoCarousel = ({
  images,
  className = "photo-gallery",
  label = "Band photos",
  showCaptions = true,
  eagerFirst = false,
}: {
  images: BandImageModel[];
  className?: string;
  label?: string;
  showCaptions?: boolean;
  eagerFirst?: boolean;
}) => {
  if (!images.length) return null;

  // Reset slide state when asynchronously loaded photos change the photo set.
  return (
    <Carousel
      key={images.map((image) => image.id).join(":")}
      className={className}
      aria-label={label}
      interval={null}
      indicators={images.length > 1}
      controls={images.length > 1}
    >
      {images.map((item, index) => (
        <Carousel.Item key={item.id}>
          <img
            src={item.filename}
            alt={item.caption || "Eclectic Pickup band photo"}
            loading={eagerFirst && index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          {showCaptions && item.caption && (
            <Carousel.Caption>
              <p>{item.caption}</p>
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

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
      <BandPhotoCarousel images={props} />
    </section>
  );
};

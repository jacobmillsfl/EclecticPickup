import { useState } from "react";

export type BandVideo = {
  src: string;
  alt: string;
  youtube: boolean;
};

export const VideoCarousel: React.FC<{ props: BandVideo[] }> = ({ props }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = props.length ? selectedIndex % props.length : 0;
  const video = props[activeIndex];
  const selectVideo = (index: number) =>
    setSelectedIndex((index + props.length) % props.length);

  return (
    <section
      id="videos"
      className="page-section videos-section"
      aria-labelledby="videos-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Videos</p>
          <h2 id="videos-heading">Live Music</h2>
        </div>
      </div>
      {video ? (
        <div
          className="video-carousel"
          role="group"
          aria-label="Live music videos"
          aria-roledescription="carousel"
        >
          <figure className="video-card" key={video.src}>
            {video.youtube ? (
              <iframe
                src={video.src}
                title={video.alt || "Eclectic Pickup live"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <video
                controls
                src={video.src}
                preload="none"
                aria-label={video.alt || "Eclectic Pickup live"}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </figure>
          {props.length > 1 && (
            <nav className="video-controls" aria-label="Video selection">
              <button
                className="page-button"
                onClick={() => selectVideo(activeIndex - 1)}
                aria-label="Previous video"
              >
                Previous
              </button>
              <div className="video-indicators">
                {props.map((item, index) => (
                  <button
                    className="page-button"
                    key={item.src}
                    aria-label={`Show video ${index + 1}: ${
                      item.alt || "Eclectic Pickup live"
                    }`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => selectVideo(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="page-button"
                onClick={() => selectVideo(activeIndex + 1)}
                aria-label="Next video"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      ) : (
        <p className="section-note">
          More music coming soon. Catch us at a show in the meantime.
        </p>
      )}
    </section>
  );
};

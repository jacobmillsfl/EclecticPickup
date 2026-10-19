export type BandVideo = {
  src: string;
  alt: string;
  youtube: boolean;
};

export const VideoCarousel: React.FC<{ props: BandVideo[] }> = ({ props }) => (
  <section
    id="videos"
    className="page-section videos-section"
    aria-labelledby="videos-heading"
  >
    <div className="section-heading">
      <div>
        <p className="eyebrow">Turn it up</p>
        <h2 id="videos-heading">A little of the live sound.</h2>
      </div>
    </div>
    {props.length ? (
      <div className="video-grid">
        {props.map((video) => (
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
            {video.alt && <figcaption>{video.alt}</figcaption>}
          </figure>
        ))}
      </div>
    ) : (
      <p className="section-note">
        More music coming soon. Catch us at a show in the meantime.
      </p>
    )}
  </section>
);

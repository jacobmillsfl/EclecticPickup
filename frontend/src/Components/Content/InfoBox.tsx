export type InfoBoxProps = {
  heading: string;
  paragraph: string;
  image?: string;
};

export const InfoBox: React.FC<{ props: InfoBoxProps }> = ({ props }) => (
  <div className="about-copy">
    <div>
      <p className="eyebrow">Meet the band</p>
      <h2 id="about-heading">{props.heading}</h2>
    </div>
    {props.paragraph && <p className="band-bio">{props.paragraph}</p>}
    {props.image && (
      <img src={props.image} alt={props.heading} loading="lazy" />
    )}
  </div>
);

import ShadowBox from "../Controls/ShadowBox";

export type InfoBoxProps = {
  heading: string;
  paragraph: string;
};

export const InfoBox: React.FC<{ props: InfoBoxProps }> = ({ props }) => {
  return (
    <ShadowBox mode="top">
      <div id="about" style={InfoBoxBodyStyle}>
        <img src={`${process.env.PUBLIC_URL}/img/EclecticPickup-224x300.gif`} />
        <h2>{props.heading}</h2>
        <p style={AboutContentStyle}>{props.paragraph}</p>
      </div>
    </ShadowBox>
  );
};

const InfoBoxBodyStyle = {
  maxWidth: "600px",
  textAlign: "center" as const,
  margin: "auto",
  marginBotton: "1em",
};

const AboutContentStyle = {
  color: "white",
  paddingTop: "2em",
  fontSize: "22px",
  fontFamily: "Ariel",
  textAlign: "justify" as const,
};

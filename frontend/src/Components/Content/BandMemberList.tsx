export type BandMember = {
  imgUrl: string;
  name: string;
  text: string;
};

export const BandMemberList: React.FC<{ props: BandMember[] }> = ({
  props,
}) => (
  <div className="band-grid">
    {props.map((member) => (
      <article className="band-member" key={member.name}>
        {member.imgUrl && (
          <img
            src={member.imgUrl}
            alt={member.name}
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
          />
        )}
        <div>
          <h3>{member.name}</h3>
          <p>{member.text}</p>
        </div>
      </article>
    ))}
  </div>
);

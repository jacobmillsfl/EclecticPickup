import Table from "react-bootstrap/Table";
import { Gig } from "../../Types";
import Misc from "../../Utilities/Misc";

export type GigsProps = {
  heading: string;
  gigs: Array<Gig>;
};

export const GigsComponent: React.FC<{ props: GigsProps }> = ({ props }) => {

  const sortShows = (shows: Array<Gig>): Array<Gig> => {
    // Use the sort method to sort the shows array based on the date field
    const sortedShows = [...shows].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedShows;
  };

  const getMapLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${address}`
  }

  return (
    <div id="shows" className={props.heading == "Upcoming Gigs" ? "layer4Bg" : "layer4BgReversed"}>
      <div style={HeaderStyle}>
        <h2>{props.heading}</h2>
      </div>

      <Table striped bordered hover variant="dark" style={TableStyle}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Venue</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {sortShows(props.gigs).map((show, index) => (
            <tr key={index} className={show.date.getTime() < Date.now() ? 'past-date' : '' }>
              <td>{Misc.formatDate(show.date)}</td>
              <td>{show.time}</td>
              <td>{show.venue}</td>
              <td><a 
                href={getMapLink(show.address)}
                target="_blank"
                rel="noopener noreferrer">
                  {show.address}
              </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const HeaderStyle = {
  textAlign: "center" as const,
  textShadow: "5px 5px black",
  paddingBottom: "2em",
};

const TableStyle = {
  maxWidth: "1020px",
  marginLeft: "auto",
  marginRight: "auto",
};

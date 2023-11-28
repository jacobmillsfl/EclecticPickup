import Table from "react-bootstrap/Table";

export type Show = {
  date: Date;
  time: string;
  venue: string;
  address: string;
};

export const UpcomingShows: React.FC<{ props: Array<Show> }> = ({ props }) => {
  const formatDate = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
  };

  const sortShows = (shows: Array<Show>): Array<Show> => {
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

  return (
    <div id="shows" className="layer4Bg">
      <div style={HeaderStyle}>
        <h2>Upcoming Shows</h2>
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
          {sortShows(props).map((show, index) => (
            <tr key={index}>
              <td>{formatDate(show.date)}</td>
              <td>{show.time}</td>
              <td>{show.venue}</td>
              <td>{show.address}</td>
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
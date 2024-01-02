import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import ApiClient from "../../Utilities/Api/ApiClient";
import { Gig } from "../../Types";

export const AdminEventTable: React.FC<{ props: Array<Gig> }> = ({
  props,
}) => {
  const [selectedGig, setSelectedGig] = useState<Gig>();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = (id: number) => {
    const selectedItem = props.filter((item) => item.id === id).at(0);
    if (selectedItem) {
      setShowModal(true);
      setSelectedGig(selectedItem);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedGig) {
      ApiClient.event.deleteEvent(selectedGig.id);
      window.location.href = "/admin";
    }
  }

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

  const getMapLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  const getEditLink = (eventId: number) => {
    return `/create-event?eid=${eventId}`;
  };

  return (
    <div>
      <div className="row mt-4 mb-4">
        <div>
          <Button
            variant="primary"
            size="sm"
            style={{ float: "right" }}
            onClick={() => {
              window.location.href = "/create-event";
            }}
          >
            Create Event
          </Button>
        </div>
      </div>
      <Table striped bordered hover variant="dark" style={TableStyle}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Venue</th>
            <th>Address</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortShows(props).map((show, index) => (
            <tr
              key={index}
              className={show.date.getTime() < Date.now() ? "past-date" : ""}
            >
              <td>{formatDate(show.date)}</td>
              <td>{show.time}</td>
              <td>{show.venue}</td>
              <td>
                <a
                  href={getMapLink(show.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {show.address}
                </a>
              </td>
              <td>
                <a href={getEditLink(show.id)}>
                  <Badge pill bg="warning">
                    Edit
                  </Badge>
                </a>
              </td>
              <td>
                <Badge
                  pill
                  bg="danger"
                  style={{"cursor":"pointer"}}
                  onClick={() => {
                    handleShowModal(show.id);
                  }}
                >
                  Delete
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Gig</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to delete this Gig?</p>
            {selectedGig && (
              <pre style={GigDetailsStyle}>
                <p>ID:      {selectedGig.id}</p>
                <p>DATE:    {formatDate(selectedGig.date)}</p>
                <p>TIME:    {selectedGig.time}</p>
                <p>VENUE:   {selectedGig.venue}</p>
                <p>ADDRESS: {selectedGig.address}</p>
              </pre>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};


const TableStyle = {
  maxWidth: "1020px",
  marginLeft: "auto",
  marginRight: "auto",
};

const GigDetailsStyle = {
  padding: "1em",
  backgroundColor: "rgb(.1,.1,.1,.1)",
}
import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Gig } from "../../Types";
import Misc from "../../Utilities/Misc";

const PAGE_SIZE = 8;

function startOfDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

function ShowTable({ gigs, past }: { gigs: Gig[]; past: boolean }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(gigs.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const first = (currentPage - 1) * PAGE_SIZE;
  const visibleGigs = gigs.slice(first, first + PAGE_SIZE);

  useEffect(() => {
    setPage((previous) => Math.min(previous, pageCount));
  }, [pageCount]);

  if (!gigs.length) {
    return (
      <div className="shows-empty">
        <h3>
          {past ? "The story starts here." : "More live music on the way."}
        </h3>
        <p>
          {past
            ? "Past shows will appear here."
            : "No upcoming dates announced. Join the mailing list for the next one."}
        </p>
        {!past && <a href="#subscribe">Keep me in the loop</a>}
      </div>
    );
  }

  return (
    <>
      <p className="shows-table-hint">
        Scroll across for time and location{" "}
        <span aria-hidden="true">&#8594;</span>
      </p>
      <div
        className="shows-table-scroll"
        role="region"
        aria-label={`${past ? "Past" : "Upcoming"} shows table`}
        tabIndex={0}
      >
        <table className="shows-table">
          <caption className="visually-hidden">
            {past
              ? "Past shows, newest first"
              : "Upcoming shows, soonest first"}
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Venue</th>
              <th scope="col">Time</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            {visibleGigs.map((show) => (
              <tr key={show.id}>
                <td className="show-date">{Misc.formatDate(show.date)}</td>
                <th scope="row">{show.venue}</th>
                <td>{show.time}</td>
                <td>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      show.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Directions to ${show.venue}: ${show.address} (opens in a new tab)`}
                  >
                    {show.address}
                    <span aria-hidden="true"> &#8599;</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="shows-pagination">
        <p role="status">
          {first + 1}&ndash;{Math.min(first + PAGE_SIZE, gigs.length)} of{" "}
          {gigs.length} shows
        </p>
        <nav aria-label={`${past ? "Past" : "Upcoming"} shows pagination`}>
          <button
            type="button"
            className="page-button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <span aria-hidden="true">&#8592; </span>Previous
          </button>
          <span className="page-number">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            className="page-button"
            disabled={currentPage === pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next<span aria-hidden="true"> &#8594;</span>
          </button>
        </nav>
      </div>
    </>
  );
}

type GigsComponentProps = {
  gigs: Gig[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export const GigsComponent = ({
  gigs,
  loading = false,
  error = null,
  onRetry,
}: GigsComponentProps) => {
  const [today, setToday] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refreshDay = () => {
      clearTimeout(timer);
      const now = new Date();
      setToday(startOfDay(now));
      // Use the next local midnight, not a 24-hour interval (daylight saving time).
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      timer = setTimeout(refreshDay, midnight.getTime() - now.getTime());
    };
    refreshDay();
    window.addEventListener("focus", refreshDay);
    document.addEventListener("visibilitychange", refreshDay);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refreshDay);
      document.removeEventListener("visibilitychange", refreshDay);
    };
  }, []);

  const upcoming = gigs
    .filter((gig) => startOfDay(gig.date) >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.id - b.id);
  const past = gigs
    .filter((gig) => startOfDay(gig.date) < today)
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.id - b.id);

  return (
    <section
      id="shows"
      className="page-section shows-section"
      aria-labelledby="shows-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Come on out</p>
          <h2 id="shows-heading">See you at a show.</h2>
        </div>
        <p>Find our next stop. Revisit a good night.</p>
      </div>
      <div className="shows-card">
        {loading ? (
          <p className="shows-empty" role="status">
            Loading shows...
          </p>
        ) : error ? (
          <div className="shows-empty" role="alert">
            <p>{error}</p>
            {onRetry && (
              <button
                type="button"
                className="button-secondary"
                onClick={onRetry}
              >
                Try again
              </button>
            )}
          </div>
        ) : (
          <Tabs
            id="shows-tabs"
            defaultActiveKey="upcoming"
            className="shows-tabs"
            transition={false}
            mountOnEnter
            unmountOnExit
          >
            <Tab
              eventKey="upcoming"
              title={`Upcoming shows (${upcoming.length})`}
            >
              <ShowTable gigs={upcoming} past={false} />
            </Tab>
            <Tab eventKey="past" title={`Past shows (${past.length})`}>
              <ShowTable gigs={past} past />
            </Tab>
          </Tabs>
        )}
      </div>
    </section>
  );
};

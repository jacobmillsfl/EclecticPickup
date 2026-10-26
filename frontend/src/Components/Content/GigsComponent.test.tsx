import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Gig } from "../../Types";
import { GigsComponent } from "./GigsComponent";

function gig(id: number, day: number): Gig {
  return {
    id,
    date: new Date(2026, 9, day),
    venue: `Venue ${id}`,
    time: "7:00 PM",
    address: "123 Main St & 2nd #A",
  };
}

function switchPane(name: RegExp) {
  fireEvent.click(screen.getByRole("tab", { name }));
}

function venues() {
  return screen.getAllByRole("rowheader").map((cell) => cell.textContent);
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 9, 19, 23, 59, 59));
});

afterEach(() => {
  jest.useRealTimers();
});

test.each([0, 12, 23])(
  "keeps today's shows upcoming at %i:00 local time",
  (hour) => {
    jest.setSystemTime(new Date(2026, 9, 19, hour, 0));
    render(<GigsComponent gigs={[gig(1, 18), gig(3, 20), gig(2, 19)]} />);
    expect(venues()).toEqual(["Venue 2", "Venue 3"]);
    expect(
      screen.getByRole("tab", { name: "Upcoming shows (2)" })
    ).toHaveAttribute("aria-selected", "true");
    switchPane(/Past shows/);
    expect(venues()).toEqual(["Venue 1"]);
  }
);

test("sorts history newest first without mutating input and encodes map addresses", () => {
  const gigs = [gig(1, 16), gig(2, 18), gig(3, 17)];
  const original = [...gigs];
  render(<GigsComponent gigs={gigs} />);
  switchPane(/Past shows/);
  expect(venues()).toEqual(["Venue 2", "Venue 3", "Venue 1"]);
  expect(gigs).toEqual(original);
  expect(
    screen.getByRole("link", { name: /Directions to Venue 2/ })
  ).toHaveAttribute(
    "href",
    "https://www.google.com/maps/search/?api=1&query=123%20Main%20St%20%26%202nd%20%23A"
  );
});

test("paginates eight rows at a time with correct boundaries and final partial page", () => {
  render(
    <GigsComponent
      gigs={Array.from({ length: 17 }, (_, i) => gig(i + 1, 20 + i))}
    />
  );
  expect(venues()).toHaveLength(8);
  expect(screen.getByRole("status")).toHaveTextContent("1–8 of 17 shows");
  expect(screen.getByRole("button", { name: /Previous/ })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  expect(venues()).toEqual(
    Array.from({ length: 8 }, (_, i) => `Venue ${i + 9}`)
  );
  expect(screen.getByRole("status")).toHaveTextContent("9–16 of 17 shows");
  fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  expect(venues()).toEqual(["Venue 17"]);
  expect(screen.getByRole("status")).toHaveTextContent("17–17 of 17 shows");
  expect(screen.getByRole("button", { name: /Next/ })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: /Previous/ }));
  expect(screen.getByRole("status")).toHaveTextContent("9–16 of 17 shows");
});

test("paginates history and resets to page one when switching panes", () => {
  render(
    <GigsComponent
      gigs={[
        ...Array.from({ length: 10 }, (_, i) => gig(i + 1, 20 + i)),
        ...Array.from({ length: 10 }, (_, i) => gig(i + 20, 18 - i)),
      ]}
    />
  );
  fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  switchPane(/Past shows/);
  expect(screen.getByRole("status")).toHaveTextContent("1–8 of 10 shows");
  fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  expect(venues()).toEqual(["Venue 28", "Venue 29"]);
  switchPane(/Upcoming shows/);
  expect(screen.getByRole("status")).toHaveTextContent("1–8 of 10 shows");
  expect(venues()[0]).toBe("Venue 1");
});

test("handles empty panes and replacing or removing data without stale rows", () => {
  const { rerender } = render(
    <GigsComponent
      gigs={Array.from({ length: 10 }, (_, i) => gig(i + 1, 20 + i))}
    />
  );
  fireEvent.click(screen.getByRole("button", { name: /Next/ }));
  rerender(<GigsComponent gigs={[gig(11, 21)]} />);
  expect(venues()).toEqual(["Venue 11"]);
  expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  rerender(<GigsComponent gigs={[]} />);
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(screen.getByText("More live music on the way.")).toBeInTheDocument();
  switchPane(/Past shows/);
  expect(screen.getByText("Past shows will appear here.")).toBeInTheDocument();
  expect(
    screen.queryByRole("navigation", { name: /pagination/ })
  ).not.toBeInTheDocument();
});

test("moves a show into history at local midnight while the page stays open", () => {
  render(<GigsComponent gigs={[gig(1, 19), gig(2, 20)]} />);
  expect(venues()).toEqual(["Venue 1", "Venue 2"]);
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(venues()).toEqual(["Venue 2"]);
  switchPane(/Past shows/);
  expect(venues()).toEqual(["Venue 1"]);
});

test("refreshes the local day when returning to a suspended tab", () => {
  render(<GigsComponent gigs={[gig(1, 19)]} />);
  jest.setSystemTime(new Date(2026, 9, 21, 12));
  fireEvent(window, new Event("focus"));
  expect(
    screen.getByRole("tab", { name: "Upcoming shows (0)" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("tab", { name: "Past shows (1)" })
  ).toBeInTheDocument();
});

test("schedules the next calendar midnight across daylight-saving changes", () => {
  const now = new Date(2026, 2, 8);
  const nextMidnight = new Date(2026, 2, 9);
  jest.setSystemTime(now);
  render(<GigsComponent gigs={[{ ...gig(1, 19), date: now }]} />);
  act(() => {
    jest.advanceTimersByTime(nextMidnight.getTime() - now.getTime());
  });
  expect(
    screen.getByRole("tab", { name: "Past shows (1)" })
  ).toBeInTheDocument();
});

test("supports keyboard pane switching and exposes labelled tab panels", () => {
  render(<GigsComponent gigs={[gig(1, 18), gig(2, 20)]} />);
  const upcoming = screen.getByRole("tab", { name: /Upcoming shows/ });
  upcoming.focus();
  fireEvent.keyDown(upcoming, { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: /Past shows/ })).toHaveAttribute(
    "aria-selected",
    "true"
  );
  expect(
    within(screen.getByRole("tabpanel")).getByRole("rowheader", {
      name: "Venue 1",
    })
  ).toBeInTheDocument();
});

test("distinguishes loading and failure from an empty schedule and allows retry", () => {
  const retry = jest.fn();
  const { rerender } = render(<GigsComponent gigs={[]} loading />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading shows...");
  expect(
    screen.queryByText("More live music on the way.")
  ).not.toBeInTheDocument();
  rerender(
    <GigsComponent gigs={[]} error="Unable to load shows." onRetry={retry} />
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to load shows.");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(retry).toHaveBeenCalledTimes(1);
});

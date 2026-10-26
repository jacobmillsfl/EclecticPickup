import { fireEvent, render, screen, within } from "@testing-library/react";
import { BandVideo, VideoCarousel } from "./VideoCarousel";

const videos: BandVideo[] = [
  {
    src: "https://www.youtube.com/embed/first",
    alt: "First song",
    youtube: true,
  },
  {
    src: "https://www.youtube.com/embed/second",
    alt: "Second song",
    youtube: true,
  },
  { src: "/third.mp4", alt: "Third song", youtube: false },
];

test("shows the empty state without controls", () => {
  render(<VideoCarousel props={[]} />);
  expect(
    screen.getByRole("heading", { name: "Live Music" })
  ).toBeInTheDocument();
  expect(screen.getByText(/More music coming soon/)).toBeInTheDocument();
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

test("shows one video without unnecessary controls or visible captions", () => {
  render(<VideoCarousel props={[{ ...videos[0], alt: "yt" }]} />);
  expect(screen.getByTitle("yt")).toHaveAttribute("loading", "lazy");
  expect(screen.queryByText("yt")).not.toBeInTheDocument();
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  expect(screen.queryByText(/Video \d+ of \d+/)).not.toBeInTheDocument();
});

test("cycles in both directions and unmounts inactive players", () => {
  const { container } = render(<VideoCarousel props={videos} />);
  const controls = screen.getByRole("navigation", { name: "Video selection" });
  const next = within(controls).getByRole("button", { name: "Next video" });
  const previous = within(controls).getByRole("button", {
    name: "Previous video",
  });
  const firstPlayer = screen.getByTitle("First song");
  fireEvent.click(next);
  expect(firstPlayer).not.toBeInTheDocument();
  expect(screen.getByTitle("Second song")).toBeInTheDocument();
  expect(screen.queryByText(/Video \d+ of \d+/)).not.toBeInTheDocument();
  fireEvent.click(next);
  expect(screen.getByLabelText("Third song")).toHaveAttribute("controls");
  expect(container.querySelectorAll("iframe, video")).toHaveLength(1);
  fireEvent.click(next);
  expect(screen.getByTitle("First song")).toBeInTheDocument();
  fireEvent.click(previous);
  expect(screen.getByLabelText("Third song")).toBeInTheDocument();
  fireEvent.click(
    within(controls).getByRole("button", { name: "Show video 2: Second song" })
  );
  expect(screen.getByTitle("Second song")).toBeInTheDocument();
  expect(
    within(controls).getByRole("button", { name: "Show video 2: Second song" })
  ).toHaveAttribute("aria-current", "true");
});

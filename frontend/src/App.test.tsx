import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import ApiClient from "./Utilities/Api/ApiClient";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  localStorage.clear();
  jest.spyOn(ApiClient, "getBandMembers").mockResolvedValue([]);
  jest.spyOn(ApiClient, "getCarouselVideos").mockResolvedValue([]);
  jest.spyOn(ApiClient, "getAllSocialLinks").mockResolvedValue({
    email: [],
    merch: [],
    socialMedia: [],
    streaming: [],
  });
  jest
    .spyOn(ApiClient.bandImage, "all")
    .mockResolvedValue({ msg: "OK", status: 200, data: [] });
  jest
    .spyOn(ApiClient.event, "all")
    .mockResolvedValue({ msg: "OK", status: 200, data: [] });
  jest.spyOn(ApiClient.settings, "all").mockResolvedValue({
    msg: "OK",
    status: 200,
    data: [
      { id: 1, name: "BAND_BIO", value: "Our story, straight from the band." },
      { id: 2, name: "BAND_MOTTO", value: "Our own sound." },
    ],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the modern public site with unique section anchors and CMS content", async () => {
  render(<App />);
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  expect(
    screen.getByRole("heading", { level: 1, name: "Eclectic Pickup" })
  ).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  expect(
    screen.getByText("Our story, straight from the band.")
  ).toBeInTheDocument();
  expect(screen.getByText("Our own sound.")).toBeInTheDocument();
  expect(
    screen.getAllByRole("region", { name: "See you at a show." })
  ).toHaveLength(1);
  expect(screen.getByRole("link", { name: /Find a show/ })).toHaveAttribute(
    "href",
    "#shows"
  );
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content"
  );
  const email = screen.getByRole("textbox", { name: "Email address" });
  expect(email).toHaveAttribute("type", "email");
  expect(email).toBeRequired();
  expect(
    screen.getByRole("form", { name: "Mailing list signup" })
  ).toHaveAttribute(
    "action",
    expect.stringContaining("list-manage.com/subscribe/post")
  );
});

test("prioritizes the discography and links honestly to the supplied artist pages", async () => {
  render(<App />);
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  const main = screen.getByRole("main");
  expect(
    Array.from(main.querySelectorAll(".landing-page > section[id]")).map(
      (section) => section.id
    )
  ).toEqual(["home", "albums", "shows", "about", "videos", "subscribe"]);
  const albums = screen.getByRole("region", {
    name: "Find your next favorite.",
  });
  expect(
    within(albums)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent)
  ).toEqual(["Volume 1", "Volume 2", "LIVE at Breck"]);
  expect(
    screen.getByRole("link", { name: /Listen to the albums/ })
  ).toHaveAttribute("href", "#albums");
  expect(
    within(albums).getByText("Explore all three albums on our artist pages:")
  ).toBeInTheDocument();
  const listening = screen.getByRole("navigation", {
    name: "Listen to Eclectic Pickup",
  });
  const destinations = [
    ["Spotify", "https://open.spotify.com/artist/0HU4opVeWSZBryB0vZzxu4"],
    ["YouTube Music", "https://music.youtube.com/@EclecticPickup"],
    [
      "Apple Music",
      "https://music.apple.com/us/artist/eclectic-pickup/1788079254",
    ],
    ["Bandcamp", "https://eclecticpickup.bandcamp.com/"],
  ];
  expect(within(listening).getAllByRole("link")).toHaveLength(4);
  destinations.forEach(([name, href]) => {
    const link = within(listening).getByRole("link", {
      name: `${name} (opens in a new tab)`,
    });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
  const navigation = screen.getByRole("navigation", {
    name: "Main navigation",
  });
  expect(
    within(navigation)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
  ).toEqual(["/", "/#albums", "/#shows", "/#about", "/#videos", "/#subscribe"]);
  expect(
    within(navigation).getByRole("link", { name: /^ECLECTIC\s?PICKUP$/ })
  ).toHaveTextContent(/^ECLECTICPICKUP$/);
  expect(
    within(screen.getByRole("contentinfo")).getByRole("link", {
      name: "Eclectic Pickup",
    })
  ).toHaveTextContent(/^Eclectic Pickup$/);
  expect(
    screen.queryByRole("link", { name: "Socials" })
  ).not.toBeInTheDocument();
});

test("keeps band administration reachable and guards unauthenticated admin access", async () => {
  window.history.replaceState({}, "", "/admin");
  render(<App />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(await screen.findByLabelText("User Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(
    within(screen.getByRole("contentinfo")).getByRole("link", {
      name: "Band admin",
    })
  ).toHaveAttribute("href", "/login");
});

test("reports shows fetch errors and retries instead of claiming there are no shows", async () => {
  const error = new Error("Network unavailable");
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  jest.mocked(ApiClient.event.all).mockRejectedValueOnce(error);
  render(<App />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "We couldn't load the shows."
  );
  expect(log).toHaveBeenCalledWith("Unable to load shows", error);
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  expect(ApiClient.event.all).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(
    screen.getByRole("tab", { name: "Upcoming shows (0)" })
  ).toBeInTheDocument();
});

test("preserves band members, photos, all videos and social destinations", async () => {
  jest
    .mocked(ApiClient.getBandMembers)
    .mockResolvedValue([
      { name: "Sample member", text: "Guitar", imgUrl: "/member.jpg" },
    ]);
  jest.mocked(ApiClient.bandImage.all).mockResolvedValue({
    msg: "OK",
    status: 200,
    data: [
      { id: 1, filename: "/photo-one.jpg", caption: "First band photo" },
      { id: 2, filename: "/photo-two.jpg", caption: "Second band photo" },
    ],
  });
  jest.mocked(ApiClient.getCarouselVideos).mockResolvedValue([
    {
      src: "https://www.youtube.com/embed/first",
      alt: "First performance",
      youtube: true,
    },
    {
      src: "https://www.youtube.com/embed/second",
      alt: "Second performance",
      youtube: true,
    },
  ]);
  jest.mocked(ApiClient.getAllSocialLinks).mockResolvedValue({
    email: [],
    merch: [],
    streaming: [],
    socialMedia: [
      {
        hrefUrl: "https://example.com/band",
        imgUrl: "/social.png",
        text: "Follow the band",
      },
    ],
  });
  render(<App />);
  expect(
    await screen.findByRole("heading", { name: "Sample member" })
  ).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "First band photo" })).toHaveAttribute(
    "src",
    "/photo-one.jpg"
  );
  expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  expect(screen.getByTitle("First performance")).toHaveAttribute(
    "loading",
    "lazy"
  );
  expect(screen.getByTitle("Second performance")).toBeInTheDocument();
  const socialSection = screen.getByRole("region", {
    name: "Keep good company.",
  });
  const socialLink = within(socialSection).getByRole("link", {
    name: /Follow the band/,
  });
  expect(socialLink).toHaveAttribute("href", "https://example.com/band");
  expect(socialLink).toHaveAttribute("target", "_blank");
  expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
  expect(
    within(screen.getByRole("contentinfo")).getByRole("link", {
      name: /Follow the band/,
    })
  ).toHaveAttribute("href", "https://example.com/band");
  expect(
    Array.from(
      screen.getByRole("main").querySelectorAll(".landing-page > section[id]")
    ).map((section) => section.id)
  ).toEqual([
    "home",
    "albums",
    "shows",
    "about",
    "videos",
    "socials",
    "subscribe",
  ]);
  const navigation = screen.getByRole("navigation", {
    name: "Main navigation",
  });
  expect(
    within(navigation)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
  ).toEqual([
    "/",
    "/#albums",
    "/#shows",
    "/#about",
    "/#videos",
    "/#socials",
    "/#subscribe",
  ]);
});

test("closes mobile navigation when a section is selected", async () => {
  render(<App />);
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  const toggle = screen.getByRole("button", { name: "Toggle navigation" });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("link", { name: "Albums" }));
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

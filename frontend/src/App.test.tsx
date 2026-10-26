import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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
  const logo = within(
    screen.getByRole("heading", { level: 1, name: "Eclectic Pickup" })
  ).getByRole("img", { name: "Eclectic Pickup" });
  expect(logo).toHaveAttribute("src", "eclectic-pickup-logo-1200.webp");
  expect(logo).toHaveAttribute(
    "srcset",
    "eclectic-pickup-logo-600.webp 600w, eclectic-pickup-logo-1200.webp 1200w"
  );
  expect(logo).toHaveAttribute("width", "1200");
  expect(logo).toHaveAttribute("height", "800");
  expect(logo).not.toHaveAttribute("loading", "lazy");
  const hero = screen.getByRole("region", { name: "Eclectic Pickup" });
  expect(
    within(hero).getByRole("img", { name: "The members of Eclectic Pickup" })
  ).toHaveAttribute("loading", "eager");
  expect(
    within(hero).queryByRole("button", { name: "Next" })
  ).not.toBeInTheDocument();
  expect(within(hero).getByText("Fort Collins, Colorado")).toBeInTheDocument();
  [
    "Better together. Better live.",
    "Dedication To The Groove",
    "Our music, ready when you are.",
    "Independent music",
    "Colorado roots",
    "Live & loud",
  ].forEach((copy) => {
    expect(screen.queryByText(copy, { exact: false })).not.toBeInTheDocument();
  });
  expect(hero).not.toHaveTextContent("Volume 1");
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  expect(
    screen.getByText(
      "It's a jam, but this isn't your typical jam band. While the music is rooted in rock, blues, and funk, the shows are a jazz-like experience. The songs, whether original or covers, are always fresh reinterpretations, depending on the players and the chemistry that session."
    )
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Our story, straight from the band.")
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Our own sound.")).not.toBeInTheDocument();
  expect(
    screen.getAllByRole("region", { name: "See you at a show." })
  ).toHaveLength(1);
  expect(screen.getByRole("link", { name: /Events/ })).toHaveAttribute(
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
  ).toEqual(["home", "albums", "shows", "about", "videos", "socials", "subscribe"]);
  const albums = screen.getByRole("region", {
    name: "Discography",
  });
  expect(
    screen.queryByText("Find your next favorite.")
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(
      "Three albums to make your own. Listen wherever you feel at home."
    )
  ).not.toBeInTheDocument();
  expect(
    within(albums)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent)
  ).toEqual(["Volume 1", "Volume 2", "LIVE at Breck"]);
  const cards = within(albums).getAllByRole("listitem");
  expect(cards).toHaveLength(3);
  [
    ["Volume 1", "volume-1"],
    ["Volume 2", "volume-2"],
    ["LIVE at Breck", "live-at-breck"],
  ].forEach(([title, file], index) => {
    const card = within(cards[index]);
    expect(card.getByRole("heading", { name: title })).toBeInTheDocument();
    const cover = card.getByRole("img", { name: `${title} album cover` });
    expect(cover).toHaveAttribute("src", `album-${file}-800.webp`);
    expect(cover).toHaveAttribute(
      "srcset",
      `album-${file}-400.webp 400w, album-${file}-800.webp 800w`
    );
    expect(cover).toHaveAttribute("sizes", expect.stringContaining("600px"));
    expect(cover).toHaveAttribute("width", "800");
    expect(cover).toHaveAttribute("height", "800");
    expect(cover).toHaveAttribute("loading", "lazy");
  });
  expect(screen.getByRole("link", { name: /Discography/ })).toHaveAttribute(
    "href",
    "#albums"
  );
  const listening = screen.getByRole("navigation", {
    name: "Listen to Eclectic Pickup",
  });
  const destinations = [
    [
      "Spotify",
      "https://open.spotify.com/artist/0HU4opVeWSZBryB0vZzxu4",
      "#1DB954",
    ],
    ["YouTube Music", "https://music.youtube.com/@EclecticPickup", "#FF0000"],
    [
      "Apple Music",
      "https://music.apple.com/us/artist/eclectic-pickup/1788079254",
      "#FA243C",
    ],
    ["Bandcamp", "https://eclecticpickup.bandcamp.com/", "#629AA9"],
  ];
  expect(within(listening).getAllByRole("link")).toHaveLength(4);
  destinations.forEach(([name, href, color]) => {
    const link = within(listening).getByRole("link", {
      name: `${name} (opens in a new tab)`,
    });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(link.querySelector("svg")).toHaveAttribute("focusable", "false");
    expect(link.querySelector("svg")).toHaveStyle({ color });
  });
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
  expect(
    within(navigation).getByRole("link", { name: /^ECLECTIC\s?PICKUP$/ })
  ).toHaveTextContent(/^ECLECTICPICKUP$/);
  expect(
    within(screen.getByRole("contentinfo")).queryByRole("link")
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText("From Fort Collins, with love.")
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Socials" })).toHaveAttribute(
    "href",
    "/#socials"
  );
});

test("keeps manually entered admin access guarded without advertising an admin link", async () => {
  window.history.replaceState({}, "", "/admin");
  render(<App />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(await screen.findByLabelText("User Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Band admin/i })
  ).not.toBeInTheDocument();
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

test("shuffles band members per visit without reordering on rerenders or mutating the lineup", async () => {
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  const memberOrder = () =>
    within(screen.getByRole("region", { name: "A sound of our own." }))
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
  const firstVisit = render(<App />);
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  expect(memberOrder()).toEqual(["Jacob", "Jester", "Rob", "Liam"]);

  random.mockReturnValue(0.9999);
  firstVisit.rerender(<App />);
  expect(memberOrder()).toEqual(["Jacob", "Jester", "Rob", "Liam"]);

  firstVisit.unmount();
  render(<App />);
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  expect(memberOrder()).toEqual(["Liam", "Jacob", "Jester", "Rob"]);
});

test("renders the official lineup, hero photos, original videos and social destinations", async () => {
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
  await screen.findByRole("tab", { name: "Upcoming shows (0)" });
  const lineup = [
    ["Liam", "Drums", "band-liam.webp"],
    ["Jacob", "Guitar, Bass, Vocals", "band-jacob.webp"],
    ["Jester", "Guitar, Bass, Vocals", "band-jester.webp"],
    ["Rob", "Guitar, Vocals", "band-rob.webp"],
  ];
  const about = screen.getByRole("region", { name: "A sound of our own." });
  expect(within(about).getAllByRole("article")).toHaveLength(4);
  lineup.forEach(([name, instruments, portrait]) => {
    const member = within(about)
      .getByRole("heading", { name })
      .closest("article");
    expect(member).toHaveTextContent(instruments);
    const image = within(about).getByRole("img", { name });
    expect(image).toHaveAttribute("src", portrait);
    expect(image).toHaveAttribute("width", "120");
    expect(image).toHaveAttribute("height", "120");
    expect(image).toHaveAttribute("loading", "lazy");
  });
  expect(screen.queryByText("Sample member")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("region", { name: "A few good moments." })
  ).not.toBeInTheDocument();
  const hero = screen.getByRole("region", { name: "Eclectic Pickup" });
  expect(
    within(hero).getByRole("img", { name: "First band photo" })
  ).toHaveAttribute("src", "/photo-one.jpg");
  expect(
    within(hero).getByRole("img", { name: "Second band photo" })
  ).toHaveAttribute("src", "/photo-two.jpg");
  const heroCarousel = within(hero).getByLabelText(
    "Eclectic Pickup band photos"
  );
  expect(heroCarousel.querySelector(".active img")).toHaveAttribute(
    "src",
    "EclecticPickup-22.jpg"
  );
  fireEvent.click(within(hero).getByRole("button", { name: "Next" }));
  await waitFor(() =>
    expect(heroCarousel.querySelector(".active img")).not.toHaveAttribute(
      "src",
      "EclecticPickup-22.jpg"
    )
  );
  fireEvent.click(within(hero).getByRole("button", { name: "Previous" }));
  await waitFor(() =>
    expect(heroCarousel.querySelector(".active img")).toHaveAttribute(
      "src",
      "EclecticPickup-22.jpg"
    )
  );
  expect(screen.getByTitle("Too Much Too Late")).toHaveAttribute(
    "loading",
    "lazy"
  );
  const liveMusic = screen.getByRole("region", { name: "Live Music" });
  expect(within(liveMusic).getByText("Videos")).toBeInTheDocument();
  expect(screen.getByTitle("Too Much Too Late")).toHaveAttribute(
    "src",
    "https://www.youtube.com/embed/RBed2sk8vsk"
  );
  fireEvent.click(
    within(liveMusic).getByRole("button", { name: "Next video" })
  );
  expect(screen.getByTitle("The Devil You Know")).toHaveAttribute(
    "src",
    "https://www.youtube.com/embed/1db_WARusxQ"
  );
  expect(screen.queryByTitle("Too Much Too Late")).not.toBeInTheDocument();
  fireEvent.click(
    within(liveMusic).getByRole("button", { name: "Next video" })
  );
  expect(screen.getByTitle("Six Reasons")).toHaveAttribute(
    "src",
    "https://www.youtube.com/embed/TCicfS5Ix04"
  );
  expect(screen.queryByText("yt")).not.toBeInTheDocument();
  expect(screen.queryByTitle("First performance")).not.toBeInTheDocument();
  const socialSection = screen.getByRole("region", {
    name: "Follow us online",
  });
  expect(within(socialSection).getByText("Social Media")).toBeInTheDocument();
  const socialDestinations = [
    ["Facebook", "https://www.facebook.com/eclecticpickup"],
    ["Instagram", "https://www.instagram.com/EclecticPickup/"],
    ["YouTube", "https://youtube.com/@eclecticpickup"],
    ["Bandcamp", "https://eclecticpickup.bandcamp.com/"],
    ["Email", "mailto:eclecticpickup@gmail.com"],
  ];
  expect(within(socialSection).getAllByRole("link")).toHaveLength(5);
  socialDestinations.forEach(([name, href]) => {
    const socialLink = within(socialSection).getByRole("link", {
      name: `${name} (opens in a new tab)`,
    });
    expect(socialLink).toHaveAttribute("href", href);
    expect(socialLink).toHaveAttribute("target", "_blank");
    expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(socialLink.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
  expect(
    within(screen.getByRole("contentinfo")).queryByRole("navigation")
  ).not.toBeInTheDocument();
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

# Eclectic Pickup frontend

The public site uses a responsive dark concert-poster theme with locally bundled
band photography, warm accents, normal-flow navigation/footer, and shared
Bootstrap styling for the existing admin workflows. Theme tokens and shared
shell styles live in `src/App.css`; public sections live in `src/HomePage.css`.
The old full-page background, fixed social footer, and borrowed layout CSS are
no longer part of the active layout.

## Homepage priorities

The hero superimposes a large centered official logo over a manually navigated
band-photo carousel. The logo fades between fully opaque and fully transparent
over a 7-second cycle, leaving the photos visible between fades. Visitors
who prefer reduced motion see a stationary logo at 35% opacity instead.
Fort Collins, Colorado and Discography/Events links remain at the bottom. It starts
with the bundled band photo and includes photos configured through Admin;
with only one photo, navigation controls and indicators are hidden. The first
hero photo loads eagerly, and subsequent photos load lazily. The links remain
visible while photos change, with no carousel autoplay or added slogans.

The introduction points to the discography first, then shows.
The sections follow that order: albums, shows, band biography/members, videos,
social media links, and the existing Mailchimp signup. Navigation
mirrors that hierarchy, including the always-available Socials section.

`src/Components/Content/Albums.tsx` lists Volume 1, Volume 2, and LIVE at Breck.
The four supplied Spotify, YouTube Music, Apple Music, and Bandcamp URLs are
shared artist pages, not album-specific links; direct album URLs are still pending.
The Discography section shows the three covers/titles and these platform links
without promotional captions. Platform links have bundled SVG icons from the
existing `react-icons` dependency, retain their platform brand colors, and occupy
equal-width columns (up to four across). Cards wrap to fewer columns as soon as
they would be narrower than 180 pixels. All platform/social links open in a new tab with `noopener noreferrer`.
The embedded preview may block new tabs through its host application's opener ACL;
that is separate from the website's standard browser link behavior.
No release dates or newest-album claims are assumed. The hero uses the supplied
official logo; the navbar remains text-based. Band photos appear only in the hero
carousel; the duplicate "A few good moments" gallery has been removed.

The homepage's Meet the Band lineup is bundled editorial content: Liam (Drums),
Jacob and Jester (Guitar, Bass, Vocals), and Rob (Guitar, Vocals), matching the
current website. Their exact portrait photos come from
`https://api.eclecticpickup.com/files/8534.png`, `8535.png`, `8536.png`, and
`8539.png`, respectively. The uncropped photos are resized to 240 pixels wide
and encoded as WebP at quality 85 in `src/media/band-*.webp`; all four total
about 47 KB. Portraits fit within 120-by-120-pixel boxes, with four members per
row on desktop and two on mobile. Public member content no longer depends on
the backend's member records; the existing Admin member management remains
available and unchanged.
Member order is randomized once per homepage mount using the existing Fisher-Yates
shuffle on a copy of the lineup, and stays stable through data updates and rerenders.
The user-supplied band biography is also bundled in `LandingPage.tsx`, rather
than reading the backend's `BAND_BIO` setting.

The supplied logo and three album covers are bundled as metadata-free WebP
derivatives in `src/media/`. Logo variants are 600/1200 pixels wide; cover variants
are 400/800 pixels square. `srcSet`/`sizes` select an appropriate image, explicit
dimensions reserve layout space, and covers load lazily. The complete artwork
and original aspect ratios are preserved without cropping; uploaded originals
are not modified. To regenerate, use `cwebp -q 85 -m 6 -metadata none -resize WIDTH 0`
for the logo and quality 84 for the covers, followed by the input PNG and
`-o OUTPUT.webp`.

## Shows

The Shows section has keyboard-accessible Upcoming shows and Past shows tabs.
Each pane displays eight shows per page, with Previous/Next controls and a range
summary. Upcoming shows are sorted soonest first; history is newest first.
Changing panes starts at page one. The table scrolls horizontally on small
screens without overflowing the page.

Show dates are calendar dates in the visitor's local timezone: today's shows
remain upcoming until the next local midnight, regardless of the displayed show
time. The split refreshes at midnight and when the page regains focus/visibility.
Pagination clamps when data shrinks, and empty panes explain what happens next.
Loading and fetch failures have separate states; failed show requests expose a
retry button instead of reporting an empty schedule.

The Videos / Live Music section centers one player at a time, with Previous/Next
and numbered selection buttons with the selected button highlighted, and no autoplay or
visible captions. Changing videos unmounts the previous player to stop playback.
The three videos are bundled in `LandingPage.tsx`, matching the original site's
public catalog: Too Much Too Late (`RBed2sk8vsk`), The Devil You Know
(`1db_WARusxQ`), and Six Reasons (`TCicfS5Ix04`).

Social Media / Follow us online bundles the original Facebook, Instagram, YouTube,
Bandcamp, and Email destinations with recognizable icons and equally sized links:
up to five columns on desktop, wrapping automatically at a 180-pixel minimum
card width (or one full-width card on narrower screens). Public videos and social links no
longer depend on local backend records; Admin management and backend data are
unchanged. The duplicate footer branding/tagline/social links are removed; a
minimal copyright remains with a single divider. There is no public Band admin
link; manually entering `/admin` still requires authentication.

Photos are manually navigated,
and newsletter signup uses the existing Mailchimp form endpoint and honeypot
without the embedded third-party stylesheet or validation script.

For a non-interactive regression run from this directory:

```sh
CI=true npm test -- --watchAll=false --runInBand
```

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

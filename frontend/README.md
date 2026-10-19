# Eclectic Pickup frontend

The public site uses a responsive dark concert-poster theme with locally bundled
band photography, warm accents, normal-flow navigation/footer, and shared
Bootstrap styling for the existing admin workflows. Theme tokens and shared
shell styles live in `src/App.css`; public sections live in `src/HomePage.css`.
The old full-page background, fixed social footer, and borrowed layout CSS are
no longer part of the active layout.

## Homepage priorities

The listening-led introduction points to the discography first, then shows.
The sections follow that order: albums, shows, band biography/photos/videos,
configured social media links, and the existing Mailchimp signup. Navigation
mirrors that hierarchy; Socials appears only when social media links are configured.

`src/Components/Content/Albums.tsx` lists Volume 1, Volume 2, and LIVE at Breck.
The four supplied Spotify, YouTube Music, Apple Music, and Bandcamp URLs are
shared artist pages, not album-specific links. Cards intentionally use typography
until approved album artwork and direct album URLs are supplied. No release dates
or newest-album claims are assumed. The official PNG logo is still pending;
the current text wordmark and existing band photo remain in place.

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

Photos are manually navigated, videos use a responsive grid without autoplay,
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

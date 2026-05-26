import { VideoDetail } from "../Types/VideoDetail";

import bg2 from "../media/EclecticPickup-2.jpg";
import bg14 from "../media/EclecticPickup-14.jpg";
import bg22 from "../media/EclecticPickup-22.jpg";
import bg30 from "../media/EclecticPickup-30.jpg";
import bg35 from "../media/EclecticPickup-35.jpg";

/** Full-page backgrounds — one is chosen at random on each page load. */
const BACKGROUND_IMAGES = [bg2, bg14, bg22, bg30, bg35] as const;

export default class VideoUtility {
  static getRandomBackground(): VideoDetail {
    const index = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    return {
      name: `band_background_${index}`,
      video: BACKGROUND_IMAGES[index],
      playbackRate: 1,
    };
  }
}

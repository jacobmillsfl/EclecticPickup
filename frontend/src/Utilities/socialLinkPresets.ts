/** Must match backend Routes/sociallinks.py _PLATFORM_PRESETS / _DEFAULT_HREF. */

export type SocialPlatformId =
  | "facebook"
  | "instagram"
  | "youtube"
  | "bandcamp"
  | "email";

export const SOCIAL_PLATFORM_OPTIONS: {
  id: SocialPlatformId;
  label: string;
}[] = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "bandcamp", label: "Bandcamp" },
  { id: "email", label: "Email" },
];

type Preset = { category: string; img_url: string; defaultHref: string };

const PRESETS: Record<SocialPlatformId, Preset> = {
  facebook: {
    category: "social_media",
    img_url: "/img/socials/facebook.png",
    defaultHref: "https://www.facebook.com/",
  },
  instagram: {
    category: "social_media",
    img_url: "/img/socials/instagram.jpg",
    defaultHref: "https://www.instagram.com/",
  },
  youtube: {
    category: "streaming",
    img_url: "/img/socials/youtube.jpg",
    defaultHref: "https://www.youtube.com/",
  },
  bandcamp: {
    category: "merch",
    img_url: "/img/socials/bandcamp.png",
    defaultHref: "https://bandcamp.com/",
  },
  email: {
    category: "email",
    img_url: "/img/socials/email.png",
    defaultHref: "mailto:",
  },
};

/** Older DB seeds may still reference these; icons only — API may migrate rows to the 5 presets. */
const LEGACY_PRESETS: Record<string, Preset> = {
  spotify: {
    category: "streaming",
    img_url: "/img/socials/spotify.png",
    defaultHref: "https://open.spotify.com/",
  },
  twitter: {
    category: "social_media",
    img_url: "/img/socials/twitter.png",
    defaultHref: "https://twitter.com/",
  },
};

const FALLBACK: Preset = PRESETS.facebook;

export function presetForPlatform(platform: string | null | undefined): Preset {
  if (!platform) {
    return FALLBACK;
  }
  if (platform in PRESETS) {
    return PRESETS[platform as SocialPlatformId];
  }
  return LEGACY_PRESETS[platform] ?? FALLBACK;
}

export function isSelectablePlatform(id: string): id is SocialPlatformId {
  return SOCIAL_PLATFORM_OPTIONS.some((o) => o.id === id);
}

/** Sort order for admin table (legacy platforms not listed sort last). */
export const SOCIAL_PLATFORM_SORT_ORDER: string[] = [
  "facebook",
  "instagram",
  "youtube",
  "bandcamp",
  "email",
  "spotify",
  "twitter",
];

import type { AllSocialLinks } from "../../Components/Content/Socials";
import type { SocialListing } from "../../Components/Content/SocialList";
import type { BandMember } from "../../Components/Content/BandMemberList";
import type { BandVideo } from "../../Components/Content/VideoCarousel";

export type ApiBandMemberRow = {
  id: number;
  name: string;
  img_url: string;
  text: string;
};

/**
 * Band member photos may be uploaded to the API (`files/<name>`), legacy CRA static assets
 * (`img/...`), or absolute URLs.
 */
export function resolveBandMemberImageUrl(
  img_url: string | undefined,
  apiUrl: string,
  publicUrl: string | undefined
): string {
  const raw = img_url ?? "";
  if (!raw) {
    return "";
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  const base = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  const s = raw.replace(/^\/+/, "");
  if (s.startsWith("files/")) {
    return `${base}/${s}`;
  }
  if (!s.includes("/")) {
    return `${base}/files/${s}`;
  }
  return resolvePublicAssetUrl(raw.startsWith("/") ? raw : `/${raw}`, publicUrl);
}

export type ApiSocialLinkRow = {
  href_url: string;
  img_url: string;
  text: string;
  category?: string | null;
  /** When false, link is hidden on the public site. */
  enabled?: boolean;
};

export type ApiBandVideoRow = {
  src: string;
  description: string;
  youtube: boolean;
};

/**
 * Extract YouTube video id from watch, youtu.be, shorts, embed, or bare id strings.
 */
export function extractYouTubeVideoId(url: string): string | null {
  const s = url.trim();
  if (!s) {
    return null;
  }
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? decodeURIComponent(id) : null;
    }
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) {
        return v;
      }
      const pathMatch = u.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?]+)/);
      if (pathMatch) {
        return pathMatch[1];
      }
    }
  } catch {
    /* not a valid absolute URL */
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) {
    return s;
  }
  return null;
}

/**
 * Iframes must use /embed/VIDEO_ID. Watch URLs (youtube.com/watch?v=…) block embedding (X-Frame-Options),
 * which is often mistaken for a CORS error in DevTools.
 */
export function toYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeVideoId(url);
  if (id) {
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  }
  return url.trim();
}

/** Resolve image/link URLs: absolute http(s) unchanged; otherwise prefix with CRA PUBLIC_URL. */
export function resolvePublicAssetUrl(
  url: string,
  publicUrl: string | undefined
): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = publicUrl ?? "";
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}

export function mapApiBandMemberToUi(
  row: ApiBandMemberRow,
  apiUrl: string,
  publicUrl: string | undefined
): BandMember {
  return {
    name: row.name,
    imgUrl: resolveBandMemberImageUrl(row.img_url, apiUrl, publicUrl),
    text: row.text,
  };
}

export function groupSocialLinksByCategory(
  rows: ApiSocialLinkRow[],
  resolveImg: (u: string) => string
): AllSocialLinks {
  const out: AllSocialLinks = {
    streaming: [],
    socialMedia: [],
    merch: [],
    email: [],
  };

  for (const row of rows) {
    if (row.enabled === false) {
      continue;
    }
    const listing: SocialListing = {
      hrefUrl: row.href_url,
      imgUrl: resolveImg(row.img_url),
      text: row.text,
    };
    const c = row.category ?? "social_media";
    if (c === "streaming") out.streaming.push(listing);
    else if (c === "merch") out.merch.push(listing);
    else if (c === "email") out.email.push(listing);
    else out.socialMedia.push(listing);
  }
  return out;
}

export function mapApiBandVideoToCarousel(
  v: ApiBandVideoRow,
  apiUrl: string
): BandVideo {
  const src = v.youtube
    ? toYouTubeEmbedUrl(v.src)
    : `${apiUrl}/bandvideos/${v.src}`;
  return {
    src,
    alt: v.description ?? "",
    youtube: Boolean(v.youtube),
  };
}

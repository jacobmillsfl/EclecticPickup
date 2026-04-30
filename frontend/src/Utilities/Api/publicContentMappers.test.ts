import {
  extractYouTubeVideoId,
  groupSocialLinksByCategory,
  mapApiBandMemberToUi,
  mapApiBandVideoToCarousel,
  resolveBandMemberImageUrl,
  resolvePublicAssetUrl,
  toYouTubeEmbedUrl,
} from "./publicContentMappers";

describe("resolvePublicAssetUrl", () => {
  it("leaves absolute http(s) URLs unchanged", () => {
    expect(resolvePublicAssetUrl("https://x.com/a.png", "")).toBe("https://x.com/a.png");
    expect(resolvePublicAssetUrl("http://x.com/a.png", "/app")).toBe("http://x.com/a.png");
  });

  it("prefixes relative paths with PUBLIC_URL", () => {
    expect(resolvePublicAssetUrl("/img/x.png", "")).toBe("/img/x.png");
    expect(resolvePublicAssetUrl("/img/x.png", "/app")).toBe("/app/img/x.png");
    expect(resolvePublicAssetUrl("img/x.png", "/app")).toBe("/app/img/x.png");
  });
});

describe("resolveBandMemberImageUrl / mapApiBandMemberToUi", () => {
  it("maps legacy static path via PUBLIC_URL", () => {
    expect(
      mapApiBandMemberToUi(
        {
          id: 1,
          name: "A",
          img_url: "img/a.jpg",
          text: "Guitar",
        },
        "http://api:8081",
        "/app"
      )
    ).toEqual({
      name: "A",
      imgUrl: "/app/img/a.jpg",
      text: "Guitar",
    });
  });

  it("resolves uploaded basename to API /files/ URL", () => {
    expect(
      resolveBandMemberImageUrl("headshot.jpg", "http://api:8081", "")
    ).toBe("http://api:8081/files/headshot.jpg");
  });
});

describe("groupSocialLinksByCategory", () => {
  it("buckets links by category", () => {
    const out = groupSocialLinksByCategory(
      [
        {
          href_url: "https://a.com",
          img_url: "/i.png",
          text: "A",
          category: "streaming",
          enabled: true,
        },
        {
          href_url: "https://b.com",
          img_url: "/j.png",
          text: "B",
          category: "social_media",
          enabled: true,
        },
        {
          href_url: "m:",
          img_url: "/k.png",
          text: "E",
          category: "email",
          enabled: true,
        },
      ],
      (u) => u
    );
    expect(out.streaming).toHaveLength(1);
    expect(out.streaming[0].hrefUrl).toBe("https://a.com");
    expect(out.socialMedia).toHaveLength(1);
    expect(out.email).toHaveLength(1);
    expect(out.merch).toHaveLength(0);
  });

  it("omits disabled links from the public groupings", () => {
    const out = groupSocialLinksByCategory(
      [
        {
          href_url: "https://a.com",
          img_url: "/i.png",
          text: "A",
          category: "streaming",
          enabled: false,
        },
      ],
      (u) => u
    );
    expect(out.streaming).toHaveLength(0);
  });
});

describe("toYouTubeEmbedUrl / extractYouTubeVideoId", () => {
  it("converts watch and share URLs to /embed/", () => {
    expect(
      toYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(toYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
    expect(extractYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });
});

describe("mapApiBandVideoToCarousel", () => {
  it("uses /embed/ URL for YouTube (iframes cannot use /watch)", () => {
    const v = mapApiBandVideoToCarousel(
      { src: "https://youtu.be/abcdefghijk", description: "Clip", youtube: true },
      "http://api:8081"
    );
    expect(v.src).toBe("https://www.youtube.com/embed/abcdefghijk");
    expect(v.alt).toBe("Clip");
    expect(v.youtube).toBe(true);
  });

  it("prefixes API path for uploaded videos", () => {
    const v = mapApiBandVideoToCarousel(
      { src: "file.mp4", description: "Local", youtube: false },
      "http://api:8081"
    );
    expect(v.src).toBe("http://api:8081/bandvideos/file.mp4");
  });
});

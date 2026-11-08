import { describe, expect, it } from "vitest";
import { resolveDemoSource } from "./demoMedia";

const VIDEO_ID = "AbCdEf12_-3";
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`;

describe("resolveDemoSource", () => {
  it.each([
    `/videos/demo.mp4`,
    `videos/demo.webm`,
    `./videos/demo clip.mp4`,
    `../videos/demo.mp4`,
    `/videos/demo.mp4?version=2#t=10`,
  ])("accepts a native site media path: %s", src => {
    expect(resolveDemoSource("file", `  ${src}  `)).toEqual({
      type: "file",
      src,
    });
  });

  it.each(["https", "http"])("accepts %s native video URLs", protocol => {
    const src = `${protocol}://media.example.test/demo.mp4?version=2`;
    expect(resolveDemoSource("file", src)).toEqual({ type: "file", src });
  });

  it.each([
    undefined,
    "",
    "   ",
    "/",
    "./",
    "../",
    "#preview",
    "?video=demo.mp4",
    "//media.example.test/demo.mp4",
    "C:\\videos\\demo.mp4",
    "javascript:alert(1)",
    "data:video/mp4;base64,AAAA",
    "file:///videos/demo.mp4",
    "ftp://media.example.test/demo.mp4",
    "https://",
    "https:media.example.test/demo.mp4",
    "https://name:password@media.example.test/demo.mp4",
    "/videos/de\nmo.mp4",
  ])("rejects empty or unsupported native sources: %s", src => {
    expect(resolveDemoSource("file", src)).toBeNull();
  });

  it.each([
    `https://www.youtube.com/watch?v=${VIDEO_ID}`,
    `https://youtube.com/watch?v=${VIDEO_ID}&feature=shared`,
    `https://m.youtube.com/watch?v=${VIDEO_ID}`,
    `http://youtube.com/watch?v=${VIDEO_ID}`,
    `https://youtu.be/${VIDEO_ID}?si=share-token`,
    `https://www.youtu.be/${VIDEO_ID}/`,
    `https://www.youtube.com/embed/${VIDEO_ID}`,
    `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`,
    `https://youtube.com/shorts/${VIDEO_ID}?feature=share`,
  ])("normalizes supported YouTube URLs: %s", src => {
    expect(resolveDemoSource("youtube", `  ${src}  `)).toEqual({
      type: "youtube",
      src: EMBED_URL,
    });
  });

  it("drops autoplay, playlist, timestamps, and fragments from YouTube input", () => {
    const resolved = resolveDemoSource(
      "youtube",
      `https://youtube.com/watch?v=${VIDEO_ID}&autoplay=1&list=playlist&start=15#t=30`
    );
    expect(resolved?.src).toBe(EMBED_URL);
    expect(new URL(resolved!.src).search).toBe("");
    expect(new URL(resolved!.src).hash).toBe("");
  });

  it.each([
    undefined,
    "",
    VIDEO_ID,
    `https://example.test/embed/${VIDEO_ID}`,
    `https://youtube.com.example.test/watch?v=${VIDEO_ID}`,
    `https://youtube.com@other.example.test/watch?v=${VIDEO_ID}`,
    `https://name:password@youtube.com/watch?v=${VIDEO_ID}`,
    `https://youtu.be/${VIDEO_ID}/another-video`,
    `https://www.youtube.com/playlist?list=${VIDEO_ID}`,
    `https://www.youtube.com/watch`,
    `https://www.youtube.com/watch?v=too-short`,
    `https://www.youtube.com/embed/${VIDEO_ID}extra`,
    `https://www.youtube.com/shorts/not-video`,
    `javascript:alert(1)`,
    `//youtube.com/watch?v=${VIDEO_ID}`,
    `https://you\ntube.com/watch?v=${VIDEO_ID}`,
  ])("rejects malformed or non-YouTube iframe sources: %s", src => {
    expect(resolveDemoSource("youtube", src)).toBeNull();
  });
});

export type DemoVideoSource = {
  type: "file" | "youtube";
  src: string;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const URL_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;

function parseHttpUrl(value: string): URL | null {
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

/** Resolve configured media without fetching it or carrying player parameters. */
export function resolveDemoSource(
  type: "file" | "youtube",
  src?: string
): DemoVideoSource | null {
  const value = src?.trim();
  if (!value || /[\u0000-\u001f\u007f]/.test(value)) return null;

  if (type === "file") {
    if (URL_SCHEME.test(value)) {
      const url = parseHttpUrl(value);
      return url ? { type, src: url.href } : null;
    }

    // Relative and root-relative site assets are supported, not OS paths,
    // protocol-relative hosts, fragments, or query strings without a file path.
    if (
      value.startsWith("//") ||
      value.includes("\\") ||
      value.startsWith("#") ||
      value.startsWith("?") ||
      !value
        .split(/[?#]/, 1)[0]
        .split("/")
        .some(part => part && part !== "." && part !== "..")
    ) {
      return null;
    }
    return { type, src: value };
  }

  if (type !== "youtube") return null;
  const url = parseHttpUrl(value);
  if (!url) return null;

  let id: string | null = null;
  if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
    id = /^\/([A-Za-z0-9_-]{11})\/?$/.exec(url.pathname)?.[1] ?? null;
  } else if (YOUTUBE_HOSTS.has(url.hostname)) {
    if (
      /^\/watch\/?$/.test(url.pathname) &&
      !url.hostname.endsWith("youtube-nocookie.com")
    ) {
      id = url.searchParams.get("v");
    } else {
      id =
        /^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})\/?$/.exec(
          url.pathname
        )?.[1] ?? null;
    }
  }

  if (!id || !VIDEO_ID.test(id)) return null;
  return {
    type: "youtube",
    src: `https://www.youtube-nocookie.com/embed/${id}`,
  };
}

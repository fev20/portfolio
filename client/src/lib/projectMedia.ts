/** Project assets live under the Vite public root regardless of deployment base. */
export function projectAssetUrl(src: string): string {
  const value = src.trim();
  if (!value || /[\\\u0000-\u001f\u007f]/.test(value)) return "";
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.username || url.password ? "" : url.href;
    } catch {
      return "";
    }
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith("//")) return "";
  const relative = value.replace(/^\/?(?:\.\/)?/, "");
  const pathname = relative.split(/[?#]/, 1)[0];
  if (!pathname) return "";
  try {
    const decoded = decodeURIComponent(pathname);
    if (decoded.startsWith("/") || /(^|\/)\.\.?(\/|$)|\\/.test(decoded)) {
      return "";
    }
  } catch {
    return "";
  }
  return `${import.meta.env.BASE_URL}${relative}`;
}

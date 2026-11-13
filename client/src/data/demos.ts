/** One video on a demo project's detail page. */
export interface DemoClip {
  id: string;
  title: string;
  sourceType: "file" | "youtube";
  src?: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
}

/** One list card and its detail page. See docs/demos.md for data entry. */
export interface Demo {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  mainVideo?: DemoClip;
  steps?: DemoClip[];
  recordedAt?: string;
  role?: string;
  projectId?: string;
}

// Add real project records here when their materials are available.
export const demos: Demo[] = [];

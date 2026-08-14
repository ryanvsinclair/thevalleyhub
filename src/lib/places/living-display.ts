/**
 * Living list / index field visibility.
 * Flip a flag to false to hide that field site-wide even when data exists.
 * When a flag is true, the UI still omits null / empty / false-empty values.
 */
export const LIVING_LIST_DISPLAY = {
  /** Primary place photo thumb from media_links */
  thumb: true,
  /** places.category label */
  category: true,
  /** “In community” when places.in_community */
  inCommunity: true,
  /** Open-now chip when hours say open (Dubai time) */
  openNow: true,
  /** Drive minutes only when drive_verified and drive_minutes set */
  driveMinutes: true,
  /** VerifiedBadge when verified_at set */
  verified: true,
  /** places.summary */
  summary: true,
} as const;

export const LIVING_INDEX_DISPLAY = {
  /** Category blurb under the title */
  blurb: true,
  /** “N places” count */
  placeCount: true,
  /** “N open now” when > 0 */
  openNowCount: true,
} as const;

export type LivingListDisplayKey = keyof typeof LIVING_LIST_DISPLAY;
export type LivingIndexDisplayKey = keyof typeof LIVING_INDEX_DISPLAY;

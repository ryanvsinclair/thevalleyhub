import Image from "next/image";
import Link from "next/link";

import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import { LIVING_LIST_DISPLAY } from "@/lib/places/living-display";
import { isOpenNow } from "@/lib/places/open-now";
import {
  mediaPublicUrl,
  type LinkedMedia,
} from "@/lib/queries/clusters";
import type { Place } from "@/lib/queries/places";

type Props = {
  place: Place;
  thumb: LinkedMedia | null;
};

/**
 * One Living category list row. Each optional field renders only when
 * LIVING_LIST_DISPLAY enables it and the underlying value is present.
 */
export function LivingPlaceRow({ place, thumb }: Props) {
  const showThumb = LIVING_LIST_DISPLAY.thumb && thumb != null;
  const showCategory =
    LIVING_LIST_DISPLAY.category && Boolean(place.category);
  const showInCommunity =
    LIVING_LIST_DISPLAY.inCommunity && place.in_community === true;
  const showOpenNow =
    LIVING_LIST_DISPLAY.openNow && isOpenNow(place.hours);
  const showDrive =
    LIVING_LIST_DISPLAY.driveMinutes &&
    place.drive_verified === true &&
    place.drive_minutes != null;
  const showVerified =
    LIVING_LIST_DISPLAY.verified && place.verified_at != null;
  const showSummary =
    LIVING_LIST_DISPLAY.summary &&
    place.summary != null &&
    place.summary.trim() !== "";

  const metaBits = [
    showCategory,
    showInCommunity,
    showOpenNow,
    showDrive,
    showVerified,
  ].some(Boolean);

  return (
    <li className="flex gap-4 py-4">
      {showThumb && thumb ? (
        <Link
          href={`/places/${place.slug}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden bg-neutral-100"
        >
          <Image
            src={mediaPublicUrl(thumb.storage_path)}
            alt={thumb.alt ?? place.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <Link
          href={`/places/${place.slug}`}
          className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          {place.name}
        </Link>
        {metaBits ? (
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            {showCategory ? (
              <span className="capitalize">{place.category}</span>
            ) : null}
            {showInCommunity ? <span>In community</span> : null}
            {showOpenNow ? (
              <span className="text-xs font-medium tracking-wide text-emerald-800 uppercase">
                Open now
              </span>
            ) : null}
            {showDrive ? (
              <span>~{place.drive_minutes} min drive</span>
            ) : null}
            {showVerified ? (
              <VerifiedBadge verifiedAt={place.verified_at} />
            ) : null}
          </div>
        ) : null}
        {showSummary ? (
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            {place.summary}
          </p>
        ) : null}
      </div>
    </li>
  );
}

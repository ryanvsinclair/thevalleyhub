import Link from "next/link";

import { listPlacesOpenNow } from "@/lib/queries/places";

export async function WhatsOpenNow() {
  const open = await listPlacesOpenNow();

  return (
    <section className="border-t border-neutral-200 py-10">
      <h2 className="text-lg font-semibold tracking-tight">What&apos;s open now</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Based on published hours, Dubai time. Not a live check-in.
      </p>
      {open.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Nothing with published hours is open right now, or hours are unknown.
        </p>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {open.map((place) => (
            <li key={place.id}>
              <Link
                href={`/places/${place.slug}`}
                className="text-sm text-neutral-900 underline-offset-4 hover:underline"
              >
                {place.name}
              </Link>
              <span className="ml-2 text-xs text-neutral-500">{place.category}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

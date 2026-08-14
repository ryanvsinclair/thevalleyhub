"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";

import {
  getGooglePlaceDetailsAction,
  searchGooglePlacesAction,
} from "@/lib/admin/google-places-actions";
import type { GooglePlaceSuggestion } from "@/lib/google/places";

type Props = {
  /** Valley-wide only — when false, render nothing. */
  enabled: boolean;
};

function setNamedInput(form: HTMLFormElement, name: string, value: string) {
  const el = form.querySelector(`[name="${CSS.escape(name)}"]`);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

export function GooglePlaceAutocomplete({ enabled }: Props) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GooglePlaceSuggestion[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await searchGooglePlacesAction(query);
        if ("error" in result) {
          setError(result.error);
          setSuggestions([]);
          return;
        }
        setError(null);
        setSuggestions(result.suggestions);
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, enabled]);

  if (!enabled) return null;

  function applySuggestion(suggestion: GooglePlaceSuggestion) {
    const form = wrapRef.current?.closest("form");
    if (!form) {
      setError("Could not find the place form to fill.");
      return;
    }

    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await getGooglePlaceDetailsAction(suggestion.placeId);
      if ("error" in result) {
        setError(result.error);
        return;
      }

      const { fill } = result;
      setNamedInput(form, "google_place_id", fill.google_place_id);
      if (fill.address) setNamedInput(form, "address", fill.address);
      if (fill.lat != null) setNamedInput(form, "lat", String(fill.lat));
      if (fill.lng != null) setNamedInput(form, "lng", String(fill.lng));
      if (fill.phone) setNamedInput(form, "phone", fill.phone);
      if (fill.website) setNamedInput(form, "website", fill.website);
      if (fill.hoursJson) setNamedInput(form, "hours", fill.hoursJson);

      setSuggestions([]);
      setQuery(suggestion.description);
      setMessage(
        "Fields filled from Google — review confidence/source, then Save.",
      );
    });
  }

  return (
    <div ref={wrapRef} className="space-y-2 rounded border border-neutral-200 p-3">
      <label className="block text-sm font-medium text-neutral-800" htmlFor={listId}>
        Google Places lookup
      </label>
      <p className="text-xs text-neutral-500">
        Valley-wide places only. Search, pick a listing, review proposed fields,
        then Save. Does not publish by itself.
      </p>
      <input
        id={listId}
        type="search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Monoprix The Valley Dubai"
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
      />
      {pending ? (
        <p className="text-xs text-neutral-500">Looking up…</p>
      ) : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      {message ? <p className="text-xs text-green-800">{message}</p> : null}
      {suggestions.length > 0 ? (
        <ul className="max-h-48 overflow-auto rounded border border-neutral-200 bg-white text-sm">
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-neutral-50"
                onClick={() => applySuggestion(s)}
              >
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

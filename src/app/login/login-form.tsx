"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { requestMagicLink, type LoginState } from "./actions";

const initial: LoginState = {};

export function LoginForm({ urlError }: { urlError?: string }) {
  const [state, action, pending] = useActionState(requestMagicLink, initial);

  if (state.sent) {
    return (
      <p className="rounded-sm border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
        Check your email for the sign-in link.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {(urlError || state.error) && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {urlError ?? state.error}
        </p>
      )}
      <label className="block text-sm">
        <span className="text-neutral-700">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
        />
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send magic link"}
      </Button>
    </form>
  );
}

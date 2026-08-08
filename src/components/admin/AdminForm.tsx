"use client";

import { useActionState } from "react";

import { ActionMessage } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/admin/form";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
};

const initial: ActionState = {};

export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className={className ?? "mt-6 max-w-2xl space-y-4"}>
      <ActionMessage error={state.error} success={state.success} />
      {children}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

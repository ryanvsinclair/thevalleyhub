import type { ZodType } from "zod";

export type ActionState = {
  error?: string;
  success?: string;
};

export function formValues(formData: FormData): Record<string, FormDataEntryValue> {
  const out: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$") || key === "id") continue;
    out[key] = value;
  }
  return out;
}

export function parseForm<T>(
  schema: ZodType<T>,
  formData: FormData,
): { data: T } | { error: string } {
  const raw = formValues(formData);
  const result = schema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const path = first?.path?.length ? `${first.path.join(".")}: ` : "";
    return { error: `${path}${first?.message ?? "Invalid form data"}` };
  }
  return { data: result.data };
}

export function boolSelect(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  return value ? "true" : "false";
}

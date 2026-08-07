import type { Database } from "@/types/database";

type Confidence = Database["public"]["Enums"]["confidence_level"];

type Props = {
  confidence: Confidence | null | undefined;
  children: React.ReactNode;
  /** Shown when the value is unverified and must stay hidden. */
  fallback?: React.ReactNode;
};

/**
 * Hides unverified raw field values at render.
 * Approved copy may still render outside this gate (Doc 1 confidence/state rule).
 */
export function ConfidenceGate({
  confidence,
  children,
  fallback = null,
}: Props) {
  if (confidence === "unverified") {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

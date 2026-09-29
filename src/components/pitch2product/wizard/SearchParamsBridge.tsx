"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reading useSearchParams() forces Next.js to treat this subtree as dynamic, which on a
 * statically-generated page means only whatever is wrapped in this component's own Suspense
 * boundary is deferred — not the rest of the wizard. Keeping this component tiny and visually
 * empty (it renders null) means there is nothing here to swap in after hydration, so it can't
 * contribute to layout shift the way wrapping the whole (much taller) wizard in Suspense did.
 */
export default function SearchParamsBridge({ onType }: { onType: (type: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) onType(type);
  }, [searchParams, onType]);

  return null;
}

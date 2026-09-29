export type P2PEvent =
  | "page_view"
  | "cta_click"
  | "form_started"
  | "step_1_completed"
  | "step_2_completed"
  | "step_3_completed"
  | "step_4_completed"
  | "file_uploaded"
  | "form_submitted";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function track(event: P2PEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer?.push({ event: `p2p_${event}`, ...props });
}

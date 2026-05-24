import { useEffect } from "react";

/**
 * In-memory anchor target set by GlobalSearch (and any other component that wants
 * to deep-link to a specific entity on a page). We can't use sessionStorage in
 * the sandboxed iframe, and wouter's useHashLocation treats `?` and a second
 * `#` as part of the path, so we pass the id through a window-level variable.
 *
 * Format: { page: "/characters", id: "yoda" }
 */
export interface PendingAnchor {
  page: string;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const W = window as any;

export function setPendingAnchor(anchor: PendingAnchor) {
  W.__holocronAnchor = anchor;
  // fire a custom event so any mounted page can react immediately
  window.dispatchEvent(new CustomEvent("holocron:anchor", { detail: anchor }));
}

function consumeAnchorFor(page: string): string | null {
  const a: PendingAnchor | undefined = W.__holocronAnchor;
  if (!a) return null;
  if (a.page !== page) return null;
  W.__holocronAnchor = undefined;
  return a.id;
}

/**
 * On a drawer page, listen for an incoming anchor and call `onAnchor(id)` with it.
 * Reads any pending anchor at mount-time (for cases where the GlobalSearch fired
 * the event before this page mounted), and also subscribes to future events.
 *
 * @param page    The wouter route the calling page renders at (e.g. "/characters").
 * @param onAnchor Callback invoked with the resolved id.
 * @param validator Optional id validator — unknown ids are ignored.
 */
export function useHashAnchor(
  page: string,
  onAnchor: (id: string) => void,
  validator?: (id: string) => boolean,
) {
  useEffect(() => {
    function apply(id: string) {
      if (!id) return;
      if (validator && !validator(id)) return;
      onAnchor(id);
    }

    // Drain any anchor that was queued before this page mounted.
    const pending = consumeAnchorFor(page);
    if (pending) apply(pending);

    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as PendingAnchor | undefined;
      if (!detail) return;
      if (detail.page !== page) return;
      // Mark consumed so a remount doesn't re-fire it.
      if (W.__holocronAnchor && W.__holocronAnchor.page === page) {
        W.__holocronAnchor = undefined;
      }
      apply(detail.id);
    }
    window.addEventListener("holocron:anchor", handler);
    return () => window.removeEventListener("holocron:anchor", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
}

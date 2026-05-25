import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Renders drawer content directly in document.body via a portal so it escapes
 * any ancestor stacking context (the Layout wraps page content in z-10 which
 * would otherwise put drawers below the z-30 mobile header).
 *
 * Also locks body scroll while the drawer is mounted so the page behind
 * doesn't scroll through touch events.
 */
export function DrawerPortal({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(children, document.body);
}

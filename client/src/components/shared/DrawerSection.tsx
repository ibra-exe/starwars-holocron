import { ReactNode } from "react";
import SmartText from "./SmartText";

/**
 * Standard drawer body section: an eyebrow label + a prose paragraph.
 * If `children` is a plain string we auto-wrap it in <SmartText> so every
 * entity mention becomes a clickable cross-page link. If you pass JSX,
 * it's rendered as-is (assume you've handled linking yourself).
 *
 * Pass `excludeId` to suppress self-references on the current entity page.
 */
export default function DrawerSection({
  title,
  children,
  excludeId,
  maxLinks,
}: {
  title: string;
  children: ReactNode;
  excludeId?: string;
  maxLinks?: number;
}) {
  return (
    <div className="mt-6">
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">{title}</div>
      <p className="text-sm leading-relaxed text-foreground/85">
        {typeof children === "string" ? (
          <SmartText text={children} excludeId={excludeId} maxLinks={maxLinks} />
        ) : (
          children
        )}
      </p>
    </div>
  );
}

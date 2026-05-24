import { ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSettings } from "@/lib/settings";

interface SpoilerVeilProps {
  /** Unique key for this veil. Once revealed, persists in settings.revealedIds. */
  id: string;
  /** Optional label that appears on the veil button. */
  label?: string;
  /** Force the veil off (e.g. inside an unrelated entity). */
  disabled?: boolean;
  children: ReactNode;
  /** Inline = single-line text masked with a blur strip; default = block with overlay. */
  inline?: boolean;
}

/**
 * Wraps spoiler-sensitive content. When the global veil is on AND this id has
 * not been revealed by the user, the children are blurred behind a click-to-
 * reveal overlay. Each reveal persists per-id so users don't get re-prompted.
 */
export default function SpoilerVeil({
  id,
  label,
  disabled,
  children,
  inline,
}: SpoilerVeilProps) {
  const { spoilerVeil, isRevealed, reveal } = useSettings();
  const [hovering, setHovering] = useState(false);

  const veilOn = spoilerVeil && !disabled && !isRevealed(id);

  if (!veilOn) {
    return inline ? <span className="inline">{children}</span> : <>{children}</>;
  }

  const Tag = inline ? "span" : "div";

  return (
    <Tag
      className={`spoiler-veil ${inline ? "spoiler-veil-inline" : "spoiler-veil-block"}`}
      data-spoiler-id={id}
      data-testid={`spoiler-${id}`}
    >
      <Tag
        className="spoiler-veil-content"
        aria-hidden={!hovering}
        style={{
          filter: "blur(8px) saturate(0.4)",
          opacity: 0.55,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {children}
      </Tag>
      <button
        type="button"
        className="spoiler-veil-reveal"
        onClick={(e) => {
          e.stopPropagation();
          reveal(id);
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        data-testid={`spoiler-reveal-${id}`}
      >
        {spoilerVeil ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        <span>{label || "Spoiler — click to reveal"}</span>
      </button>
    </Tag>
  );
}

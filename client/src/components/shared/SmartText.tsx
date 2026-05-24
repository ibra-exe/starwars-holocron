import { Fragment, ReactNode, useMemo } from "react";
import { tokenize, EntityRef } from "@/lib/entityIndex";
import { useSettings } from "@/lib/settings";
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { useLocation } from "wouter";

interface SmartTextProps {
  text?: string | null;
  /** Skip linking to this id (typically the entity being displayed). */
  excludeId?: string;
  /** Force-disable auto-linking even when the global setting is on. */
  disabled?: boolean;
  /** Max distinct entities to link inside this run of text. Default 8. */
  maxLinks?: number;
  /** Children supersede `text` if both provided — children become the source string. */
  children?: ReactNode;
  className?: string;
}

/**
 * Renders prose with every recognized entity (character, planet, ship, etc.)
 * turned into a clickable link that deep-links to its profile.
 *
 * Respects the global `autoLink` setting. When disabled, returns the text
 * unmodified so the surrounding layout is identical.
 */
export default function SmartText({
  text,
  excludeId,
  disabled,
  maxLinks = 8,
  children,
  className,
}: SmartTextProps) {
  const { autoLink, smartTooltip } = useSettings();
  const [, setLocation] = useLocation();

  // Allow callers to pass children for ergonomic JSX usage; we coerce to string.
  const source = (typeof children === "string" ? children : text) ?? "";

  const tokens = useMemo(() => {
    if (!autoLink || disabled || !source) return [{ type: "text" as const, text: source }];
    return tokenize(source, { excludeId, maxLinks });
  }, [source, autoLink, disabled, excludeId, maxLinks]);

  if (!autoLink || disabled) {
    return <span className={className}>{source}</span>;
  }

  return (
    <span className={className}>
      {tokens.map((t, i) => {
        if (t.type === "text") return <Fragment key={i}>{t.text}</Fragment>;
        const ref = t.ref as EntityRef;
        const onClick = () => {
          setPendingAnchor({ page: ref.page, id: ref.id });
          // wouter's useHashLocation hook lives at the App router level — use
          // the bracket form because we're mounted under a hash router.
          setLocation(ref.page);
        };
        return (
          <button
            key={i}
            type="button"
            onClick={onClick}
            title={smartTooltip ? `${ref.subtitle ?? ref.name} — open profile` : undefined}
            className="entity-link"
            data-entity-kind={ref.kind}
            data-entity-id={ref.id}
            data-testid={`entity-link-${ref.kind}-${ref.id}`}
            style={{
              ["--entity-accent" as any]: ref.accentVar,
            }}
          >
            {t.text}
          </button>
        );
      })}
    </span>
  );
}

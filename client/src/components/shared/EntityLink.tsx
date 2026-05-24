import { ReactNode } from "react";
import { useLocation } from "wouter";
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { findEntityById, findEntityByName, EntityKind, EntityRef } from "@/lib/entityIndex";

interface EntityLinkProps {
  /** Either pass an explicit id + kind for direct lookup, or a name for fuzzy resolution. */
  id?: string;
  kind?: EntityKind;
  name?: string;
  /** Visible label (defaults to the resolved entity's name, or the name prop). */
  children?: ReactNode;
  className?: string;
  /** Render as a span (text-only) if the entity can't be resolved. */
  fallbackPlain?: boolean;
}

/**
 * Explicit, type-safe deep-link to any entity profile in the Holocron.
 * Use for known cross-references — e.g. faction leadership rows, family lists,
 * pilot rosters — where SmartText regex matching isn't a fit.
 */
export default function EntityLink({
  id,
  kind,
  name,
  children,
  className,
  fallbackPlain = true,
}: EntityLinkProps) {
  const [, setLocation] = useLocation();
  let ref: EntityRef | undefined;
  if (id) ref = findEntityById(id, kind);
  if (!ref && name) ref = findEntityByName(name);

  const label = children ?? ref?.name ?? name ?? id ?? "";

  if (!ref) {
    if (fallbackPlain) return <span className={className}>{label}</span>;
    return null;
  }

  return (
    <button
      type="button"
      className={`entity-link ${className ?? ""}`.trim()}
      data-entity-kind={ref.kind}
      data-entity-id={ref.id}
      data-testid={`entity-link-${ref.kind}-${ref.id}`}
      style={{ ["--entity-accent" as any]: ref.accentVar }}
      title={`${ref.subtitle ?? ref.name} — open profile`}
      onClick={(e) => {
        e.stopPropagation();
        setPendingAnchor({ page: ref!.page, id: ref!.id });
        setLocation(ref!.page);
      }}
    >
      {label}
    </button>
  );
}

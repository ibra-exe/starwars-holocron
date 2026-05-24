import React, { useState } from "react";

interface VisualPlateProps {
  // Visual content
  imageUrl?: string;          // real photo — renders inside the gold ring when provided
  initials?: string;          // up to 2-3 chars
  symbol?: string;            // emoji / single glyph (preferred over initials when present)
  color: string;              // primary accent color for this entity (hex or css color string)
  // Meta strip
  eyebrow?: string;           // small uppercase label (e.g. "Humanoid", "Religious Order", "Jedi")
  title?: string;             // optional secondary label (e.g. species/faction shortName)
  // Decorative
  variant?: "circle" | "shield" | "hex";
  glow?: boolean;
  size?: "md" | "lg";
  children?: React.ReactNode; // extra slot below the plate for badges/stats
  className?: string;
}

/**
 * Premium holocron-style visual plate for drawer headers.
 * Used when a real photo isn't available — generates a stylized
 * sigil with the entity's color as a radial gradient and bold initials/symbol.
 */
export function VisualPlate({
  imageUrl,
  initials,
  symbol,
  color,
  eyebrow,
  title,
  variant = "circle",
  glow = true,
  size = "lg",
  children,
  className = "",
}: VisualPlateProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!imageUrl && !imgError;

  const dim = size === "lg" ? 220 : 160;
  const fontSize = size === "lg" ? (symbol ? "5.5rem" : initials && initials.length >= 3 ? "2.5rem" : "3.5rem") : (symbol ? "4rem" : "2.5rem");

  const gradient = `radial-gradient(circle at 35% 30%, ${color}cc 0%, ${color}55 28%, ${color}22 55%, hsl(var(--background)) 90%)`;
  const borderRadius = variant === "hex" ? "11%" : "50%";

  return (
    <div className={`flex flex-col items-center ${className}`} data-testid="visual-plate">
      <div
        className="relative"
        style={{ width: dim, height: dim }}
        aria-hidden
      >
        {/* Outer gold ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 220deg, hsl(var(--gold) / 0.05), hsl(var(--gold) / 0.85) 25%, hsl(var(--gold-bright) / 0.6) 50%, hsl(var(--gold) / 0.85) 75%, hsl(var(--gold) / 0.05))",
            padding: 2,
            borderRadius: variant === "hex" ? "12%" : "50%",
            boxShadow: glow
              ? `0 0 28px ${color}55, 0 0 14px hsl(var(--gold) / 0.25), inset 0 0 0 1px hsl(var(--gold) / 0.4)`
              : "inset 0 0 0 1px hsl(var(--gold) / 0.4)",
          }}
        >
          {/* Inner disc */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              background: showImage ? "hsl(var(--background))" : gradient,
              borderRadius,
              boxShadow: "inset 0 0 0 1px hsl(var(--background) / 0.6), inset 0 -30px 60px hsl(var(--background) / 0.6)",
            }}
          >
            {showImage ? (
              <>
                <img
                  src={imageUrl}
                  alt=""
                  onError={() => setImgError(true)}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth === 300 && img.naturalHeight === 171) setImgError(true);
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{ borderRadius }}
                />
                {/* Subtle vignette + scanline HUD overlay over photo */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 110%, ${color}44 0%, transparent 65%)`,
                    borderRadius,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    background: "repeating-linear-gradient(180deg, transparent 0px, transparent 2px, hsl(var(--background) / 0.18) 3px, transparent 4px)",
                  }}
                />
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-25" fill="none">
                  <circle cx="50" cy="50" r="46" stroke={color} strokeOpacity="0.4" strokeWidth="0.4" />
                  <circle cx="50" cy="50" r="40" stroke="hsl(var(--gold))" strokeOpacity="0.3" strokeWidth="0.3" strokeDasharray="1.5 2" />
                </svg>
              </>
            ) : (
              <>
                {/* Subtle scanlines overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background:
                      "repeating-linear-gradient(180deg, transparent 0px, transparent 2px, hsl(var(--background) / 0.18) 3px, transparent 4px)",
                  }}
                />
                {/* Concentric rings */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full opacity-50"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="46" stroke={color} strokeOpacity="0.25" strokeWidth="0.3" />
                  <circle cx="50" cy="50" r="40" stroke={color} strokeOpacity="0.18" strokeWidth="0.3" strokeDasharray="1.5 2" />
                  <circle cx="50" cy="50" r="34" stroke="hsl(var(--gold))" strokeOpacity="0.25" strokeWidth="0.25" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <line
                      key={deg}
                      x1="50"
                      y1="6"
                      x2="50"
                      y2="10"
                      stroke="hsl(var(--gold))"
                      strokeOpacity="0.55"
                      strokeWidth="0.6"
                      transform={`rotate(${deg} 50 50)`}
                    />
                  ))}
                </svg>
                {/* Glyph / initials */}
                <div
                  className="relative font-display text-center select-none"
                  style={{
                    fontSize,
                    lineHeight: 1,
                    color: symbol ? "hsl(var(--foreground))" : color,
                    textShadow: `0 0 18px ${color}aa, 0 2px 6px rgb(0 0 0 / 0.5)`,
                    letterSpacing: initials ? "0.02em" : 0,
                    fontWeight: 700,
                  }}
                >
                  {symbol || initials || "?"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* HUD corner brackets */}
        <CornerBrackets />
      </div>

      {/* Meta strip */}
      {(eyebrow || title) && (
        <div className="mt-4 text-center max-w-[220px]">
          {eyebrow && (
            <div className="text-[9px] uppercase tracking-[0.28em] text-primary font-display">
              {eyebrow}
            </div>
          )}
          {title && (
            <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-display">
              {title}
            </div>
          )}
        </div>
      )}

      {children && <div className="mt-3 w-full flex flex-col items-center gap-2">{children}</div>}
    </div>
  );
}

function CornerBrackets() {
  const stroke = "hsl(var(--gold) / 0.65)";
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none"
      fill="none"
    >
      {/* TL */}
      <path d="M0 12 L0 0 L12 0" stroke={stroke} strokeWidth="0.8" />
      {/* TR */}
      <path d="M88 0 L100 0 L100 12" stroke={stroke} strokeWidth="0.8" />
      {/* BL */}
      <path d="M0 88 L0 100 L12 100" stroke={stroke} strokeWidth="0.8" />
      {/* BR */}
      <path d="M88 100 L100 100 L100 88" stroke={stroke} strokeWidth="0.8" />
    </svg>
  );
}

/**
 * Get up to 2 initials from a name like "Galactic Empire" → "GE", "Yoda" → "Y", "Mon Mothma" → "MM".
 */
export function getInitials(name: string, max = 2): string {
  if (!name) return "?";
  const cleaned = name.replace(/[^a-zA-Z0-9\s']/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    // Single-word name → take first 2 letters
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts
    .slice(0, max)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

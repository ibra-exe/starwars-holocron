import { useEffect, useRef, useState } from "react";
import { THEMES, useTheme, ThemeSigil, ThemeId } from "@/lib/theme";
import { Check, ChevronDown, Palette } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme, meta } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef} data-testid="theme-switcher">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 hover:bg-sidebar-accent text-sidebar-foreground transition-colors group"
        data-testid="button-theme-switcher"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-md border"
          style={{
            color: meta.accentHex,
            borderColor: `${meta.accentHex}55`,
            background: `${meta.accentHex}14`,
            boxShadow: `0 0 12px ${meta.accentHex}33`,
          }}
        >
          <ThemeSigil id={meta.sigil} className="w-[15px] h-[15px]" />
        </span>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-[9px] uppercase tracking-[0.24em] font-mono text-muted-foreground leading-none">
            Theme
          </span>
          <span className="font-display text-[12px] tracking-wide text-foreground/95 leading-tight truncate mt-1">
            {meta.name}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme selector"
          className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-sidebar-border bg-popover backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          style={{
            boxShadow: `0 20px 60px -10px rgba(0,0,0,0.7), 0 0 0 1px ${meta.accentHex}22`,
          }}
          data-testid="theme-switcher-menu"
        >
          <div className="px-3 py-2.5 border-b border-sidebar-border flex items-center gap-2 bg-secondary/30">
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span className="font-display text-[10px] uppercase tracking-[0.24em] text-foreground/85">
              Faction Theme
            </span>
          </div>
          <ul className="py-1.5 max-h-[420px] overflow-y-auto">
            {THEMES.map((t) => {
              const selected = t.id === theme;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "bg-primary/[0.10]"
                        : "hover:bg-sidebar-accent/60"
                    }`}
                    data-testid={`theme-option-${t.id}`}
                  >
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-md border shrink-0 mt-0.5"
                      style={{
                        color: t.accentHex,
                        borderColor: `${t.accentHex}66`,
                        background: `linear-gradient(135deg, ${t.accentHex}1a 0%, ${t.accentHex2}10 100%)`,
                        boxShadow: selected ? `0 0 14px ${t.accentHex}55` : `0 0 6px ${t.accentHex}22`,
                      }}
                    >
                      <ThemeSigil id={t.sigil} className="w-[18px] h-[18px]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[13px] tracking-wide text-foreground leading-tight">
                          {t.name}
                        </span>
                        {selected && (
                          <Check className="w-3.5 h-3.5 shrink-0" style={{ color: t.accentHex }} />
                        )}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground mt-1">
                        {t.tagline}
                      </div>
                      <p className="text-[11px] text-foreground/65 leading-snug mt-1.5">
                        {t.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span
                          className="w-3.5 h-3.5 rounded-sm border border-border/40"
                          style={{ background: t.accentHex }}
                          aria-hidden
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-sm border border-border/40"
                          style={{ background: t.accentHex2 }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// Compact variant for mobile header — single button toggling a sheet
export function ThemeSwitcherCompact({ onClick }: { onClick: () => void }) {
  const { meta } = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Theme: ${meta.name}. Open theme selector`}
      className="flex items-center justify-center w-9 h-9 rounded-md border"
      style={{
        color: meta.accentHex,
        borderColor: `${meta.accentHex}55`,
        background: `${meta.accentHex}14`,
      }}
      data-testid="button-theme-switcher-compact"
    >
      <ThemeSigil id={meta.sigil} className="w-4 h-4" />
    </button>
  );
}

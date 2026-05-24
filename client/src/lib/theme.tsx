import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "holocron" | "jedi" | "sith" | "mandalorian" | "imperial";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  accentHex: string;
  accentHex2: string;
  sigil: "holocron" | "jedi" | "sith" | "mando" | "imperial";
}

export const THEMES: ThemeMeta[] = [
  {
    id: "holocron",
    name: "Holocron",
    tagline: "Default — Archives Online",
    description: "Deep void ink, warm gold, and parchment cream. The neutral lore-keeper view.",
    accentHex: "#e6b450",
    accentHex2: "#5cc8ff",
    sigil: "holocron",
  },
  {
    id: "jedi",
    name: "Jedi Order",
    tagline: "Light Side — Coruscant Temple",
    description: "Cool sapphire and warm sand. Calm, monastic, illuminated from within.",
    accentHex: "#5cc8ff",
    accentHex2: "#f0e2c4",
    sigil: "jedi",
  },
  {
    id: "sith",
    name: "Sith Order",
    tagline: "Dark Side — Rule of Two",
    description: "Crimson saber against obsidian. Inner fire, controlled rage, deep shadow.",
    accentHex: "#ff2c2c",
    accentHex2: "#1a0508",
    sigil: "sith",
  },
  {
    id: "mandalorian",
    name: "Mandalorian",
    tagline: "Beskar Creed",
    description: "Beskar steel and signal orange. Industrial, weathered, the Way.",
    accentHex: "#c9c9d1",
    accentHex2: "#ff6b1a",
    sigil: "mando",
  },
  {
    id: "imperial",
    name: "Galactic Empire",
    tagline: "ISB · COMPNOR · Throne World",
    description: "Cold slate, blood scarlet, and clinical white. Order through tyranny.",
    accentHex: "#b8c1d1",
    accentHex2: "#cf1a1a",
    sigil: "imperial",
  },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  meta: ThemeMeta;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "holocron-theme";

function safeReadTheme(): ThemeId {
  try {
    if (typeof window === "undefined") return "holocron";
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && THEMES.some((t) => t.id === v)) return v as ThemeId;
  } catch {
    // localStorage blocked in sandboxed iframes — fall through
  }
  return "holocron";
}

function safeWriteTheme(t: ThemeId) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // ignore
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => safeReadTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "holocron") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    safeWriteTheme(t);
  };

  const meta = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, meta }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// SVG sigils, currentColor-driven, fit a 20x20 box
export function ThemeSigil({ id, className = "" }: { id: ThemeMeta["sigil"]; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (id) {
    case "holocron":
      return (
        <svg {...common} aria-hidden>
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
          <rect x="8" y="8" width="8" height="8" rx="0.8" transform="rotate(45 12 12)" opacity="0.6" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "jedi":
      // Stylized Jedi Order crest — winged emblem
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3v18" />
          <path d="M6 8c0 5 2.5 8 6 11" />
          <path d="M18 8c0 5-2.5 8-6 11" />
          <path d="M4 11c2 .5 4 1 8 1s6-.5 8-1" />
          <circle cx="12" cy="6" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "sith":
      // Six-spoke Sith hexagonal wheel
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16" />
          <path d="M4 12h16" />
          <path d="M6.3 6.3l11.4 11.4" />
          <path d="M17.7 6.3L6.3 17.7" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "mando":
      // Mythosaur skull — simplified Mandalorian sigil
      return (
        <svg {...common} aria-hidden>
          <path d="M7 8c0-2 2-4 5-4s5 2 5 4v3c0 1.5-1 2.5-2 3v3l-3-1.5L9 17v-3c-1-.5-2-1.5-2-3V8z" />
          <path d="M7 8L4 6" />
          <path d="M17 8l3-2" />
          <path d="M7 11L4 13" />
          <path d="M17 11l3 2" />
          <circle cx="10" cy="10" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="14" cy="10" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "imperial":
      // Imperial cog — six-point gear of the Galactic Empire
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="M5 5l2 2" />
          <path d="M17 17l2 2" />
          <path d="M19 5l-2 2" />
          <path d="M5 19l2-2" />
        </svg>
      );
  }
}

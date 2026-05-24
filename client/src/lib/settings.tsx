import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface HolocronSettings {
  autoLink: boolean;          // turn cross-page entity auto-linking on/off
  spoilerVeil: boolean;       // blur known major spoilers until revealed
  revealedIds: string[];      // ids that the user has explicitly unveiled
  smartTooltip: boolean;      // show category chip on hover for auto-links
}

interface SettingsContextValue extends HolocronSettings {
  setAutoLink: (v: boolean) => void;
  setSpoilerVeil: (v: boolean) => void;
  setSmartTooltip: (v: boolean) => void;
  reveal: (id: string) => void;
  resetReveals: () => void;
  isRevealed: (id: string) => boolean;
  resetAll: () => void;
}

const DEFAULTS: HolocronSettings = {
  autoLink: true,
  spoilerVeil: false,
  revealedIds: [],
  smartTooltip: true,
};

const STORAGE_KEY = "holocron-settings-v1";

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStored(): HolocronSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      autoLink: typeof parsed.autoLink === "boolean" ? parsed.autoLink : DEFAULTS.autoLink,
      spoilerVeil: typeof parsed.spoilerVeil === "boolean" ? parsed.spoilerVeil : DEFAULTS.spoilerVeil,
      revealedIds: Array.isArray(parsed.revealedIds) ? parsed.revealedIds : DEFAULTS.revealedIds,
      smartTooltip: typeof parsed.smartTooltip === "boolean" ? parsed.smartTooltip : DEFAULTS.smartTooltip,
    };
  } catch {
    return DEFAULTS;
  }
}

function writeStored(s: HolocronSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore (sandboxed iframe)
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HolocronSettings>(DEFAULTS);

  // Initial read after mount so SSR/sandbox safe
  useEffect(() => {
    setState(readStored());
  }, []);

  useEffect(() => {
    writeStored(state);
  }, [state]);

  const setAutoLink = useCallback((v: boolean) => setState((s) => ({ ...s, autoLink: v })), []);
  const setSpoilerVeil = useCallback((v: boolean) => setState((s) => ({ ...s, spoilerVeil: v })), []);
  const setSmartTooltip = useCallback((v: boolean) => setState((s) => ({ ...s, smartTooltip: v })), []);
  const reveal = useCallback((id: string) => {
    setState((s) => (s.revealedIds.includes(id) ? s : { ...s, revealedIds: [...s.revealedIds, id] }));
  }, []);
  const resetReveals = useCallback(() => setState((s) => ({ ...s, revealedIds: [] })), []);
  const isRevealed = useCallback((id: string) => state.revealedIds.includes(id), [state.revealedIds]);
  const resetAll = useCallback(() => setState(DEFAULTS), []);

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        setAutoLink,
        setSpoilerVeil,
        setSmartTooltip,
        reveal,
        resetReveals,
        isRevealed,
        resetAll,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    // Fallback noop context if used outside provider
    return {
      ...DEFAULTS,
      setAutoLink: () => {},
      setSpoilerVeil: () => {},
      setSmartTooltip: () => {},
      reveal: () => {},
      resetReveals: () => {},
      isRevealed: () => false,
      resetAll: () => {},
    };
  }
  return ctx;
}

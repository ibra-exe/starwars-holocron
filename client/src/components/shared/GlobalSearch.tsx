import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Users, Flag, Dna, Library, Globe, Sparkles, Route as RouteIcon, MapPin, Rocket, Gem, GitBranch } from "lucide-react";
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { CHARACTERS } from "@/data/characters";
import { MEDIA } from "@/data/media";
import { FACTIONS } from "@/data/factions";
import { SPECIES } from "@/data/species";
import { ERAS } from "@/data/eras";
import { FORCE_CONCEPTS } from "@/data/force";
import { PLANETS } from "@/data/planets";
import { SHIPS } from "@/data/ships";
import { ARTIFACTS } from "@/data/artifacts";
import { LINEAGES } from "@/data/lineages";

type Category = "Character" | "Faction" | "Species" | "Media" | "Era" | "Force" | "Pathway" | "Planet" | "Ship" | "Artifact" | "Lineage";

interface Result {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  page: string;
  accent: string; // tailwind text class
  Icon: React.ComponentType<{ className?: string }>;
}

// keep a small pathway index here so search can hit the curated reading orders too
const PATHWAY_INDEX: { id: string; title: string; audience: string }[] = [
  { id: "beginner", title: "First Lightspeed Jump", audience: "Beginner" },
  { id: "chronological", title: "The Master Chronology", audience: "Completionist" },
  { id: "skywalker", title: "The Skywalker Bloodline", audience: "Character-focused" },
  { id: "sith", title: "The Dark Side Codex", audience: "Faction-focused" },
  { id: "mando", title: "The Way of the Mandalore", audience: "Faction-focused" },
  { id: "rebellion", title: "Spark of Rebellion", audience: "Faction-focused" },
  { id: "jedi", title: "Path of the Jedi", audience: "Faction-focused" },
];

const CAT_STYLE: Record<Category, { color: string; Icon: React.ComponentType<{ className?: string }>; page: string }> = {
  Character: { color: "text-[hsl(var(--rebel))]", Icon: Users, page: "/characters" },
  Faction: { color: "text-[hsl(var(--sith))]", Icon: Flag, page: "/factions" },
  Species: { color: "text-[hsl(var(--mando))]", Icon: Dna, page: "/species" },
  Media: { color: "text-[hsl(var(--jedi))]", Icon: Library, page: "/media" },
  Era: { color: "text-primary", Icon: Globe, page: "/eras" },
  Force: { color: "text-[hsl(var(--nightsister))]", Icon: Sparkles, page: "/force" },
  Pathway: { color: "text-[hsl(var(--mando))]", Icon: RouteIcon, page: "/pathways" },
  Planet: { color: "text-[hsl(var(--chart-5))]", Icon: MapPin, page: "/planets" },
  Ship: { color: "text-[hsl(var(--imperial))]", Icon: Rocket, page: "/ships" },
  Artifact: { color: "text-primary", Icon: Gem, page: "/artifacts" },
  Lineage: { color: "text-[hsl(var(--crawl))]", Icon: GitBranch, page: "/lineages" },
};

function buildIndex(): Result[] {
  const all: Result[] = [];

  for (const c of CHARACTERS) {
    const s = CAT_STYLE.Character;
    all.push({
      id: c.id,
      title: c.name,
      subtitle: [c.species, c.category].filter(Boolean).join(" · "),
      category: "Character",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const f of FACTIONS) {
    const s = CAT_STYLE.Faction;
    all.push({
      id: f.id,
      title: f.name,
      subtitle: `${f.alignment} · ${f.category}`,
      category: "Faction",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const sp of SPECIES) {
    const s = CAT_STYLE.Species;
    all.push({
      id: sp.id,
      title: sp.name,
      subtitle: sp.classification,
      category: "Species",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const m of MEDIA) {
    const s = CAT_STYLE.Media;
    all.push({
      id: m.id,
      title: m.title,
      subtitle: `${m.type} · ${m.continuity}`,
      category: "Media",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const e of ERAS) {
    const s = CAT_STYLE.Era;
    all.push({
      id: e.id,
      title: e.name,
      subtitle: e.tagline,
      category: "Era",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const fc of FORCE_CONCEPTS) {
    const s = CAT_STYLE.Force;
    all.push({
      id: fc.id,
      title: fc.name,
      subtitle: fc.category || "Force concept",
      category: "Force",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const p of PATHWAY_INDEX) {
    const s = CAT_STYLE.Pathway;
    all.push({
      id: p.id,
      title: p.title,
      subtitle: p.audience,
      category: "Pathway",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const pl of PLANETS) {
    const s = CAT_STYLE.Planet;
    all.push({
      id: pl.id,
      title: pl.name,
      subtitle: `${pl.classification} · ${pl.region}`,
      category: "Planet",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const sh of SHIPS) {
    const s = CAT_STYLE.Ship;
    all.push({
      id: sh.id,
      title: sh.name,
      subtitle: sh.classDesignation,
      category: "Ship",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const a of ARTIFACTS) {
    const s = CAT_STYLE.Artifact;
    all.push({
      id: a.id,
      title: a.name,
      subtitle: a.category,
      category: "Artifact",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  for (const l of LINEAGES) {
    const s = CAT_STYLE.Lineage;
    all.push({
      id: l.id,
      title: l.name,
      subtitle: l.type,
      category: "Lineage",
      page: s.page,
      accent: s.color,
      Icon: s.Icon,
    });
  }
  return all;
}

function rank(query: string, item: Result): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const sub = (item.subtitle || "").toLowerCase();
  if (title === q) return 0;
  if (title.startsWith(q)) return 1;
  if (title.includes(q)) return 2;
  if (sub.includes(q)) return 3;
  return 99;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [] as Result[];
    const scored: { item: Result; score: number }[] = [];
    for (const it of index) {
      const s = rank(q, it);
      if (s < 99) scored.push({ item: it, score: s });
    }
    scored.sort((a, b) => a.score - b.score || a.item.title.length - b.item.title.length);
    return scored.slice(0, 12).map((s) => s.item);
  }, [index, query]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // keyboard shortcut: "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function pick(r: Result) {
    setOpen(false);
    setQuery("");
    // queue the entity to open on the destination page, then navigate.
    // (We can't put the id in the URL because wouter's useHashLocation treats
    // "?" and a second "#" as part of the route path.)
    setPendingAnchor({ page: r.page, id: r.id });
    if (window.location.hash !== `#${r.page}`) {
      window.location.hash = `#${r.page}`;
    } else {
      // already on the right page — fire a hashchange so the page picks up
      // the new anchor immediately.
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = open && (query.trim().length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl" data-testid="global-search">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/80 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search anything: characters, planets, ships, artifacts, factions, lineages…"
          aria-label="Search the Holocron archives"
          className="w-full pl-11 pr-24 py-3.5 rounded-md bg-card/70 border border-primary/30 text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/70 focus:bg-card/90 transition-all font-medium text-[14px] panel-premium"
          data-testid="input-global-search"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {query ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }}
              className="pointer-events-auto p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
              data-testid="button-clear-search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border/60 bg-secondary/40 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
          )}
        </div>
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[60vh] overflow-y-auto rounded-md border border-primary/30 bg-card/95 backdrop-blur shadow-2xl panel-premium"
          data-testid="search-dropdown"
        >
          {results.length === 0 ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              No results in the archives for <span className="text-foreground/80 font-medium">"{query}"</span>.
            </div>
          ) : (
            <ul className="py-2">
              {results.map((r, i) => {
                const Icon = r.Icon;
                return (
                  <li key={`${r.category}-${r.id}`}>
                    <button
                      type="button"
                      onClick={() => pick(r)}
                      onMouseEnter={() => setActive(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === active ? "bg-primary/[0.08]" : "hover:bg-primary/[0.05]"
                      }`}
                      data-testid={`search-result-${r.category.toLowerCase()}-${r.id}`}
                    >
                      <div className={`w-7 h-7 rounded-sm border border-border bg-secondary/40 flex items-center justify-center shrink-0 ${r.accent}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-medium text-foreground truncate">{r.title}</div>
                        {r.subtitle && (
                          <div className="text-[11px] text-muted-foreground truncate">{r.subtitle}</div>
                        )}
                      </div>
                      <div className={`font-mono text-[9.5px] uppercase tracking-[0.22em] shrink-0 ${r.accent}`}>
                        {r.category}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="px-4 py-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground/70">
            <span>↑ ↓ to navigate · ↵ to open · esc to close</span>
            <span>{results.length} results</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;

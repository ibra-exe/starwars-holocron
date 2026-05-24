import { useMemo, useState } from "react";
import { CHARACTERS } from "@/data/characters";
import { FACTIONS } from "@/data/factions";
import { MEDIA } from "@/data/media";
import { ERAS } from "@/data/eras";
import { FORCE_CONCEPTS } from "@/data/force";
import { SPECIES } from "@/data/species";
import { PageHeader, ContinuityBadge, EssentialityBadge, AlignmentBadge } from "@/components/shared/Badges";
import { Link } from "wouter";
import { Search } from "lucide-react";

type ResultGroup = "Characters" | "Factions" | "Species" | "Media" | "Eras" | "Force Concepts";

interface Result {
  id: string;
  group: ResultGroup;
  title: string;
  subtitle: string;
  link: string;
  badges?: React.ReactNode;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const out: Result[] = [];

    for (const c of CHARACTERS) {
      const hay = [c.name, ...(c.aliases ?? []), c.species, c.bio, c.notableQuote ?? "", c.category].join(" ").toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: `c-${c.id}`,
          group: "Characters",
          title: c.name,
          subtitle: `${c.category} · ${c.species}${c.aliases?.length ? ` · aka ${c.aliases.slice(0, 2).join(", ")}` : ""}`,
          link: `/characters#${c.id}`,
          badges: <AlignmentBadge value={c.forceAlignment} />,
        });
      }
    }
    for (const f of FACTIONS) {
      const hay = [f.name, f.shortName ?? "", f.ideology, f.description, f.philosophy, f.structure].join(" ").toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: `f-${f.id}`,
          group: "Factions",
          title: f.name,
          subtitle: `${f.category} · ${f.alignment}`,
          link: `/factions#${f.id}`,
        });
      }
    }
    for (const m of MEDIA) {
      const hay = [m.title, m.summary, ...(m.events ?? []), m.type, m.author ?? "", m.director ?? "", m.creator ?? ""].join(" ").toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: `m-${m.id}`,
          group: "Media",
          title: m.title,
          subtitle: `${m.type} · ${m.inUniverseDate} · ${m.releaseYear}`,
          link: `/media#${m.id}`,
          badges: (
            <>
              <ContinuityBadge value={m.continuity} />
              <EssentialityBadge value={m.essentiality} />
            </>
          ),
        });
      }
    }
    for (const e of ERAS) {
      const hay = [e.name, e.tagline, e.political, e.description, ...e.majorWars].join(" ").toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: `e-${e.id}`,
          group: "Eras",
          title: e.name,
          subtitle: e.tagline,
          link: `/eras#${e.id}`,
        });
      }
    }
    for (const sp of SPECIES) {
      const hay = [sp.name, sp.homeworld, sp.appearance, sp.society, sp.cultureAndReligion, sp.roleInGalaxy, sp.classification, sp.biology].join(" ").toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: `s-${sp.id}`,
          group: "Species",
          title: sp.name,
          subtitle: `${sp.classification} · ${sp.homeworld}`,
          link: `/species#${sp.id}`,
          badges: <ContinuityBadge value={sp.continuity} />,
        });
      }
    }
    for (const fc of FORCE_CONCEPTS) {
      const hay = [fc.name, fc.summary, fc.details].join(" ").toLowerCase();
      if (hay.includes(q)) {
        out.push({
          id: `fc-${fc.id}`,
          group: "Force Concepts",
          title: fc.name,
          subtitle: fc.category,
          link: `/force#${fc.id}`,
        });
      }
    }
    return out;
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<ResultGroup, Result[]>();
    for (const r of results) {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group)!.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  const suggestions = ["Anakin Skywalker", "Mandalore", "Order 66", "Kyber", "Ahsoka", "Sith", "Rule of Two", "Mortis"];

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Cross-Reference"
        title="View Everything Related to…"
        description="One query across the entire archive — characters, factions, media, eras, and Force philosophy."
      />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          autoFocus
          type="search"
          placeholder="Search the holocron archives…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-lg bg-input border border-border text-base focus:border-primary focus:outline-none font-display tracking-wide"
          data-testid="input-cross-reference"
        />
      </div>

      {!query && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3">Try</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-md border border-border text-sm text-foreground/85 hover:text-primary hover:border-primary/40"
                data-testid={`suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="space-y-7">
          <div className="text-xs text-muted-foreground font-display tracking-widest uppercase">
            {results.length} results for "{query}"
          </div>
          {grouped.map(([group, list]) => (
            <section key={group}>
              <div className="text-[10px] uppercase tracking-[0.32em] text-primary font-display mb-3">
                {group} <span className="text-muted-foreground/70">({list.length})</span>
              </div>
              <div className="space-y-2">
                {list.map((r) => (
                  <Link key={r.id} href={r.link} data-testid={`result-${r.id}`}>
                    <div className="rounded-lg border border-border bg-card hover-elevate p-4 cursor-pointer flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-base text-foreground">{r.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.subtitle}</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 shrink-0">{r.badges}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          {results.length === 0 && (
            <div className="text-center text-muted-foreground py-16 font-display tracking-widest uppercase text-sm">
              The archives contain no record of "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { MEDIA } from "@/data/media";
import { ERAS } from "@/data/eras";
import { PageHeader, ContinuityBadge, EssentialityBadge, MediaTypeBadge } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";
import { formatBBY, shortBBY } from "@/lib/format";
import { Continuity, EraId, MediaType } from "@/data/types";

const MEDIA_TYPES: MediaType[] = [
  "Film",
  "TV Series",
  "Animated Series",
  "Animated Film",
  "Short",
  "Game",
  "DLC",
  "Novel",
  "Junior Novel",
  "Comic",
  "Manga",
  "Audio Drama",
  "Anthology",
  "Reference",
  "Web Series",
  "VR",
];

export default function TimelinePage() {
  const [continuity, setContinuity] = useState<Continuity | "All">("All");
  const [typeFilter, setTypeFilter] = useState<MediaType | "All">("All");
  const [eraFilter, setEraFilter] = useState<EraId | "All">("All");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    return MEDIA.filter((m) => {
      if (continuity !== "All" && m.continuity !== continuity && m.continuity !== "Both") return false;
      if (typeFilter !== "All" && m.type !== typeFilter) return false;
      if (eraFilter !== "All") {
        const eras = Array.isArray(m.era) ? m.era : [m.era];
        if (!eras.includes(eraFilter)) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (
          !m.title.toLowerCase().includes(s) &&
          !m.summary.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    }).sort((a, b) => a.inUniverseSortKey - b.inUniverseSortKey);
  }, [continuity, typeFilter, eraFilter, search]);

  // Group by era for visual timeline
  const groupedByEra = useMemo(() => {
    const map = new Map<EraId, typeof items>();
    for (const m of items) {
      const eras = Array.isArray(m.era) ? m.era : [m.era];
      const era = eras[0];
      if (!map.has(era)) map.set(era, [] as any);
      map.get(era)!.push(m);
    }
    return Array.from(map.entries()).sort(
      ([a], [b]) =>
        (ERAS.find((e) => e.id === a)?.startBBY ?? 0) -
        (ERAS.find((e) => e.id === b)?.startBBY ?? 0)
    );
  }, [items]);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Master Timeline"
        title="The Galactic Chronology"
        description="Every film, series, novel, comic, and game placed in in-universe order — measured in BBY (Before the Battle of Yavin) and ABY (After the Battle of Yavin)."
      />

      {/* Filters */}
      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="search"
            placeholder="Search titles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-md bg-input border border-border text-sm w-56 focus:border-primary focus:outline-none"
            data-testid="input-timeline-search"
          />
          <Select label="Continuity" value={continuity} onChange={(v) => setContinuity(v as any)} options={["All", "Canon", "Legends"]} testId="select-continuity" />
          <Select label="Era" value={eraFilter} onChange={(v) => setEraFilter(v as any)} options={["All", ...ERAS.map((e) => e.id)]} labels={{ All: "All Eras", ...Object.fromEntries(ERAS.map((e) => [e.id, e.shortName])) }} testId="select-era" />
          <Select label="Type" value={typeFilter} onChange={(v) => setTypeFilter(v as any)} options={["All", ...MEDIA_TYPES]} testId="select-type" />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase" data-testid="text-result-count">
            {items.length} entries
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[100px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-primary/20" aria-hidden />
        <div className="space-y-10">
          {groupedByEra.map(([eraId, list]) => {
            const era = ERAS.find((e) => e.id === eraId);
            return (
              <div key={eraId} className="relative">
                <div className="flex items-center gap-4 mb-4 pl-[112px]">
                  <div
                    className="absolute left-[92px] w-4 h-4 rounded-full border-2 border-background"
                    style={{ background: era?.color || "#aaa", top: "0.4rem" }}
                    aria-hidden
                  />
                  <div>
                    <div className="font-display text-lg text-foreground tracking-wide">{era?.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      {era && `${formatBBY(era.startBBY)} → ${formatBBY(era.endBBY)}`} · {list.length} entries
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 pl-[112px]">
                  {list.map((m) => (
                    <li
                      key={m.id}
                      className="rounded-lg border border-border bg-card hover-elevate p-4"
                      data-testid={`media-${m.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 shrink-0 text-right">
                          <div className="font-display text-sm text-primary tabular-nums">
                            {m.inUniverseDate}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                            {m.releaseYear}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                            <span className="font-display text-base text-foreground">{m.title}</span>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2"><SmartText text={m.summary} maxLinks={3} /></p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <MediaTypeBadge value={m.type} />
                            <ContinuityBadge value={m.continuity} />
                            <EssentialityBadge value={m.essentiality} />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center text-muted-foreground py-16 font-display tracking-widest uppercase text-sm">
          No transmissions match these filters.
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  labels,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
  testId?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-widest font-display">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none"
        data-testid={testId}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}

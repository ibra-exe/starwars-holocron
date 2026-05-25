import { useMemo, useState } from "react";
import { DrawerPortal } from "@/components/shared/DrawerPortal";
import { setPendingAnchor, useHashAnchor } from "@/lib/useHashAnchor";
import { PLANETS, findPlanet, PlanetClassification, Planet } from "@/data/planets";
import { findCharacter } from "@/data/characters";
import { findFaction } from "@/data/factions";
import { PageHeader, ContinuityBadge, ImportanceBar } from "@/components/shared/Badges";
import DrawerSection from "@/components/shared/DrawerSection";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import { Search } from "lucide-react";

const CLASSIFICATIONS: Array<PlanetClassification | "All"> = [
  "All",
  "Core World",
  "Deep Core",
  "Colonies",
  "Inner Rim",
  "Expansion Region",
  "Mid Rim",
  "Outer Rim",
  "Wild Space",
  "Unknown Regions",
  "Hutt Space",
];

const CONTINUITIES = ["All", "Canon", "Legends", "Both"] as const;

export default function PlanetsPage() {
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState<PlanetClassification | "All">("All");
  const [continuity, setContinuity] = useState<(typeof CONTINUITIES)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    return PLANETS.filter((p) => {
      if (classification !== "All" && p.classification !== classification) return false;
      if (continuity !== "All" && p.continuity !== continuity) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [p.name, p.region, p.terrain, p.atmosphere, p.loreSignificance, p.description, p.capital ?? ""]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
  }, [search, classification, continuity]);

  useHashAnchor(
    "/planets",
    (id) => setSelectedId(id),
    (id) => !!findPlanet(id),
  );

  const selected = selectedId ? findPlanet(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Atlas"
        title="Planets & Locations"
        description="A galactic gazetteer — every world that shaped the saga. Core, Rim, and Unknown Regions; ecumenopoli, deserts, swamps, and ash-stained graveyards of fallen Sith."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search planets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-planets-search"
            />
          </div>
          <Pill label="Region" value={classification} setValue={(v) => setClassification(v as any)} options={CLASSIFICATIONS} />
          <Pill label="Continuity" value={continuity} setValue={(v) => setContinuity(v as any)} options={[...CONTINUITIES]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} worlds</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className="text-left rounded-xl border border-border bg-card hover-elevate relative overflow-hidden flex flex-col"
            data-testid={`card-planet-${p.id}`}
          >
            <PlanetBanner imageUrl={p.imageUrl} color={p.color} />
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">{p.classification}</span>
                <ImportanceBar value={p.importance} />
              </div>
              <div className="font-display text-[13px] text-foreground leading-tight">{p.name}</div>
              <div className="text-xs text-muted-foreground italic mt-0.5">{p.region}</div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <ContinuityBadge value={p.continuity} />
                {p.climate.slice(0, 1).map((c) => (
                  <span key={c} className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-foreground/85 font-display">{c}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && <PlanetDrawer planet={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

function Pill<T extends string>({ label, value, setValue, options }: { label: string; value: T; setValue: (v: T) => void; options: readonly T[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-widest font-display">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as T)}
        className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none"
        data-testid={`select-${label.toLowerCase()}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function PlanetDrawer({ planet: p, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <DrawerPortal>
    <div className="fixed inset-0 z-50 flex" onClick={onClose} data-testid="planet-detail-overlay">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-4xl bg-card border-l overflow-y-auto overscroll-y-contain"
        style={{ borderLeftColor: p.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center justify-between px-4 md:px-7 pb-2" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Planetary Survey</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-planet">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              imageUrl={p.imageUrl}
              initials={getInitials(p.name, 2)}
              color={p.color}
              eyebrow={p.classification}
              title={p.region}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-display">Importance</span>
                <ImportanceBar value={p.importance} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                <ContinuityBadge value={p.continuity} />
              </div>
            </VisualPlate>

            <dl className="mt-5 w-full max-w-[240px] grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px] font-display">
              {p.system && <Stat label="System" value={p.system} />}
              {p.sector && <Stat label="Sector" value={p.sector} />}
              {p.capital && <Stat label="Capital" value={p.capital} />}
              {p.population && <Stat label="Population" value={p.population} />}
              {p.gravity && <Stat label="Gravity" value={p.gravity} />}
              {p.diameter && <Stat label="Diameter" value={p.diameter} />}
              {p.rotationPeriod && <Stat label="Day" value={p.rotationPeriod} />}
              {p.orbitalPeriod && <Stat label="Year" value={p.orbitalPeriod} />}
              {p.primaryLanguage && <Stat label="Language" value={p.primaryLanguage} colSpan />}
              {p.government && <Stat label="Government" value={p.government} colSpan />}
            </dl>
          </aside>

          <div className="min-w-0">
            <h2 className="font-display text-3xl text-foreground tracking-wide leading-tight">{p.name}</h2>
            <div className="text-sm text-muted-foreground italic mt-1">{p.region}{p.sector ? ` · ${p.sector}` : ""}</div>

            <DrawerSection title="Overview" excludeId={p.id}>{p.description}</DrawerSection>
            <DrawerSection title="Terrain" excludeId={p.id}>{p.terrain}</DrawerSection>
            <DrawerSection title="Atmosphere" excludeId={p.id}>{p.atmosphere}</DrawerSection>
            <DrawerSection title="Lore Significance" excludeId={p.id}>{p.loreSignificance}</DrawerSection>

            {p.nativeSpecies && p.nativeSpecies.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Native Species</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.nativeSpecies.map((sp) => (
                    <span key={sp} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{sp}</span>
                  ))}
                </div>
              </div>
            )}

            {p.majorCities && p.majorCities.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Major Cities & Sites</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.majorCities.map((c) => (
                    <span key={c} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {p.affiliations && p.affiliations.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Affiliations Over Time</div>
                <div className="space-y-1.5">
                  {p.affiliations.map((a, i) => {
                    const f = findFaction(a.faction);
                    return (
                      <div key={i} className="rounded border border-border bg-secondary/30 px-3 py-2 flex items-baseline justify-between gap-3">
                        {f ? (
                          <a
                            href={`#/factions`}
                            onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/factions", id: f.id }); window.location.hash = "#/factions"; }}
                            className="text-sm text-primary hover:underline"
                          >
                            {f.name}
                          </a>
                        ) : (
                          <span className="text-sm text-foreground/90">{a.faction}</span>
                        )}
                        <span className="text-[11px] text-muted-foreground italic text-right">
                          {a.era}{a.note ? ` · ${a.note}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {p.keyEvents && p.keyEvents.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Key Events</div>
                <ul className="space-y-1.5">
                  {p.keyEvents.map((e, i) => (
                    <li key={i} className="text-sm text-foreground/85 flex gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary/70 shrink-0 mt-1 w-32">{e.era}</span>
                      <span>{e.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {p.notableCharacters && p.notableCharacters.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Notable Inhabitants & Visitors</div>
                <div className="space-y-1.5">
                  {p.notableCharacters.map((n, i) => {
                    const target = n.characterId ? findCharacter(n.characterId) : null;
                    return (
                      <div key={i} className="rounded border border-border bg-secondary/30 px-3 py-2 flex items-baseline justify-between gap-3">
                        {target ? (
                          <a
                            href={`#/characters`}
                            onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: target.id }); window.location.hash = "#/characters"; }}
                            className="text-sm text-primary hover:underline"
                          >
                            {n.name}
                          </a>
                        ) : (
                          <span className="text-sm text-foreground/90">{n.name}</span>
                        )}
                        {n.note && <span className="text-[11px] text-muted-foreground italic text-right">{n.note}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {p.appearances && p.appearances.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Featured In</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.appearances.map((m) => (
                    <span key={m} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {p.trivia && p.trivia.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Trivia</div>
                <ul className="space-y-1.5 list-disc list-inside text-sm text-foreground/85">
                  {p.trivia.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DrawerPortal>
  );
}

function PlanetBanner({ imageUrl, color }: { imageUrl?: string; color: string }) {
  const [imgError, setImgError] = useState(false);
  const gradient = `linear-gradient(135deg, ${color}55 0%, ${color}22 50%, ${color}11 100%)`;
  return (
    <div className="w-full h-24 relative overflow-hidden rounded-t-xl" style={{ background: gradient }}>
      {imageUrl && !imgError && (
        <img src={imageUrl} alt="" onError={() => setImgError(true)}
          onLoad={(e) => { const img = e.currentTarget; if (img.naturalWidth === 300 && img.naturalHeight === 171) setImgError(true); }}
          className="absolute inset-0 w-full h-full object-cover object-center" />
      )}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, hsl(var(--card)) 100%)` }} />
    </div>
  );
}

function Stat({ label, value, colSpan }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 border-t border-border/60 pt-1.5 ${colSpan ? "col-span-2" : ""}`}>
      <dt className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] text-foreground/90 leading-tight">{value}</dd>
    </div>
  );
}

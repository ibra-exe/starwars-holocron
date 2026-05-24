import { useMemo, useState } from "react";
import { setPendingAnchor, useHashAnchor } from "@/lib/useHashAnchor";
import { SHIPS, findShip, ShipCategory, Ship } from "@/data/ships";
import { findCharacter } from "@/data/characters";
import { findFaction } from "@/data/factions";
import { PageHeader, ContinuityBadge, ImportanceBar } from "@/components/shared/Badges";
import DrawerSection from "@/components/shared/DrawerSection";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import { Search } from "lucide-react";

const CATEGORIES: Array<ShipCategory | "All"> = [
  "All",
  "Capital Ship",
  "Super Star Destroyer",
  "Star Destroyer",
  "Cruiser",
  "Frigate",
  "Corvette",
  "Carrier",
  "Starfighter",
  "Bomber",
  "Interceptor",
  "Light Freighter",
  "Heavy Freighter",
  "Yacht/Personal Transport",
  "Shuttle",
  "Battle Station",
  "Speeder/Skiff",
  "Walker",
  "Tank",
  "Submersible",
  "Hyperspace Ring",
];

const CONTINUITIES = ["All", "Canon", "Legends", "Both"] as const;

export default function ShipsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ShipCategory | "All">("All");
  const [continuity, setContinuity] = useState<(typeof CONTINUITIES)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    return SHIPS.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (continuity !== "All" && s.continuity !== continuity) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [s.name, s.classDesignation, s.manufacturer, s.loreSignificance, s.description, s.combatRecord]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
  }, [search, category, continuity]);

  useHashAnchor(
    "/ships",
    (id) => setSelectedId(id),
    (id) => !!findShip(id),
  );

  const selected = selectedId ? findShip(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Codex"
        title="Ships & Vehicles"
        description="From the Millennium Falcon to the Executor — every hull that mattered. Starfighters, capital ships, walkers, battle stations, and the named freighters of myth."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search ships…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-ships-search"
            />
          </div>
          <Pill label="Class" value={category} setValue={(v) => setCategory(v as any)} options={CATEGORIES} />
          <Pill label="Continuity" value={continuity} setValue={(v) => setContinuity(v as any)} options={[...CONTINUITIES]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} hulls</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className="text-left rounded-xl border border-border bg-card p-5 hover-elevate relative overflow-hidden"
            data-testid={`card-ship-${s.id}`}
          >
            <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: s.color }} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">{s.category}</span>
              <ImportanceBar value={s.importance} />
            </div>
            <div className="font-display text-base text-foreground leading-tight">{s.name}</div>
            <div className="text-xs text-muted-foreground italic mt-0.5">{s.classDesignation}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <ContinuityBadge value={s.continuity} />
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-foreground/85 font-display">{s.manufacturer}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && <ShipDrawer ship={selected} onClose={() => setSelectedId(null)} />}
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

function ShipDrawer({ ship: s, onClose }: { ship: Ship; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose} data-testid="ship-detail-overlay">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-4xl bg-card border-l overflow-y-auto"
        style={{ borderLeftColor: s.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center justify-between px-4 md:px-7 pt-6 pb-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Vessel Schematic</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-ship">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              initials={getInitials(s.name, 2)}
              color={s.color}
              eyebrow={s.category}
              title={s.manufacturer}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-display">Importance</span>
                <ImportanceBar value={s.importance} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                <ContinuityBadge value={s.continuity} />
              </div>
            </VisualPlate>

            <dl className="mt-5 w-full max-w-[240px] grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px] font-display">
              {s.length && <Stat label="Length" value={s.length} />}
              {s.crew && <Stat label="Crew" value={s.crew} />}
              {s.passengers && <Stat label="Passengers" value={s.passengers} />}
              {s.shields && <Stat label="Shields" value={s.shields} />}
              {s.speed && <Stat label="Speed" value={s.speed} colSpan />}
              {s.hyperdrive && <Stat label="Hyperdrive" value={s.hyperdrive} colSpan />}
            </dl>
          </aside>

          <div className="min-w-0">
            <h2 className="font-display text-3xl text-foreground tracking-wide leading-tight">{s.name}</h2>
            <div className="text-sm text-muted-foreground italic mt-1">{s.classDesignation}</div>

            <DrawerSection title="Overview" excludeId={s.id}>{s.description}</DrawerSection>
            <DrawerSection title="Design History" excludeId={s.id}>{s.designHistory}</DrawerSection>
            <DrawerSection title="Combat Record" excludeId={s.id}>{s.combatRecord}</DrawerSection>
            <DrawerSection title="Lore Significance" excludeId={s.id}>{s.loreSignificance}</DrawerSection>

            {s.armament && s.armament.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Armament</div>
                <ul className="space-y-1 list-disc list-inside text-sm text-foreground/85">
                  {s.armament.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}

            {s.affiliations && s.affiliations.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Affiliations</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.affiliations.map((fid) => {
                    const f = findFaction(fid);
                    if (!f) return (
                      <span key={fid} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/70 italic">{fid}</span>
                    );
                    return (
                      <a
                        key={fid}
                        href={`#/factions`}
                        onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/factions", id: fid }); window.location.hash = "#/factions"; }}
                        className="text-[11px] px-2 py-1 rounded border text-foreground/85 hover:text-primary"
                        style={{ borderColor: `${f.color}66` }}
                      >
                        {f.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {s.notablePilots && s.notablePilots.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Notable Pilots & Crew</div>
                <div className="space-y-1.5">
                  {s.notablePilots.map((p, i) => {
                    const target = p.characterId ? findCharacter(p.characterId) : null;
                    return (
                      <div key={i} className="rounded border border-border bg-secondary/30 px-3 py-2 flex items-baseline justify-between gap-3">
                        {target ? (
                          <a
                            href={`#/characters`}
                            onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: target.id }); window.location.hash = "#/characters"; }}
                            className="text-sm text-primary hover:underline"
                          >
                            {p.name}
                          </a>
                        ) : (
                          <span className="text-sm text-foreground/90">{p.name}</span>
                        )}
                        {p.note && <span className="text-[11px] text-muted-foreground italic text-right">{p.note}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {s.notableUnits && s.notableUnits.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Notable Named Vessels / Squadrons</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.notableUnits.map((u) => (
                    <span key={u} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{u}</span>
                  ))}
                </div>
              </div>
            )}

            {s.appearances && s.appearances.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Featured In</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.appearances.map((m) => (
                    <span key={m} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {s.trivia && s.trivia.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Trivia</div>
                <ul className="space-y-1.5 list-disc list-inside text-sm text-foreground/85">
                  {s.trivia.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
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

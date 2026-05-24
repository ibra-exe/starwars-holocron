import { useMemo, useState } from "react";
import { setPendingAnchor, useHashAnchor } from "@/lib/useHashAnchor";
import { LINEAGES, findLineage, LineageType, Lineage, LineageNode } from "@/data/lineages";
import { findCharacter } from "@/data/characters";
import { findFaction } from "@/data/factions";
import { findEra } from "@/data/eras";
import { PageHeader, ContinuityBadge, ImportanceBar } from "@/components/shared/Badges";
import DrawerSection from "@/components/shared/DrawerSection";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import { Search, GitBranch, Crown, Users, Sword, Heart } from "lucide-react";

const TYPES: Array<LineageType | "All"> = [
  "All",
  "Bloodline",
  "Master-Apprentice (Jedi)",
  "Master-Apprentice (Sith)",
  "Clan",
  "Mentor Chain",
  "Adopted Family",
];

const CONTINUITIES = ["All", "Canon", "Legends", "Both"] as const;

function typeIcon(t: LineageType) {
  switch (t) {
    case "Bloodline": return Heart;
    case "Master-Apprentice (Jedi)": return Users;
    case "Master-Apprentice (Sith)": return Sword;
    case "Clan": return Crown;
    case "Adopted Family": return Heart;
    case "Mentor Chain": return GitBranch;
    default: return GitBranch;
  }
}

function alignmentColor(a?: LineageNode["alignment"]): string {
  switch (a) {
    case "Light": return "#7ec9ff";
    case "Dark": return "#ff3c3c";
    case "Gray": return "#a89c80";
    case "Balance": return "#d4af37";
    case "Redeemed": return "#bcb6e0";
    case "Corrupted": return "#7a1a1a";
    default: return "#666";
  }
}

export default function LineagesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<LineageType | "All">("All");
  const [continuity, setContinuity] = useState<(typeof CONTINUITIES)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    return LINEAGES.filter((l) => {
      if (type !== "All" && l.type !== type) return false;
      if (continuity !== "All" && l.continuity !== continuity) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [l.name, l.summary, l.description, l.thematicArc, ...l.nodes.map((n) => n.name)]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
  }, [search, type, continuity]);

  useHashAnchor(
    "/lineages",
    (id) => setSelectedId(id),
    (id) => !!findLineage(id),
  );

  const selected = selectedId ? findLineage(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Genealogy"
        title="Family Trees & Lineages"
        description="Bloodlines, mentor chains, and adopted families. Trace the Skywalker dynasty through three generations, the Sith Rule of Two from Bane to Kylo Ren, and the unbroken Jedi line from Yoda to Rey."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search lineages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-lineages-search"
            />
          </div>
          <Pill label="Type" value={type} setValue={(v) => setType(v as any)} options={TYPES} />
          <Pill label="Continuity" value={continuity} setValue={(v) => setContinuity(v as any)} options={[...CONTINUITIES]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} lineages</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((l) => {
          const Icon = typeIcon(l.type);
          return (
            <button
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className="text-left rounded-xl border border-border bg-card p-5 hover-elevate relative overflow-hidden"
              data-testid={`card-lineage-${l.id}`}
            >
              <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: l.color }} />
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">
                  <Icon className="w-3 h-3" style={{ color: l.color }} />
                  {l.type}
                </span>
                <ImportanceBar value={l.importance} />
              </div>
              <div className="font-display text-base text-foreground leading-tight">{l.name}</div>
              <div className="text-xs text-muted-foreground italic mt-1 line-clamp-2">{l.summary}</div>
              <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                <ContinuityBadge value={l.continuity} />
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-foreground/85 font-display">{l.nodes.length} nodes</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && <LineageDrawer lineage={selected} onClose={() => setSelectedId(null)} />}
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

function LineageDrawer({ lineage: l, onClose }: { lineage: Lineage; onClose: () => void }) {
  const Icon = typeIcon(l.type);
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose} data-testid="lineage-detail-overlay">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-4xl bg-card border-l overflow-y-auto"
        style={{ borderLeftColor: l.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center justify-between px-4 md:px-7 pt-6 pb-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Genealogical Record</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-lineage">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              initials={getInitials(l.name, 2)}
              color={l.color}
              eyebrow={l.type}
              title={`${l.nodes.length} members`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-display">Importance</span>
                <ImportanceBar value={l.importance} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                <ContinuityBadge value={l.continuity} />
              </div>
            </VisualPlate>

            <div className="mt-5 w-full max-w-[240px] flex items-center justify-center gap-2 text-foreground/85">
              <Icon className="w-4 h-4" style={{ color: l.color }} />
              <span className="text-[11px] uppercase tracking-widest font-display">{l.type}</span>
            </div>
          </aside>

          <div className="min-w-0">
            <h2 className="font-display text-3xl text-foreground tracking-wide leading-tight">{l.name}</h2>
            <div className="text-sm text-muted-foreground italic mt-1">{l.summary}</div>

            <DrawerSection title="Description" excludeId={l.id}>{l.description}</DrawerSection>

            <div className="mt-6 rounded-lg border border-border bg-secondary/20 p-4" style={{ borderLeftColor: l.color, borderLeftWidth: 3 }}>
              <div className="text-[10px] uppercase tracking-[0.28em] font-display mb-2" style={{ color: l.color }}>Thematic Arc</div>
              <p className="text-sm leading-relaxed text-foreground/90 italic">{l.thematicArc}</p>
            </div>

            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3">Lineage Tree</div>
              <ol className="space-y-2.5">
                {l.nodes.map((node, i) => {
                  const c = node.characterId ? findCharacter(node.characterId) : null;
                  const align = alignmentColor(node.alignment);
                  const era = node.era ? findEra(node.era) : null;
                  return (
                    <li key={node.id} className="relative pl-9">
                      <span
                        className="absolute left-0 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-display"
                        style={{ borderColor: align, color: align, background: "var(--card)" }}
                      >
                        {i + 1}
                      </span>
                      {i < l.nodes.length - 1 && (
                        <span className="absolute left-[11px] top-9 bottom-[-10px] w-0.5" style={{ background: `${align}66` }} />
                      )}
                      <div className="rounded border border-border bg-secondary/30 px-3 py-2.5">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 justify-between">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {c ? (
                              <a
                                href={`#/characters`}
                                onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: c.id }); window.location.hash = "#/characters"; }}
                                className="text-sm font-display text-primary hover:underline"
                              >
                                {node.name}
                              </a>
                            ) : (
                              <span className="text-sm font-display text-foreground/90">{node.name}</span>
                            )}
                            {node.role && <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">· {node.role}</span>}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {node.alignment && node.alignment !== "None" && (
                              <span className="text-[9px] uppercase tracking-widest font-display px-1.5 py-0.5 rounded border" style={{ borderColor: `${align}88`, color: align }}>
                                {node.alignment}
                              </span>
                            )}
                            {era && (
                              <span className="text-[9px] uppercase tracking-widest font-display px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                                {era.shortName || era.name}
                              </span>
                            )}
                          </div>
                        </div>
                        {node.note && <div className="text-[11px] text-foreground/75 mt-1 leading-snug">{node.note}</div>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {l.notableEvents && l.notableEvents.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Notable Events</div>
                <ul className="space-y-1.5">
                  {l.notableEvents.map((e, i) => {
                    const era = findEra(e.era);
                    return (
                      <li key={i} className="flex items-start gap-3 rounded border border-border bg-secondary/30 px-3 py-2">
                        <span className="text-[9px] uppercase tracking-widest font-display whitespace-nowrap text-muted-foreground pt-0.5">
                          {era ? (era.shortName || era.name) : e.era}
                        </span>
                        <span className="text-sm text-foreground/85 leading-snug">{e.event}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {l.affiliations && l.affiliations.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Affiliations</div>
                <div className="flex flex-wrap gap-1.5">
                  {l.affiliations.map((fid) => {
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
          </div>
        </div>
      </div>
    </div>
  );
}

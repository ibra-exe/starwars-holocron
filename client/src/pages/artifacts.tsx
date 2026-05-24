import { useMemo, useState } from "react";
import { setPendingAnchor, useHashAnchor } from "@/lib/useHashAnchor";
import { ARTIFACTS, findArtifact, ArtifactCategory, Artifact, LightsaberColor } from "@/data/artifacts";
import { findCharacter } from "@/data/characters";
import { findFaction } from "@/data/factions";
import { PageHeader, ContinuityBadge, ImportanceBar } from "@/components/shared/Badges";
import DrawerSection from "@/components/shared/DrawerSection";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import { Search } from "lucide-react";

const CATEGORIES: Array<ArtifactCategory | "All"> = [
  "All",
  "Lightsaber",
  "Lightsaber Variant",
  "Sith Artifact",
  "Jedi Artifact",
  "Holocron",
  "Mandalorian Relic",
  "Force Artifact",
  "Weapon (Personal)",
  "Weapon (Heavy)",
  "Armor",
  "Helmet",
  "Mask",
  "Tool/Device",
  "Prophecy/Tome",
  "Crystal",
  "Other",
];

const CONTINUITIES = ["All", "Canon", "Legends", "Both"] as const;

const BLADE_HEX: Record<string, string> = {
  Blue: "#3aa7ff",
  Green: "#3fdc6e",
  Red: "#ff2c2c",
  Purple: "#a560ff",
  Yellow: "#ffd84d",
  White: "#f5f5f5",
  Orange: "#ff9a3c",
  Black: "#1a1a1a",
  Bronze: "#c08850",
  Cyan: "#5cdfff",
  Indigo: "#7c5cff",
  "Pink/Magenta": "#ff5ec4",
  Split: "linear-gradient(90deg,#ff2c2c 0%,#3aa7ff 100%)",
};

function bladeBg(color: LightsaberColor | undefined): string | null {
  if (!color) return null;
  return BLADE_HEX[color] || null;
}

export default function ArtifactsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ArtifactCategory | "All">("All");
  const [continuity, setContinuity] = useState<(typeof CONTINUITIES)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    return ARTIFACTS.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (continuity !== "All" && a.continuity !== continuity) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [a.name, a.type || "", a.origin, a.loreSignificance, a.description, (a.lightsaberColor || "")]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
  }, [search, category, continuity]);

  useHashAnchor(
    "/artifacts",
    (id) => setSelectedId(id),
    (id) => !!findArtifact(id),
  );

  const selected = selectedId ? findArtifact(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Codex"
        title="Weapons & Artifacts"
        description="Sabers, holocrons, masks, and relics that shaped the galaxy. Trace the Skywalker saber from Anakin to Rey, the Darksaber from Tarre Vizsla to Bo-Katan, and every cursed Sith artifact in between."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search artifacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-artifacts-search"
            />
          </div>
          <Pill label="Type" value={category} setValue={(v) => setCategory(v as any)} options={CATEGORIES} />
          <Pill label="Continuity" value={continuity} setValue={(v) => setContinuity(v as any)} options={[...CONTINUITIES]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} relics</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((a) => {
          const blade = bladeBg(a.lightsaberColor);
          return (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className="text-left rounded-xl border border-border bg-card p-5 hover-elevate relative overflow-hidden"
              data-testid={`card-artifact-${a.id}`}
            >
              <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: a.color }} />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">{a.category}</span>
                <ImportanceBar value={a.importance} />
              </div>
              <div className="font-display text-base text-foreground leading-tight">{a.name}</div>
              {a.type && <div className="text-xs text-muted-foreground italic mt-0.5">{a.type}</div>}
              {blade && (
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: blade, boxShadow: a.lightsaberColor !== "Black" ? `0 0 12px ${typeof blade === "string" && !blade.startsWith("linear") ? blade : "#fff"}66` : "none" }} />
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <ContinuityBadge value={a.continuity} />
                {a.lightsaberColor && a.lightsaberColor !== "Split" && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-foreground/85 font-display">{a.lightsaberColor} Blade</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && <ArtifactDrawer artifact={selected} onClose={() => setSelectedId(null)} />}
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

function ArtifactDrawer({ artifact: a, onClose }: { artifact: Artifact; onClose: () => void }) {
  const blade = bladeBg(a.lightsaberColor);
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose} data-testid="artifact-detail-overlay">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-4xl bg-card border-l overflow-y-auto"
        style={{ borderLeftColor: a.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center justify-between px-4 md:px-7 pt-6 pb-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Relic Dossier</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-artifact">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              initials={getInitials(a.name, 2)}
              color={a.color}
              eyebrow={a.category}
              title={a.type || a.origin}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-display">Importance</span>
                <ImportanceBar value={a.importance} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                <ContinuityBadge value={a.continuity} />
              </div>
            </VisualPlate>

            {blade && (
              <div className="mt-5 w-full max-w-[240px]">
                <div className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground font-display mb-1.5 text-center">Blade Signature</div>
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    background: blade,
                    boxShadow: a.lightsaberColor !== "Black" ? `0 0 22px ${typeof blade === "string" && !blade.startsWith("linear") ? blade : "#fff"}88, 0 0 6px #fff` : "0 0 8px #000",
                  }}
                />
                <div className="mt-1 text-center text-[10px] font-display tracking-widest uppercase text-foreground/80">{a.lightsaberColor}</div>
              </div>
            )}

            <dl className="mt-5 w-full max-w-[240px] grid grid-cols-1 gap-y-2 text-[10.5px] font-display">
              {a.material && <Stat label="Material" value={a.material} />}
              {a.creator && <Stat label="Creator" value={a.creator} />}
              <Stat label="Origin" value={a.origin} />
              {a.fate && <Stat label="Final Fate" value={a.fate} />}
            </dl>
          </aside>

          <div className="min-w-0">
            <h2 className="font-display text-3xl text-foreground tracking-wide leading-tight">{a.name}</h2>
            {a.type && <div className="text-sm text-muted-foreground italic mt-1">{a.type}</div>}

            <DrawerSection title="Description" excludeId={a.id}>{a.description}</DrawerSection>
            <DrawerSection title="Appearance" excludeId={a.id}>{a.appearance}</DrawerSection>
            <DrawerSection title="Function" excludeId={a.id}>{a.function}</DrawerSection>
            <DrawerSection title="Lore Significance" excludeId={a.id}>{a.loreSignificance}</DrawerSection>

            {a.abilities && a.abilities.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Powers & Abilities</div>
                <ul className="space-y-1 list-disc list-inside text-sm text-foreground/85">
                  {a.abilities.map((ab, i) => <li key={i}>{ab}</li>)}
                </ul>
              </div>
            )}

            {a.lineage && a.lineage.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Chain of Custody</div>
                <ol className="space-y-2">
                  {a.lineage.map((node, i) => {
                    const c = node.characterId ? findCharacter(node.characterId) : null;
                    return (
                      <li key={i} className="relative pl-7">
                        <span
                          className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-display"
                          style={{ borderColor: a.color, color: a.color, background: "var(--card)" }}
                        >
                          {i + 1}
                        </span>
                        {i < a.lineage!.length - 1 && (
                          <span className="absolute left-[9px] top-7 bottom-[-12px] w-0.5" style={{ background: `${a.color}55` }} />
                        )}
                        <div className="rounded border border-border bg-secondary/30 px-3 py-2">
                          {c ? (
                            <a
                              href={`#/characters`}
                              onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: c.id }); window.location.hash = "#/characters"; }}
                              className="text-sm text-primary hover:underline font-display"
                            >
                              {node.holder}
                            </a>
                          ) : (
                            <span className="text-sm text-foreground/90 font-display">{node.holder}</span>
                          )}
                          {node.note && <div className="text-[11px] text-muted-foreground italic mt-0.5">{node.note}</div>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {a.knownWielders && a.knownWielders.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Known Wielders</div>
                <div className="space-y-1.5">
                  {a.knownWielders.map((w, i) => {
                    const target = w.characterId ? findCharacter(w.characterId) : null;
                    return (
                      <div key={i} className="rounded border border-border bg-secondary/30 px-3 py-2 flex items-baseline justify-between gap-3">
                        {target ? (
                          <a
                            href={`#/characters`}
                            onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: target.id }); window.location.hash = "#/characters"; }}
                            className="text-sm text-primary hover:underline"
                          >
                            {w.name}
                          </a>
                        ) : (
                          <span className="text-sm text-foreground/90">{w.name}</span>
                        )}
                        {w.period && <span className="text-[11px] text-muted-foreground italic text-right">{w.period}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {a.affiliations && a.affiliations.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Affiliations</div>
                <div className="flex flex-wrap gap-1.5">
                  {a.affiliations.map((fid) => {
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

            {a.appearances && a.appearances.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Featured In</div>
                <div className="flex flex-wrap gap-1.5">
                  {a.appearances.map((m) => (
                    <span key={m} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {a.trivia && a.trivia.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Trivia</div>
                <ul className="space-y-1.5 list-disc list-inside text-sm text-foreground/85">
                  {a.trivia.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-border/60 pt-1.5">
      <dt className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] text-foreground/90 leading-tight">{value}</dd>
    </div>
  );
}

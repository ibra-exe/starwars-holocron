import { useMemo, useState, useCallback } from "react";
import { useSettings } from "@/lib/settings";
import { playR2Chirp } from "@/lib/sounds";
import { useHashAnchor } from "@/lib/useHashAnchor";
import { CHARACTERS, findCharacter } from "@/data/characters";
import { findFaction } from "@/data/factions";
import { findMedia } from "@/data/media";
import { ERAS } from "@/data/eras";
import { PageHeader, AlignmentBadge, ImportanceBar } from "@/components/shared/Badges";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import SmartText from "@/components/shared/SmartText";
import EntityLink from "@/components/shared/EntityLink";
import SpoilerVeil from "@/components/shared/SpoilerVeil";
import { isCharacterSpoiler, isDeathSpoiler } from "@/data/spoilers";
import { Character, ForceAlignment } from "@/data/types";
import { Search } from "lucide-react";
import { DrawerPortal } from "@/components/shared/DrawerPortal";

// Map Force alignment to a hex color for the portrait plate
const ALIGNMENT_COLOR: Record<ForceAlignment, string> = {
  Light: "#5aa9ff",     // jedi blue
  Dark: "#e44545",      // sith crimson
  Gray: "#9aa3ad",      // mando steel
  Balance: "#f0c14b",   // saga gold
  None: "#8a8f95",
  Corrupted: "#7a1818", // deep sith
  Redeemed: "#7fc7a8",  // redemption green-blue
};

const CATEGORIES = [
  "All",
  "Jedi",
  "Sith",
  "Mandalorian",
  "Bounty Hunter",
  "Clone",
  "Senator",
  "Smuggler",
  "Crime",
  "Inquisitor",
  "Nightsister",
  "Droid",
  "Imperial",
  "Rebel",
  "Resistance",
  "First Order",
  "Civilian",
  "Other",
] as const;

const ALIGNMENTS: Array<ForceAlignment | "All"> = [
  "All",
  "Light",
  "Dark",
  "Gray",
  "Balance",
  "None",
  "Corrupted",
  "Redeemed",
];

export default function CharactersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [alignment, setAlignment] = useState<ForceAlignment | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { sounds } = useSettings();
  const openCard = useCallback((id: string) => { setSelectedId(id); if (sounds) playR2Chirp(); }, [sounds]);

  const items = useMemo(() => {
    return CHARACTERS.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (alignment !== "All" && c.forceAlignment !== alignment) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = [c.name, ...(c.aliases ?? []), c.species, c.bio].join(" ").toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
  }, [search, category, alignment]);

  useHashAnchor(
    "/characters",
    (id) => setSelectedId(id),
    (id) => !!findCharacter(id),
  );

  const selected = selectedId ? findCharacter(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Codex"
        title="Character Intelligence"
        description="Every major figure across the saga — with their lineage, affiliations, and the loyalty arcs that defined them."
      />

      <div className="sticky top-0 sticky-below-header z-20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search characters…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-character-search"
            />
          </div>
          <Pill label="Category" value={category} setValue={(v) => setCategory(v as any)} options={[...CATEGORIES]} />
          <Pill label="Alignment" value={alignment} setValue={(v) => setAlignment(v as any)} options={ALIGNMENTS} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} profiles</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((c) => {
          const cardColor = ALIGNMENT_COLOR[c.forceAlignment] || "#f0c14b";
          return (
            <button
              key={c.id}
              onClick={() => openCard(c.id)}
              className="text-left rounded-xl border border-border bg-card p-4 hover-elevate"
              data-testid={`card-character-${c.id}`}
            >
              <div className="flex items-start gap-3 mb-2.5">
                <CharacterAvatar character={c} color={cardColor} />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display truncate">{c.category}</span>
                    <ImportanceBar value={c.importance} />
                  </div>
                  <div className="font-display text-[13px] text-foreground leading-tight">{c.name}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground italic">{c.species}{c.homeworld ? ` · ${c.homeworld}` : ""}</div>
              {c.rank && <div className="text-[11px] text-foreground/70 mt-1 truncate">{c.rank}</div>}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <AlignmentBadge value={c.forceAlignment} />
                {c.forceSensitive && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-primary/40 text-primary font-display">Force-Sensitive</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && <CharacterDrawer character={selected} onClose={() => setSelectedId(null)} onSelect={(id) => openCard(id)} />}
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

function CharacterAvatar({ character: c, color }: { character: Character; color: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(c.name, 2);
  const gradient = `radial-gradient(circle at 35% 30%, ${color}cc 0%, ${color}55 45%, ${color}22 80%)`;

  return (
    <div
      className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-[13px] font-display font-bold select-none"
      style={{
        background: (c.imageUrl && !imgError) ? "transparent" : gradient,
        color,
        border: `1.5px solid ${color}66`,
        boxShadow: `0 0 10px ${color}33`,
      }}
    >
      {c.imageUrl && !imgError ? (
        <img
          src={c.imageUrl}
          alt=""
          onError={() => setImgError(true)}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth === 300 && img.naturalHeight === 171) setImgError(true);
          }}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        initials
      )}
    </div>
  );
}

function CharacterDrawer({ character: c, onClose, onSelect }: { character: Character; onClose: () => void; onSelect: (id: string) => void }) {
  const plateColor = ALIGNMENT_COLOR[c.forceAlignment] || "#f0c14b";
  return (
    <DrawerPortal>
    <div className="fixed inset-0 z-50 flex" onClick={onClose} data-testid="character-detail-overlay">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-4xl bg-card border-l border-border overflow-y-auto overscroll-y-contain"
        style={{ borderLeftColor: plateColor, borderLeftWidth: 4 }}
      >
        <div className="flex items-center justify-between px-4 md:px-7 pb-2 detail-panel-header" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Character Dossier</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-character">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          {/* Portrait plate column */}
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              imageUrl={c.imageUrl}
              initials={getInitials(c.name, 2)}
              color={plateColor}
              eyebrow={c.category}
              title={c.rank || c.status}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-display">Importance</span>
                <ImportanceBar value={c.importance} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                <AlignmentBadge value={c.forceAlignment} />
                {c.forceSensitive && (
                  <span className="text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded border border-primary/40 text-primary font-mono">Force-Sensitive</span>
                )}
              </div>
            </VisualPlate>

            <dl className="mt-5 w-full max-w-[240px] grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px] font-display">
              <CStat label="Species" value={c.species} colSpan />
              {c.homeworld && <CStat label="Homeworld" value={c.homeworld} colSpan />}
              {c.born && <CStat label="Born" value={c.born} />}
              {c.died && (isDeathSpoiler(c.id) ? (
                <div className="flex flex-col gap-0.5 border-t border-border/60 pt-1.5">
                  <dt className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">Died</dt>
                  <dd className="text-[11px] text-foreground/90 leading-tight">
                    <SpoilerVeil id={`char-died-${c.id}`} inline label="Spoiler">{c.died}</SpoilerVeil>
                  </dd>
                </div>
              ) : <CStat label="Died" value={c.died} />)}
              <CStat label="Status" value={c.status} colSpan />
            </dl>
          </aside>

          {/* Content column */}
          <div className="min-w-0">
          <h2 className="font-display text-3xl text-foreground tracking-wide leading-tight">{c.name}</h2>
          {c.aliases && c.aliases.length > 0 && (
            <div className="text-sm text-muted-foreground mt-1 italic">aka {c.aliases.join(" · ")}</div>
          )}

          <div className="mt-6">
            {isCharacterSpoiler(c.id) ? (
              <SpoilerVeil id={`char-bio-${c.id}`} label={`Spoiler dossier — ${c.name}`}>
                <p className="text-sm leading-relaxed text-foreground/85">
                  <SmartText text={c.bio} excludeId={c.id} maxLinks={12} />
                </p>
              </SpoilerVeil>
            ) : (
              <p className="text-sm leading-relaxed text-foreground/85">
                <SmartText text={c.bio} excludeId={c.id} maxLinks={12} />
              </p>
            )}
            {c.notableQuote && (
              <blockquote className="mt-5 border-l-2 border-primary pl-4 italic text-sm text-foreground/85 font-serif">
                "<SmartText text={c.notableQuote} excludeId={c.id} maxLinks={3} />"
              </blockquote>
            )}
          </div>

          {/* Loyalty timeline */}
          {c.loyaltyTimeline.length > 0 && (
            <div className="mt-7">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3">Loyalty Timeline</div>
              <ol className="relative border-l-2 border-border ml-2 space-y-3 pl-5">
                {c.loyaltyTimeline.map((stage, i) => {
                  const era = ERAS.find((e) => e.id === stage.era);
                  return (
                    <li key={i} className="relative">
                      <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full" style={{ background: era?.color || "#aaa" }} />
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">{era?.shortName || stage.era}</div>
                      <div className="text-sm text-foreground/90">{stage.label}</div>
                      <div className="text-xs text-primary">{stage.alignment}</div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {/* Affiliations */}
          {c.affiliations.length > 0 && (
            <div className="mt-7">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3">Affiliations</div>
              <div className="space-y-1.5">
                {c.affiliations.map((a, i) => {
                  const f = findFaction(a.faction);
                  return (
                    <div key={i} className="flex items-center justify-between text-sm border border-border rounded px-3 py-2 bg-secondary/30">
                      <div>
                        <EntityLink id={a.faction} kind="faction" className="font-medium">
                          {f?.name || a.faction}
                        </EntityLink>
                        {a.role && <span className="text-muted-foreground"> · {a.role}</span>}
                      </div>
                      {(a.from || a.to) && (
                        <span className="text-xs text-muted-foreground font-display tracking-wider">
                          {a.from || "?"} → {a.to || "ongoing"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Relations */}
          {(c.master || (c.apprentices && c.apprentices.length) || (c.family && c.family.length) || (c.rivals && c.rivals.length)) && (
            <div className="mt-7 grid grid-cols-2 gap-5">
              {c.master && (
                <Relation label="Master" items={[c.master]} onSelect={onSelect} />
              )}
              {c.apprentices && c.apprentices.length > 0 && (
                <Relation label="Apprentices" items={c.apprentices} onSelect={onSelect} />
              )}
              {c.family && c.family.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Family</div>
                  <div className="space-y-1">
                    {c.family.map((f, i) => {
                      const target = findCharacter(f.characterId);
                      return (
                        <button key={i} onClick={() => onSelect(f.characterId)} className="block text-sm text-foreground/85 hover:text-primary" data-testid={`relation-${f.characterId}`}>
                          <span className="text-muted-foreground">{f.relation}: </span>
                          {target?.name || f.characterId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {c.rivals && c.rivals.length > 0 && (
                <Relation label="Rivals" items={c.rivals} onSelect={onSelect} />
              )}
            </div>
          )}

          {/* Appearances */}
          {c.appearances.length > 0 && (
            <div className="mt-7">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3">Notable Appearances</div>
              <div className="flex flex-wrap gap-1.5">
                {c.appearances.map((mid) => {
                  const m = findMedia(mid);
                  if (!m) {
                    return (
                      <span key={mid} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{mid}</span>
                    );
                  }
                  return (
                    <EntityLink key={mid} id={mid} kind="media" className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 hover:border-[hsl(var(--jedi))]">
                      {m.title}
                    </EntityLink>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
    </DrawerPortal>
  );
}

function CStat({ label, value, colSpan }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 border-t border-border/60 pt-1.5 ${colSpan ? "col-span-2" : ""}`}>
      <dt className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] text-foreground/90 leading-tight">{value}</dd>
    </div>
  );
}

function Relation({ label, items, onSelect }: { label: string; items: string[]; onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">{label}</div>
      <div className="space-y-1">
        {items.map((id) => {
          const c = findCharacter(id);
          return (
            <button key={id} onClick={() => onSelect(id)} className="block text-sm text-foreground/85 hover:text-primary text-left" data-testid={`relation-${id}`}>
              {c?.name || id}
            </button>
          );
        })}
      </div>
    </div>
  );
}

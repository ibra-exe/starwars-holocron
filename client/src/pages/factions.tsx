import { useMemo, useState } from "react";
import { DrawerPortal } from "@/components/shared/DrawerPortal";
import { setPendingAnchor, useHashAnchor } from "@/lib/useHashAnchor";
import { FACTIONS, findFaction } from "@/data/factions";
import { findCharacter } from "@/data/characters";
import { ERAS } from "@/data/eras";
import { PageHeader } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import { Faction } from "@/data/types";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Government", "Religious Order", "Military", "Rebellion", "Criminal", "Corporate", "Culture", "Cult", "Guild", "Clan", "Other"] as const;
const ALIGNMENTS = ["All", "Light", "Dark", "Neutral", "Mixed"] as const;

export default function FactionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [alignment, setAlignment] = useState<(typeof ALIGNMENTS)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    return FACTIONS.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (alignment !== "All" && f.alignment !== alignment) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!f.name.toLowerCase().includes(s) && !f.description.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [search, category, alignment]);

  useHashAnchor(
    "/factions",
    (id) => setSelectedId(id),
    (id) => !!findFaction(id),
  );

  const selected = selectedId ? findFaction(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Encyclopedia"
        title="Factions of the Galaxy"
        description="Religious orders, governments, rebellions, criminal syndicates — every major power and how they rose and fell."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search factions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-faction-search"
            />
          </div>
          <Pill label="Category" value={category} setValue={(v) => setCategory(v as any)} options={[...CATEGORIES]} />
          <Pill label="Alignment" value={alignment} setValue={(v) => setAlignment(v as any)} options={[...ALIGNMENTS]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} factions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedId(f.id)}
            className="text-left rounded-xl border border-border bg-card p-4 hover-elevate relative overflow-hidden"
            data-testid={`card-faction-${f.id}`}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: f.color }} />
            <div className="flex items-start gap-3 mb-2">
              <FactionEmblem logoUrl={f.logoUrl} color={f.color} name={f.name} />
              <div className="flex-1 min-w-0 pt-0.5">
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">{f.category}</span>
                <div className="font-display text-[13px] text-foreground leading-tight mt-0.5">{f.name}</div>
              </div>
            </div>
            <p className="text-xs text-foreground/75 leading-relaxed line-clamp-2">{f.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-foreground/85 font-display">{f.alignment}</span>
              {f.founded && <span className="text-[10px] text-muted-foreground font-display">{f.founded}</span>}
            </div>
          </button>
        ))}
      </div>

      {selected && <FactionDrawer faction={selected} onClose={() => setSelectedId(null)} onSelectFaction={setSelectedId} />}
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

function FactionDrawer({ faction: f, onClose, onSelectFaction }: { faction: Faction; onClose: () => void; onSelectFaction: (id: string) => void }) {
  // Pick a single glyph for the plate if the symbol field looks like one (length ≤ 3) — otherwise fallback to initials.
  const symbolGlyph = f.symbol && f.symbol.trim().length > 0 && f.symbol.trim().length <= 3 ? f.symbol.trim() : undefined;
  return (
    <DrawerPortal>
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-4xl bg-card border-l border-border overflow-y-auto overscroll-y-contain" style={{ borderLeftColor: f.color, borderLeftWidth: 4 }}>
        <div className="flex items-center justify-between px-4 md:px-7 pb-2" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Faction Dossier</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-faction">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          {/* Sigil column */}
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              imageUrl={f.logoUrl}
              imageObjectFit="contain"
              symbol={!f.logoUrl ? symbolGlyph : undefined}
              initials={!f.logoUrl && !symbolGlyph ? getInitials(f.shortName || f.name, 2) : undefined}
              color={f.color}
              eyebrow={f.category}
              title={f.alignment + (f.shortName ? ` · ${f.shortName}` : "")}
            />

            {/* Quick stats */}
            <dl className="mt-5 w-full max-w-[240px] grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px] font-display">
              {f.founded && <FStat label="Founded" value={f.founded} />}
              {f.dissolved && <FStat label="Dissolved" value={f.dissolved} />}
              <FStat label="Alignment" value={f.alignment} colSpan />
            </dl>
          </aside>

          {/* Content column */}
          <div className="min-w-0">
          <h2 className="font-display text-3xl text-foreground tracking-wide mb-2 leading-tight">{f.name}</h2>
          {f.shortName && <div className="text-sm text-muted-foreground italic mb-2">{f.shortName}</div>}

          <div className="mt-5">
            <p className="text-sm leading-relaxed text-foreground/85"><SmartText text={f.description} excludeId={f.id} maxLinks={12} /></p>
          </div>

          <Section title="Ideology"><p className="text-sm leading-relaxed text-foreground/80"><SmartText text={f.ideology} excludeId={f.id} /></p></Section>
          <Section title="Philosophy"><p className="text-sm leading-relaxed text-foreground/80"><SmartText text={f.philosophy} excludeId={f.id} /></p></Section>
          <Section title="Structure"><p className="text-sm leading-relaxed text-foreground/80"><SmartText text={f.structure} excludeId={f.id} /></p></Section>

          {f.ranks && f.ranks.length > 0 && (
            <Section title="Ranks & Hierarchy">
              <ol className="relative space-y-2.5">
                {f.ranks.map((r, i) => {
                  const target = r.holderCharacterId ? findCharacter(r.holderCharacterId) : null;
                  return (
                    <li
                      key={i}
                      className="relative rounded-lg border border-border bg-secondary/30 pl-12 pr-3 py-2.5"
                      style={{ borderLeftColor: f.color, borderLeftWidth: 3 }}
                      data-testid={`rank-${f.id}-${i}`}
                    >
                      {/* Tier insignia disc */}
                      <div
                        className="absolute left-3 top-2.5 w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] font-bold"
                        style={{
                          background: `radial-gradient(circle at 35% 30%, ${f.color}cc 0%, ${f.color}44 70%, hsl(var(--background)) 100%)`,
                          color: f.color,
                          border: `1px solid ${f.color}88`,
                          textShadow: `0 0 8px ${f.color}aa`,
                          boxShadow: `0 0 10px ${f.color}33, inset 0 0 0 1px hsl(var(--gold) / 0.35)`,
                        }}
                        aria-hidden
                      >
                        {r.tier !== undefined ? r.tier : i + 1}
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="font-display text-sm text-foreground/95 leading-tight">{r.title}</div>
                        {r.tier !== undefined && (
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display shrink-0">
                            Tier {r.tier}
                          </span>
                        )}
                      </div>
                      {(r.holder || target) && (
                        <div className="mt-1 text-[11px] text-foreground/75">
                          <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-display mr-1.5">Held by</span>
                          {target ? (
                            <a
                              href={`#/characters`}
                              className="text-primary hover:underline"
                              onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: target.id }); window.location.hash = "#/characters"; }}
                              data-testid={`rank-holder-${target.id}`}
                            >
                              {target.name}
                            </a>
                          ) : (
                            <span>{r.holder}</span>
                          )}
                        </div>
                      )}
                      <p className="mt-1.5 text-xs text-foreground/75 leading-relaxed">{r.description}</p>
                    </li>
                  );
                })}
              </ol>
            </Section>
          )}

          {f.leadership && f.leadership.length > 0 && (
            <Section title="Leadership">
              <ul className="space-y-1.5">
                {f.leadership.map((l, i) => (
                  <li key={i} className="text-sm text-foreground/85 flex justify-between gap-3 border border-border rounded px-3 py-2 bg-secondary/30">
                    <span>{l.name}</span>
                    {l.period && <span className="text-xs text-muted-foreground font-display tracking-wider">{l.period}</span>}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {f.militaryBranches && f.militaryBranches.length > 0 && (
            <Section title="Military / Branches">
              <div className="flex flex-wrap gap-1.5">
                {f.militaryBranches.map((b) => (
                  <span key={b} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{b}</span>
                ))}
              </div>
            </Section>
          )}

          {f.riseAndFall && f.riseAndFall.length > 0 && (
            <Section title="Rise &amp; Fall">
              <ol className="relative border-l-2 border-border ml-2 space-y-3 pl-5">
                {f.riseAndFall.map((stage, i) => {
                  const era = ERAS.find((e) => e.id === stage.era);
                  return (
                    <li key={i} className="relative">
                      <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full" style={{ background: era?.color || "#aaa" }} />
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">{era?.shortName || stage.era}</div>
                      <div className="text-sm text-foreground/90">{stage.event}</div>
                    </li>
                  );
                })}
              </ol>
            </Section>
          )}

          {f.importantEvents && f.importantEvents.length > 0 && (
            <Section title="Important Events">
              <ul className="space-y-1.5">
                {f.importantEvents.map((e) => (
                  <li key={e} className="text-sm text-foreground/85 flex gap-2"><span className="text-primary">•</span>{e}</li>
                ))}
              </ul>
            </Section>
          )}

          {(f.enemies.length > 0 || f.allies.length > 0) && (
            <Section title="Diplomacy">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--sith))] font-display mb-1">Enemies</div>
                  <div className="flex flex-wrap gap-1">
                    {f.enemies.map((id) => {
                      const t = findFaction(id);
                      return (
                        <button key={id} onClick={() => onSelectFaction(id)} className="text-[11px] px-2 py-0.5 rounded border border-[hsl(var(--sith)/0.4)] text-foreground/85 hover:text-[hsl(var(--sith))]">{t?.name || id}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--jedi))] font-display mb-1">Allies</div>
                  <div className="flex flex-wrap gap-1">
                    {f.allies.map((id) => {
                      const t = findFaction(id);
                      return (
                        <button key={id} onClick={() => onSelectFaction(id)} className="text-[11px] px-2 py-0.5 rounded border border-[hsl(var(--jedi)/0.4)] text-foreground/85 hover:text-[hsl(var(--jedi))]">{t?.name || id}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Section>
          )}
          </div>
        </div>
      </div>
    </div>
    </DrawerPortal>
  );
}

function FactionEmblem({ logoUrl, color, name }: { logoUrl?: string; color: string; name: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name, 2);
  const gradient = `radial-gradient(circle at 35% 30%, ${color}cc 0%, ${color}55 45%, ${color}22 80%)`;
  return (
    <div
      className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-[13px] font-display font-bold select-none"
      style={{ background: (logoUrl && !imgError) ? `${color}18` : gradient, color, border: `1.5px solid ${color}66`, boxShadow: `0 0 10px ${color}33` }}
    >
      {logoUrl && !imgError ? (
        <img src={logoUrl} alt="" onError={() => setImgError(true)}
          onLoad={(e) => { const img = e.currentTarget; if (img.naturalWidth === 300 && img.naturalHeight === 171) setImgError(true); }}
          className="w-8 h-8 object-contain" />
      ) : <span>{initials}</span>}
    </div>
  );
}

function FStat({ label, value, colSpan }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 border-t border-border/60 pt-1.5 ${colSpan ? "col-span-2" : ""}`}>
      <dt className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</dt>
      <dd className="text-[11px] text-foreground/90 leading-tight">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">{title}</div>
      {children}
    </div>
  );
}

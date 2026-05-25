import { useMemo, useState } from "react";
import { DrawerPortal } from "@/components/shared/DrawerPortal";
import { setPendingAnchor, useHashAnchor } from "@/lib/useHashAnchor";
import { SPECIES, findSpecies, SpeciesClassification, Species } from "@/data/species";
import { findCharacter } from "@/data/characters";
import { findFaction } from "@/data/factions";
import { PageHeader, ContinuityBadge, ImportanceBar } from "@/components/shared/Badges";
import DrawerSection from "@/components/shared/DrawerSection";
import { VisualPlate, getInitials } from "@/components/shared/VisualPlate";
import { Search } from "lucide-react";

const CLASSIFICATIONS: Array<SpeciesClassification | "All"> = [
  "All",
  "Humanoid",
  "Near-Human",
  "Mammalian",
  "Reptilian",
  "Amphibian",
  "Insectoid",
  "Avian",
  "Cetacean",
  "Saurian",
  "Symbiote",
  "Force Entity",
  "Sentient Plant",
  "Artificial",
];

const CONTINUITIES = ["All", "Canon", "Legends", "Both"] as const;

export default function SpeciesPage() {
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState<SpeciesClassification | "All">("All");
  const [continuity, setContinuity] = useState<(typeof CONTINUITIES)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    return SPECIES.filter((s) => {
      if (classification !== "All" && s.classification !== classification) return false;
      if (continuity !== "All" && s.continuity !== continuity) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [s.name, s.homeworld, s.appearance, s.society, s.cultureAndReligion, s.roleInGalaxy, s.biology]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
  }, [search, classification, continuity]);

  useHashAnchor(
    "/species",
    (id) => setSelectedId(id),
    (id) => !!findSpecies(id),
  );

  const selected = selectedId ? findSpecies(selectedId) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Compendium"
        title="Species of the Galaxy"
        description="A xenobiologist's atlas — every major sentient species across Canon and Legends, with biology, society, Force connection, and the figures they produced."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search species…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-species-search"
            />
          </div>
          <Pill label="Classification" value={classification} setValue={(v) => setClassification(v as any)} options={CLASSIFICATIONS} />
          <Pill label="Continuity" value={continuity} setValue={(v) => setContinuity(v as any)} options={[...CONTINUITIES]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} species</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className="text-left rounded-xl border border-border bg-card p-4 hover-elevate relative overflow-hidden"
            data-testid={`card-species-${s.id}`}
          >
            <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: s.color }} />
            <div className="flex items-start gap-3 mb-2">
              <EntityAvatar imageUrl={s.imageUrl} color={s.color} name={s.name} />
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display truncate">{s.classification}</span>
                  <ImportanceBar value={s.importance} />
                </div>
                <div className="font-display text-[13px] text-foreground leading-tight">{s.name}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground italic">{s.homeworld}</div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <ContinuityBadge value={s.continuity} />
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-border text-foreground/85 font-display">{s.diet}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && <SpeciesDrawer species={selected} onClose={() => setSelectedId(null)} onSelectSpecies={setSelectedId} />}
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

function SpeciesDrawer({ species: s, onClose, onSelectSpecies }: { species: Species; onClose: () => void; onSelectSpecies: (id: string) => void }) {
  return (
    <DrawerPortal>
    <div className="fixed inset-0 z-50 flex" onClick={onClose} data-testid="species-detail-overlay">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-4xl bg-card border-l overflow-y-auto overscroll-y-contain"
        style={{ borderLeftColor: s.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center justify-between px-4 md:px-7 pb-2" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">Specimen Record</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-species">×</button>
        </div>

        <div className="px-4 md:px-7 pb-8 md:grid md:grid-cols-[260px_1fr] md:gap-7">
          {/* Visual plate column */}
          <aside className="md:sticky md:top-4 self-start flex flex-col items-center py-4">
            <VisualPlate
              imageUrl={s.imageUrl}
              initials={getInitials(s.name, 2)}
              color={s.color}
              eyebrow={s.classification}
              title={s.homeworld}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-display">Importance</span>
                <ImportanceBar value={s.importance} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                <ContinuityBadge value={s.continuity} />
              </div>
            </VisualPlate>

            {/* Quick stats */}
            <dl className="mt-5 w-full max-w-[240px] grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px] font-display">
              <Stat label="Diet" value={s.diet} />
              {s.averageHeight && <Stat label="Height" value={s.averageHeight} />}
              {s.averageLifespan && <Stat label="Lifespan" value={s.averageLifespan} />}
              {s.language && <Stat label="Language" value={s.language} colSpan />}
            </dl>
          </aside>

          {/* Content column */}
          <div className="min-w-0">
            <h2 className="font-display text-3xl text-foreground tracking-wide leading-tight">{s.name}</h2>
            <div className="text-sm text-muted-foreground italic mt-1">{s.homeworld}</div>

          <DrawerSection title="Appearance" excludeId={s.id}>{s.appearance}</DrawerSection>
          <DrawerSection title="Biology" excludeId={s.id}>{s.biology}</DrawerSection>
          <DrawerSection title="Society" excludeId={s.id}>{s.society}</DrawerSection>
          <DrawerSection title="Culture & Religion" excludeId={s.id}>{s.cultureAndReligion}</DrawerSection>
          <DrawerSection title="Connection to the Force" excludeId={s.id}>{s.forceConnection}</DrawerSection>
          <DrawerSection title="Role in the Galaxy" excludeId={s.id}>{s.roleInGalaxy}</DrawerSection>

          {s.notableIndividuals && s.notableIndividuals.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Notable Individuals</div>
              <div className="space-y-1.5">
                {s.notableIndividuals.map((p, i) => {
                  const target = p.characterId ? findCharacter(p.characterId) : null;
                  return (
                    <div key={i} className="rounded border border-border bg-secondary/30 px-3 py-2 flex items-baseline justify-between gap-3">
                      {target ? (
                        <a
                          href={`#/characters`}
                          onClick={(e) => { e.preventDefault(); setPendingAnchor({ page: "/characters", id: target.id }); window.location.hash = "#/characters"; }}
                          className="text-sm text-primary hover:underline"
                          data-testid={`species-individual-${target.id}`}
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

          {s.factions && s.factions.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Associated Factions</div>
              <div className="flex flex-wrap gap-1.5">
                {s.factions.map((fid) => {
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
                      data-testid={`species-faction-${fid}`}
                    >
                      {f.name}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {s.notableWorlds && s.notableWorlds.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Notable Worlds</div>
              <div className="flex flex-wrap gap-1.5">
                {s.notableWorlds.map((w) => (
                  <span key={w} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85">{w}</span>
                ))}
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

function EntityAvatar({ imageUrl, color, name }: { imageUrl?: string; color: string; name: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name, 2);
  const gradient = `radial-gradient(circle at 35% 30%, ${color}cc 0%, ${color}55 45%, ${color}22 80%)`;
  return (
    <div
      className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden text-[13px] font-display font-bold select-none"
      style={{ background: (imageUrl && !imgError) ? "transparent" : gradient, color, border: `1.5px solid ${color}66`, boxShadow: `0 0 10px ${color}33` }}
    >
      {imageUrl && !imgError ? (
        <img src={imageUrl} alt="" onError={() => setImgError(true)}
          onLoad={(e) => { const img = e.currentTarget; if (img.naturalWidth === 300 && img.naturalHeight === 171) setImgError(true); }}
          className="w-full h-full object-cover object-top" />
      ) : <span>{initials}</span>}
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

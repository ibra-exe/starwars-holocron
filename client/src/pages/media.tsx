import { useMemo, useState } from "react";
import { DrawerPortal } from "@/components/shared/DrawerPortal";
import { useHashAnchor } from "@/lib/useHashAnchor";
import { MEDIA } from "@/data/media";
import { ERAS } from "@/data/eras";
import { PageHeader, ContinuityBadge, EssentialityBadge, ImportanceBar, MediaTypeBadge } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";
import { Continuity, Essentiality, EraId, MediaType } from "@/data/types";
import { Search } from "lucide-react";

const TYPES: MediaType[] = [
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

const ESS: Essentiality[] = ["Essential", "Recommended", "Supplemental", "Deep Lore", "Optional"];

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const [continuity, setContinuity] = useState<Continuity | "All">("All");
  const [type, setType] = useState<MediaType | "All">("All");
  const [era, setEra] = useState<EraId | "All">("All");
  const [ess, setEss] = useState<Essentiality | "All">("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string | null>(null);

  useHashAnchor(
    "/media",
    (id) => setSelected(id),
    (id) => MEDIA.some((m) => m.id === id),
  );

  const items = useMemo(() => {
    return MEDIA.filter((m) => {
      if (continuity !== "All" && m.continuity !== continuity && m.continuity !== "Both") return false;
      if (type !== "All" && m.type !== type) return false;
      if (ess !== "All" && m.essentiality !== ess) return false;
      if (era !== "All") {
        const eras = Array.isArray(m.era) ? m.era : [m.era];
        if (!eras.includes(era)) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (!m.title.toLowerCase().includes(s) && !m.summary.toLowerCase().includes(s)) return false;
      }
      return true;
    }).sort((a, b) => b.importance - a.importance || a.inUniverseSortKey - b.inUniverseSortKey);
  }, [continuity, type, era, ess, search]);

  const selectedMedia = selected ? MEDIA.find((m) => m.id === selected) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Library"
        title="Media Library"
        description="Every film, series, novel, comic, game, audio drama, and reference work — classified by essentiality, era, and continuity."
      />

      <div className="sticky top-0 z-20 -mx-8 px-8 py-4 mb-8 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search media…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md bg-input border border-border text-sm w-64 focus:border-primary focus:outline-none"
              data-testid="input-media-search"
            />
          </div>
          <Pill label="Continuity" value={continuity} setValue={setContinuity} options={["All", "Canon", "Legends"]} />
          <Pill label="Type" value={type} setValue={setType} options={["All", ...TYPES]} />
          <Pill label="Era" value={era} setValue={setEra} options={["All", ...ERAS.map((e) => e.id)]} labels={{ All: "All Eras", ...Object.fromEntries(ERAS.map((e) => [e.id, e.shortName])) }} />
          <Pill label="Essentiality" value={ess} setValue={setEss} options={["All", ...ESS]} />
          <div className="ml-auto text-xs text-muted-foreground font-display tracking-widest uppercase">{items.length} entries</div>
          <div className="flex rounded-md border border-border overflow-hidden">
            <button onClick={() => setView("grid")} data-testid="button-view-grid" className={`px-3 py-1.5 text-xs uppercase tracking-widest font-display ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              Grid
            </button>
            <button onClick={() => setView("list")} data-testid="button-view-list" className={`px-3 py-1.5 text-xs uppercase tracking-widest font-display ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              List
            </button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className="text-left rounded-xl border border-border bg-card p-5 hover-elevate"
              data-testid={`card-media-${m.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <MediaTypeBadge value={m.type} />
                <ImportanceBar value={m.importance} />
              </div>
              <div className="font-display text-base text-foreground mb-1 leading-tight">{m.title}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary font-display mb-3">{m.inUniverseDate} · {m.releaseYear}</div>
              <p className="text-xs text-foreground/75 leading-relaxed line-clamp-3 mb-3"><SmartText text={m.summary} excludeId={m.id} maxLinks={4} /></p>
              <div className="flex flex-wrap gap-1.5">
                <ContinuityBadge value={m.continuity} />
                <EssentialityBadge value={m.essentiality} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-secondary text-xs uppercase tracking-widest text-muted-foreground font-display">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 w-32">Type</th>
                <th className="text-left px-4 py-3 w-32">In-Universe</th>
                <th className="text-left px-4 py-3 w-28">Year</th>
                <th className="text-left px-4 py-3 w-32">Continuity</th>
                <th className="text-left px-4 py-3 w-36">Essentiality</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t border-border hover-elevate cursor-pointer" onClick={() => setSelected(m.id)} data-testid={`row-media-${m.id}`}>
                  <td className="px-4 py-3 font-medium">{m.title}</td>
                  <td className="px-4 py-3"><MediaTypeBadge value={m.type} /></td>
                  <td className="px-4 py-3 text-primary font-display">{m.inUniverseDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.releaseYear}</td>
                  <td className="px-4 py-3"><ContinuityBadge value={m.continuity} /></td>
                  <td className="px-4 py-3"><EssentialityBadge value={m.essentiality} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center text-muted-foreground py-16 font-display tracking-widest uppercase text-sm">No matches in this archive.</div>
      )}

      {/* Detail drawer */}
      {selectedMedia && (
        <DrawerPortal>
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelected(null)} data-testid="media-detail-overlay">
          <div className="flex-1 bg-background/70 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-xl bg-card border-l border-border overflow-y-auto overscroll-y-contain"
          >
            <div className="p-6" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">{selectedMedia.type}</span>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-2xl leading-none" data-testid="button-close-media">×</button>
              </div>
              <h2 className="font-display text-2xl text-foreground mb-2">{selectedMedia.title}</h2>
              <div className="text-[10px] uppercase tracking-widest text-primary font-display mb-4">{selectedMedia.inUniverseDate} · Released {selectedMedia.releaseYear}</div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                <ContinuityBadge value={selectedMedia.continuity} />
                <EssentialityBadge value={selectedMedia.essentiality} />
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed mb-5">{selectedMedia.summary}</p>
              {(selectedMedia.director || selectedMedia.creator || selectedMedia.author) && (
                <div className="text-xs text-muted-foreground mb-5 space-y-1">
                  {selectedMedia.director && <div><span className="uppercase tracking-widest mr-2">Director</span>{selectedMedia.director}</div>}
                  {selectedMedia.creator && <div><span className="uppercase tracking-widest mr-2">Creator</span>{selectedMedia.creator}</div>}
                  {selectedMedia.author && <div><span className="uppercase tracking-widest mr-2">Author</span>{selectedMedia.author}</div>}
                </div>
              )}
              {selectedMedia.events && selectedMedia.events.length > 0 && (
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">Key Events</div>
                  <ul className="space-y-1 text-sm text-foreground/85">
                    {selectedMedia.events.map((e) => (
                      <li key={e} className="flex gap-2"><span className="text-primary">•</span>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2 mt-6">Importance</div>
              <ImportanceBar value={selectedMedia.importance} />
            </div>
          </div>
        </div>
        </DrawerPortal>
      )}
    </div>
  );
}

function Pill<T extends string>({ label, value, setValue, options, labels }: { label: string; value: T; setValue: (v: T) => void; options: T[]; labels?: Record<string, string> }) {
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
          <option key={o} value={o}>
            {labels?.[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}

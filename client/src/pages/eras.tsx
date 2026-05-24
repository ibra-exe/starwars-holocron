import { useState } from "react";
import { useHashAnchor } from "@/lib/useHashAnchor";
import { ERAS } from "@/data/eras";
import { findFaction } from "@/data/factions";
import { findCharacter } from "@/data/characters";
import { findMedia } from "@/data/media";
import { PageHeader } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";
import { formatBBYRange } from "@/lib/format";
import { ChevronDown } from "lucide-react";

export default function ErasPage() {
  const [openId, setOpenId] = useState<string | null>(ERAS[0].id);

  useHashAnchor(
    "/eras",
    (id) => {
      setOpenId(id);
      setTimeout(() => {
        document.getElementById(`era-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    },
    (id) => ERAS.some((e) => e.id === id),
  );

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Atlas"
        title="Thirteen Eras of the Galaxy"
        description="A complete chronology of the Star Wars universe, spanning over 25,000 years from the mythic Dawn of the Jedi to the uncharted post-sequel age. Click an era to dive in."
      />

      <div className="space-y-3">
        {ERAS.map((era, idx) => {
          const open = openId === era.id;
          return (
            <article
              key={era.id}
              id={`era-${era.id}`}
              className="rounded-xl border border-border bg-card overflow-hidden"
              data-testid={`era-${era.id}`}
            >
              <button
                onClick={() => setOpenId(open ? null : era.id)}
                className="w-full text-left px-6 py-5 hover-elevate flex items-center gap-5"
                data-testid={`button-era-${era.id}`}
              >
                <div
                  className="w-1 h-14 rounded-full shrink-0"
                  style={{ background: era.color }}
                />
                <div className="font-display text-2xl text-muted-foreground/60 tabular-nums w-12 shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="font-display text-xl text-foreground tracking-wide">
                      {era.name}
                    </h2>
                    <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">
                      {formatBBYRange(era.startBBY, era.endBBY)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground italic mt-0.5">"{era.tagline}"</div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="border-t border-border px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-5">
                    <Section title="Overview">
                      <p className="text-sm leading-relaxed text-foreground/85"><SmartText text={era.description} excludeId={era.id} maxLinks={12} /></p>
                    </Section>
                    <Section title="Political Landscape">
                      <p className="text-sm leading-relaxed text-foreground/80"><SmartText text={era.political} excludeId={era.id} /></p>
                    </Section>
                    <Section title="Technology &amp; Society">
                      <p className="text-sm leading-relaxed text-foreground/80"><SmartText text={era.technological} excludeId={era.id} /></p>
                    </Section>
                    <Section title="Major Wars">
                      <ul className="space-y-1.5">
                        {era.majorWars.map((w) => (
                          <li key={w} className="text-sm text-foreground/85 flex gap-2">
                            <span className="text-[hsl(var(--sith))]">⚔</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </Section>
                    <Section title="Ideological Conflicts">
                      <ul className="space-y-1.5">
                        {era.ideologicalConflicts.map((w) => (
                          <li key={w} className="text-sm text-foreground/85 flex gap-2">
                            <span className="text-primary">✦</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  </div>

                  <aside className="space-y-5">
                    <Section title="Dominant Factions">
                      <div className="flex flex-wrap gap-1.5">
                        {era.dominantFactions.map((fid) => {
                          const f = findFaction(fid);
                          return (
                            <span
                              key={fid}
                              className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85"
                              data-testid={`faction-chip-${fid}`}
                            >
                              {f?.name || fid}
                            </span>
                          );
                        })}
                      </div>
                    </Section>
                    {era.keyCharacters.length > 0 && (
                      <Section title="Key Characters">
                        <div className="flex flex-wrap gap-1.5">
                          {era.keyCharacters.map((cid) => {
                            const c = findCharacter(cid);
                            return (
                              <span
                                key={cid}
                                className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85"
                              >
                                {c?.name || cid}
                              </span>
                            );
                          })}
                        </div>
                      </Section>
                    )}
                    {era.keyMedia.length > 0 && (
                      <Section title="Key Media">
                        <ul className="space-y-1.5">
                          {era.keyMedia.map((mid) => {
                            const m = findMedia(mid);
                            return (
                              <li
                                key={mid}
                                className="text-xs text-foreground/85 border border-border rounded px-2 py-1.5 bg-secondary/30"
                              >
                                <div className="font-medium">{m?.title || mid}</div>
                                {m && (
                                  <div className="text-muted-foreground text-[10px] mt-0.5 uppercase tracking-wider">
                                    {m.type} · {m.continuity}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </Section>
                    )}
                  </aside>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

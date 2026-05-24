import { useState } from "react";
import { useHashAnchor } from "@/lib/useHashAnchor";
import { FORCE_CONCEPTS } from "@/data/force";
import { findFaction } from "@/data/factions";
import { findCharacter } from "@/data/characters";
import { PageHeader } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";

const CATEGORIES = ["All", "Philosophy", "Phenomenon", "Artifact", "Cult", "Prophecy", "Entity"] as const;

const CAT_COLOR: Record<string, string> = {
  Philosophy: "primary",
  Phenomenon: "jedi",
  Artifact: "rebel",
  Cult: "sith",
  Prophecy: "nightsister",
  Entity: "imperial",
};

export default function ForcePage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [highlight, setHighlight] = useState<string | null>(null);
  const items = FORCE_CONCEPTS.filter((c) => category === "All" || c.category === category);

  useHashAnchor(
    "/force",
    (id) => {
      setCategory("All");
      setHighlight(id);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      setTimeout(() => setHighlight(null), 2400);
    },
    (id) => FORCE_CONCEPTS.some((c) => c.id === id),
  );

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="The Force"
        title="Philosophy of the Force"
        description="The mystic energy that binds the galaxy — its philosophies, schisms, vergences, and cults, compared side by side."
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest font-display rounded-md border ${
              category === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`button-force-cat-${c}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((c) => {
          const accent = CAT_COLOR[c.category] || "primary";
          const accentClass =
            accent === "sith" ? "border-l-[hsl(var(--sith))]"
            : accent === "jedi" ? "border-l-[hsl(var(--jedi))]"
            : accent === "rebel" ? "border-l-[hsl(var(--rebel))]"
            : accent === "nightsister" ? "border-l-[hsl(var(--nightsister))]"
            : accent === "imperial" ? "border-l-[hsl(var(--imperial))]"
            : "border-l-primary";
          return (
            <article
              key={c.id}
              id={c.id}
              className={`rounded-xl border bg-card p-6 border-l-4 ${accentClass} transition-all ${
                highlight === c.id ? "border-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.45)]" : "border-border"
              }`}
              data-testid={`card-force-${c.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">{c.category}</span>
              </div>
              <h2 className="font-display text-2xl text-foreground mb-2 tracking-wide">{c.name}</h2>
              <p className="text-sm text-foreground/85 leading-relaxed italic mb-3"><SmartText text={c.summary} excludeId={c.id} maxLinks={6} /></p>
              <p className="text-sm text-foreground/80 leading-relaxed"><SmartText text={c.details} excludeId={c.id} maxLinks={10} /></p>

              {(c.relatedFactions.length > 0 || c.relatedCharacters.length > 0) && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {c.relatedFactions.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-primary font-display mb-1.5">Related Factions</div>
                      <div className="flex flex-wrap gap-1">
                        {c.relatedFactions.map((id) => {
                          const f = findFaction(id);
                          return <span key={id} className="text-[11px] px-2 py-0.5 rounded border border-border bg-secondary/40 text-foreground/85">{f?.name || id}</span>;
                        })}
                      </div>
                    </div>
                  )}
                  {c.relatedCharacters.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-primary font-display mb-1.5">Notable Practitioners</div>
                      <div className="flex flex-wrap gap-1">
                        {c.relatedCharacters.map((id) => {
                          const ch = findCharacter(id);
                          return <span key={id} className="text-[11px] px-2 py-0.5 rounded border border-border bg-secondary/40 text-foreground/85">{ch?.name || id}</span>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

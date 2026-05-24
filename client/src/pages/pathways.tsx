import { useHashAnchor } from "@/lib/useHashAnchor";
import { findMedia } from "@/data/media";
import { PageHeader, ContinuityBadge, EssentialityBadge } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";
import { Sparkles, Library, Crown, Flame, Shield, Sword, Eye, ScrollText } from "lucide-react";

const PATHWAYS = [
  {
    id: "beginner",
    title: "First Lightspeed Jump",
    audience: "Beginner",
    icon: Sparkles,
    description: "The fastest legitimate path into Star Wars. Original trilogy first — every other arc reads better once you know Vader.",
    steps: [
      { media: "new-hope", note: "Begin where audiences began in 1977." },
      { media: "empire-strikes-back", note: "Vader's revelation; the saga's emotional core." },
      { media: "return-of-jedi", note: "Anakin's redemption arc closes the OT." },
      { media: "phantom-menace", note: "Optional — backfill the prequels." },
      { media: "attack-of-clones", note: "The Clone Wars begin and Anakin slips." },
      { media: "revenge-of-sith", note: "The fall — required viewing for Mando-era context." },
      { media: "force-awakens", note: "The sequel trilogy revives the saga 30 years later." },
      { media: "last-jedi", note: "" },
      { media: "rise-of-skywalker", note: "" },
    ],
  },
  {
    id: "chronological",
    title: "The Master Chronology",
    audience: "Completionist",
    icon: Library,
    description: "Watch and read the entire saga in strict in-universe order. The complete experience — Dawn of the Jedi to the New Jedi Order.",
    steps: [
      { media: "kotor-game", note: "~3956 BBY · the Old Republic crucible." },
      { media: "kotor-2-game", note: "~3951 BBY · Meetra Surik wrestles with the Force." },
      { media: "swtor-mmo", note: "~3681-3653 BBY · the Cold War." },
      { media: "darth-bane-trilogy", note: "~1000 BBY · the Rule of Two is born." },
      { media: "light-of-jedi-novel", note: "~232 BBY · the High Republic begins." },
      { media: "phantom-menace", note: "32 BBY" },
      { media: "attack-of-clones", note: "22 BBY" },
      { media: "clone-wars-series", note: "22-19 BBY · animated, essential" },
      { media: "revenge-of-sith", note: "19 BBY" },
      { media: "bad-batch", note: "19-18 BBY · post-Order 66" },
      { media: "kenobi-series", note: "10 BBY" },
      { media: "rebels-series", note: "5-1 BBY" },
      { media: "andor-series", note: "5-1 BBY · the rebellion in shadows" },
      { media: "rogue-one", note: "0 BBY · the Death Star plans" },
      { media: "new-hope", note: "0 BBY" },
      { media: "empire-strikes-back", note: "3 ABY" },
      { media: "return-of-jedi", note: "4 ABY" },
      { media: "mandalorian-series", note: "9 ABY" },
      { media: "ahsoka-series", note: "9 ABY" },
      { media: "force-awakens", note: "34 ABY" },
      { media: "last-jedi", note: "34 ABY" },
      { media: "rise-of-skywalker", note: "35 ABY" },
    ],
  },
  {
    id: "skywalker",
    title: "The Skywalker Bloodline",
    audience: "Character-focused",
    icon: Crown,
    description: "Three generations: Anakin's fall, Luke and Leia's stand, Ben Solo's redemption, Rey's inheritance.",
    steps: [
      { media: "phantom-menace", note: "Anakin discovered." },
      { media: "attack-of-clones", note: "Anakin & Padmé in secret." },
      { media: "clone-wars-series", note: "The making of Vader." },
      { media: "revenge-of-sith", note: "The fall." },
      { media: "new-hope", note: "Luke and Leia revealed." },
      { media: "empire-strikes-back", note: "'I am your father.'" },
      { media: "return-of-jedi", note: "Anakin redeemed." },
      { media: "force-awakens", note: "Ben Solo turns." },
      { media: "last-jedi", note: "Luke vs. Kylo." },
      { media: "rise-of-skywalker", note: "Rey adopts the Skywalker name." },
    ],
  },
  {
    id: "sith",
    title: "The Dark Side Codex",
    audience: "Faction-focused",
    icon: Flame,
    description: "Trace the Sith from their Dawn-of-Jedi exile through Bane, Plagueis, Sidious, Vader, and Exegol.",
    steps: [
      { media: "tales-of-jedi-legends", note: "Legends · the first dark Jedi." },
      { media: "kotor-game", note: "Revan and the Sith Empire." },
      { media: "kotor-2-game", note: "The Sith Triumvirate." },
      { media: "darth-bane-trilogy", note: "Legends · the Rule of Two." },
      { media: "darth-plagueis-novel", note: "Legends · the dark master." },
      { media: "phantom-menace", note: "Maul reveals the Sith return." },
      { media: "attack-of-clones", note: "Dooku as Tyranus." },
      { media: "clone-wars-series", note: "Sidious manipulates the war." },
      { media: "revenge-of-sith", note: "Anakin becomes Vader." },
      { media: "darth-vader-comics", note: "Vader hunts the Jedi." },
      { media: "return-of-jedi", note: "Sidious dies — for now." },
      { media: "rise-of-skywalker", note: "Resurrected on Exegol." },
    ],
  },
  {
    id: "mando",
    title: "The Way of the Mandalore",
    audience: "Faction-focused",
    icon: Shield,
    description: "Beskar, the Darksaber, the Children of the Watch — Mandalore's full arc.",
    steps: [
      { media: "clone-wars-series", note: "Death Watch / Maul / Bo-Katan arcs." },
      { media: "rebels-series", note: "Sabine reclaims the Darksaber." },
      { media: "mandalorian-series", note: "Din Djarin and Grogu." },
      { media: "book-boba-fett", note: "Boba returns to Tatooine." },
      { media: "ahsoka-series", note: "The galaxy after the Empire." },
    ],
  },
  {
    id: "rebellion",
    title: "Spark of Rebellion",
    audience: "Faction-focused",
    icon: Sword,
    description: "From Andor's whispered conspiracies to Yavin and Endor.",
    steps: [
      { media: "andor-series", note: "The rebellion before the Rebellion." },
      { media: "rebels-series", note: "A Lothal cell joins the cause." },
      { media: "rogue-one", note: "Rebellions are built on hope." },
      { media: "new-hope", note: "Yavin." },
      { media: "empire-strikes-back", note: "Hoth & Bespin." },
      { media: "return-of-jedi", note: "Endor." },
    ],
  },
  {
    id: "high-republic",
    title: "The High Republic Saga",
    audience: "Advanced",
    icon: ScrollText,
    description: "The 200-year multimedia epic before the prequels — the Jedi at their zenith vs. the Nihil.",
    steps: [
      { media: "light-of-jedi-novel", note: "Phase I begins — the Great Disaster." },
      { media: "into-the-dark-novel", note: "" },
      { media: "high-republic-comics", note: "" },
      { media: "the-acolyte-series", note: "Phase II onscreen — 100 BBY." },
    ],
  },
  {
    id: "deep-lore",
    title: "Deep Lore Initiate",
    audience: "Advanced",
    icon: Eye,
    description: "For the lore-obsessed — the philosophy, the Mortis gods, World Between Worlds, vergences.",
    steps: [
      { media: "clone-wars-series", note: "Mortis arc + Yoda's vision arc." },
      { media: "rebels-series", note: "World Between Worlds revealed." },
      { media: "tales-of-jedi-canon", note: "Dooku & Ahsoka shorts." },
      { media: "ahsoka-series", note: "Inter-galactic Force lore." },
    ],
  },
];

export default function PathwaysPage() {
  useHashAnchor(
    "/pathways",
    (id) => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    },
    (id) => PATHWAYS.some((p) => p.id === id),
  );
  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Pathways"
        title="Curated Viewing &amp; Reading Orders"
        description="A library of canonical and Legends pathways — pick your aspect of the Force and follow the breadcrumbs."
      />

      <div className="space-y-6">
        {PATHWAYS.map((p) => {
          const Icon = p.icon;
          return (
            <article key={p.id} id={p.id} className="rounded-xl border border-border bg-card p-7" data-testid={`pathway-${p.id}`}>
              <div className="flex items-start gap-4 mb-5">
                <div className="text-primary p-3 rounded-lg bg-primary/10 border border-primary/30 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-primary font-display mb-1">{p.audience}</div>
                  <h2 className="font-display text-2xl text-foreground tracking-wide">{p.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl"><SmartText text={p.description} maxLinks={8} /></p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-2xl text-primary">{p.steps.length}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">steps</div>
                </div>
              </div>

              <ol className="relative border-l-2 border-border ml-3 space-y-3 pl-6">
                {p.steps.map((step, i) => {
                  const m = findMedia(step.media);
                  return (
                    <li key={i} className="relative">
                      <span className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-display flex items-center justify-center">{i + 1}</span>
                      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <span className="font-display text-base text-foreground">{m?.title || step.media}</span>
                          {m && (
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
                              {m.type} · {m.inUniverseDate}
                            </span>
                          )}
                        </div>
                        {m && (
                          <div className="flex flex-wrap gap-1.5 my-1.5">
                            <ContinuityBadge value={m.continuity} />
                            <EssentialityBadge value={m.essentiality} />
                          </div>
                        )}
                        {step.note && <p className="text-xs text-foreground/70 italic mt-1">{step.note}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
      </div>
    </div>
  );
}

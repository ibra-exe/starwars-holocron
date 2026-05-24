import { Link } from "wouter";
import { ERAS } from "@/data/eras";
import { MEDIA } from "@/data/media";
import { CHARACTERS } from "@/data/characters";
import { FACTIONS } from "@/data/factions";
import { FORCE_CONCEPTS } from "@/data/force";
import { SPECIES } from "@/data/species";
import { PLANETS } from "@/data/planets";
import { SHIPS } from "@/data/ships";
import { ARTIFACTS } from "@/data/artifacts";
import { LINEAGES } from "@/data/lineages";
import { PageHeader } from "@/components/shared/Badges";
import SmartText from "@/components/shared/SmartText";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { formatBBYRange } from "@/lib/format";
import { ArrowRight, Sparkles, Sword, Crown, Shield, Flame, Library, Scale, Quote as QuoteIcon } from "lucide-react";
import { getQuoteOfDay } from "@/data/quotes";
import { findCharacter } from "@/data/characters";
import { findEntityById } from "@/lib/entityIndex";

const PATHWAYS = [
  {
    id: "beginner",
    title: "First Lightspeed Jump",
    audience: "Beginner",
    description: "Start with the original Skywalker saga in release order, then expand.",
    color: "primary",
    icon: Sparkles,
    steps: ["Episodes IV → VI", "Episodes I → III", "Episodes VII → IX", "Rogue One + Solo", "The Mandalorian"],
  },
  {
    id: "chronological",
    title: "The Master Chronology",
    audience: "Completionist",
    description: "Walk every era in-universe — Dawn of the Jedi to the post-sequel age.",
    color: "jedi",
    icon: Library,
    steps: ["Dawn of the Jedi", "Old Republic & KOTOR", "High Republic novels", "Prequels + Clone Wars", "OT + Rebels", "Sequels + Mandoverse"],
  },
  {
    id: "skywalker",
    title: "The Skywalker Bloodline",
    audience: "Character-focused",
    description: "Follow Anakin's fall, Luke's rise, Leia's command, Ben Solo's redemption.",
    color: "rebel",
    icon: Crown,
    steps: ["Episodes I-III", "Clone Wars + Tales of the Jedi", "Episodes IV-VI", "Mandalorian / Book of Boba Fett", "Episodes VII-IX"],
  },
  {
    id: "sith",
    title: "The Dark Side Codex",
    audience: "Faction-focused",
    description: "Trace the Sith from Dawn-of-Jedi exile to Exegol's Final Order.",
    color: "sith",
    icon: Flame,
    steps: ["Tales of the Jedi (Legends)", "KOTOR I + II", "Darth Bane trilogy", "Prequels", "Darth Vader comics", "Episode IX + Exegol"],
  },
  {
    id: "mando",
    title: "The Way of the Mandalore",
    audience: "Faction-focused",
    description: "Beskar, foundlings, Death Watch, Bo-Katan, and the Mandoverse.",
    color: "mando",
    icon: Shield,
    steps: ["Clone Wars S2/S4/S5 arcs", "Rebels Mandalore arcs", "The Mandalorian (3 seasons)", "Book of Boba Fett", "Ahsoka"],
  },
  {
    id: "rebellion",
    title: "Spark of Rebellion",
    audience: "Faction-focused",
    description: "From Andor's whispers to Yavin and Endor.",
    color: "rebel",
    icon: Sword,
    steps: ["Andor", "Star Wars Rebels", "Rogue One", "Episode IV", "Episode V", "Episode VI"],
  },
];

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="panel-premium hud-brackets scanlines p-5 relative group transition-all hover:border-primary/40">
      <div className={`stat-numeral leading-none ${accent}`} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        {value.toLocaleString()}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const canonCount = MEDIA.filter((m) => m.continuity === "Canon").length;
  const legendsCount = MEDIA.filter((m) => m.continuity === "Legends").length;
  const bothCount = MEDIA.filter((m) => m.continuity === "Both").length;

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="mb-16 relative">
        {/* hyperspace streaks */}
        <div className="hyperspace-streak" style={{ top: '8%', left: '-10%', width: '40%', opacity: 0.4 }} />
        <div className="hyperspace-streak" style={{ top: '22%', left: '-5%', width: '25%', opacity: 0.25 }} />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary" />
          <div className="eyebrow">Galactic Holocron Archives</div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
        </div>

        <h1 className="font-display display-saga text-5xl md:text-7xl max-w-5xl">
          <span className="crawl-gradient">A long time ago,</span>
          <br />
          <span className="text-foreground/95">in a galaxy far, far away…</span>
        </h1>

        <p className="mt-8 text-muted-foreground max-w-2xl leading-relaxed text-[15px]">
          A complete, in-universe intelligence system for the Star Wars saga — 13 eras across
          25,000+ years of canon and legends. Trace bloodlines, follow factions through their
          rise and fall, audit every film, series, novel, comic, and game, and map the Force itself.
        </p>

        {/* Master search across the archive */}
        <div className="mt-9">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/80">Holocron Search</span>
            <span className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GlobalSearch />
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
            Search across {CHARACTERS.length} characters · {PLANETS.length} planets · {SHIPS.length} ships · {ARTIFACTS.length} artifacts · {LINEAGES.length} lineages · {FACTIONS.length} factions · {SPECIES.length} species · {MEDIA.length} media · {ERAS.length} eras · {FORCE_CONCEPTS.length} Force concepts
          </div>
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/timeline" data-testid="cta-timeline">
            <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-display text-[12px] tracking-[0.22em] uppercase hover-elevate flex items-center gap-2 glow-gold-sm transition-all hover:scale-[1.02]">
              Open Timeline <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/eras" data-testid="cta-eras">
            <button className="px-6 py-3 rounded-md border border-primary/40 text-primary font-display text-[12px] tracking-[0.22em] uppercase hover-elevate bg-primary/[0.03] flex items-center gap-2 transition-all hover:bg-primary/[0.08]">
              Explore Eras
            </button>
          </Link>
          <Link href="/search" data-testid="cta-search">
            <button className="px-6 py-3 rounded-md border border-border text-foreground/85 font-display text-[12px] tracking-[0.22em] uppercase hover-elevate transition-all hover:border-primary/30 hover:text-primary">
              Cross-Reference
            </button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-16">
        <StatCard label="Eras Charted" value={ERAS.length} accent="text-primary" />
        <StatCard label="Media Entries" value={MEDIA.length} accent="text-[hsl(var(--jedi))]" />
        <StatCard label="Characters" value={CHARACTERS.length} accent="text-[hsl(var(--rebel))]" />
        <StatCard label="Species" value={SPECIES.length} accent="text-[hsl(var(--mando))]" />
        <StatCard label="Factions" value={FACTIONS.length} accent="text-[hsl(var(--sith))]" />
        <StatCard label="Planets" value={PLANETS.length} accent="text-[hsl(var(--chart-5))]" />
        <StatCard label="Ships" value={SHIPS.length} accent="text-[hsl(var(--imperial))]" />
        <StatCard label="Artifacts" value={ARTIFACTS.length} accent="text-primary" />
        <StatCard label="Lineages" value={LINEAGES.length} accent="text-[hsl(var(--crawl))]" />
        <StatCard label="Force Concepts" value={FORCE_CONCEPTS.length} accent="text-[hsl(var(--nightsister))]" />
      </section>

      {/* Quote of the Day */}
      <DailyQuoteTile />

      {/* Canon vs Legends explainer */}
      <section className="mb-16">
        <div className="holocron-panel hud-brackets scanlines p-7 relative">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-primary" />
            <span className="eyebrow">The Two Galaxies</span>
          </div>
          <h2 className="font-display text-3xl text-foreground mb-4 leading-tight">Canon vs. Legends — know which world you are in</h2>
          <p className="text-[14px] leading-relaxed text-foreground/85 max-w-3xl">
            On <strong className="text-primary">25 April 2014</strong>, Lucasfilm reset Star Wars continuity. Everything Disney has produced since is the
            current <span className="text-[hsl(var(--canon))] font-medium">Canon</span>. Everything published before that date —
            the 38 years of Expanded Universe novels, comics, and games — was rebranded as
            <span className="text-[hsl(var(--legends))] font-medium"> Star Wars Legends</span>: preserved as fiction worth enjoying,
            but no longer binding on official storytelling. The Skywalker films and The Clone Wars remain in both.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <div className="rounded-md border bg-secondary/20 p-4 panel-premium relative" style={{ borderColor: "hsl(var(--canon) / 0.4)" }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l" style={{ background: 'hsl(var(--canon))' }} />
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--canon))] mb-2">Canon</div>
              <div className="font-display text-3xl text-[hsl(var(--canon))]">{canonCount}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Disney era · 2014 →</div>
            </div>
            <div className="rounded-md border bg-secondary/20 p-4 panel-premium relative" style={{ borderColor: "hsl(var(--legends) / 0.4)" }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l" style={{ background: 'hsl(var(--legends))' }} />
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--legends))] mb-2">Legends</div>
              <div className="font-display text-3xl text-[hsl(var(--legends))]">{legendsCount}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">EU · 1976 – 2014</div>
            </div>
            <div className="rounded-md border border-primary/30 bg-secondary/20 p-4 panel-premium relative">
              <div className="absolute top-0 left-0 w-1 h-full rounded-l bg-primary" />
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary mb-2">Both</div>
              <div className="font-display text-3xl text-primary">{bothCount}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Shared by the two galaxies</div>
            </div>
          </div>
          <Link href="/continuity" data-testid="link-continuity-explainer">
            <button className="mt-6 px-5 py-2.5 rounded-md border border-primary/40 text-primary font-display text-[11px] tracking-[0.22em] uppercase hover-elevate flex items-center gap-2 bg-primary/[0.03]">
              Read the full explainer <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Eras quick grid */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="eyebrow mb-2">Atlas</div>
            <h2 className="font-display text-3xl">Thirteen Eras of the Galaxy</h2>
          </div>
          <Link href="/eras" data-testid="link-all-eras">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary hover:text-primary/80 flex items-center gap-1.5">All Eras <ArrowRight className="w-3.5 h-3.5" /></span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ERAS.map((era) => (
            <Link
              key={era.id}
              href={`/eras`}
              onClick={() => setPendingAnchor({ page: "/eras", id: era.id })}
              data-testid={`card-era-${era.id}`}
            >
              <div className="panel-premium hud-brackets p-5 hover-elevate cursor-pointer relative overflow-hidden group h-full transition-all hover:border-primary/40">
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${era.color}, transparent)` }}
                />
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
                  {formatBBYRange(era.startBBY, era.endBBY)}
                </div>
                <div className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {era.name}
                </div>
                <div className="text-sm text-foreground/70 italic mb-3 font-serif">"{era.tagline}"</div>
                <div className="text-xs text-foreground/60 line-clamp-3 leading-relaxed">
                  {era.political}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pathways */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="eyebrow mb-2">Pathways</div>
            <h2 className="font-display text-3xl">Curated Viewing &amp; Reading Orders</h2>
          </div>
          <Link href="/pathways" data-testid="link-all-pathways">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary hover:text-primary/80 flex items-center gap-1.5">All Pathways <ArrowRight className="w-3.5 h-3.5" /></span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PATHWAYS.slice(0, 6).map((p) => {
            const Icon = p.icon;
            const accentClass = p.color === 'sith' ? 'text-[hsl(var(--sith))]' : p.color === 'jedi' ? 'text-[hsl(var(--jedi))]' : p.color === 'rebel' ? 'text-[hsl(var(--rebel))]' : p.color === 'mando' ? 'text-[hsl(var(--mando))]' : 'text-primary';
            return (
              <Link
                key={p.id}
                href={`/pathways`}
                onClick={() => setPendingAnchor({ page: "/pathways", id: p.id })}
                data-testid={`card-pathway-${p.id}`}
              >
                <div className="panel-premium hud-brackets p-5 hover-elevate cursor-pointer h-full transition-all hover:border-primary/30 group">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-4 h-4 ${accentClass}`} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      {p.audience}
                    </span>
                  </div>
                  <div className="font-display text-lg mb-2 group-hover:text-primary transition-colors">{p.title}</div>
                  <p className="text-sm text-foreground/65 mb-4 leading-relaxed"><SmartText text={p.description} maxLinks={6} /></p>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                    {p.steps.length} steps · {p.steps[0]} →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="text-center py-10 border-t border-border/50 relative" data-testid="dashboard-footer">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="crawl-gradient font-display tracking-[0.32em] uppercase text-base">May the Force Be With You</div>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Holocron · An interactive Star Wars lore intelligence system</div>
      </footer>
    </div>
  );
}

function DailyQuoteTile() {
  const q = getQuoteOfDay();
  const speakerChar = findCharacter(q.speaker);
  const speakerEntity = findEntityById(q.speaker, "character");
  return (
    <section className="mb-16" data-testid="daily-quote-tile">
      <Link href="/quote" data-testid="link-quote-of-day">
        <div className="relative rounded-xl border border-primary/30 bg-card/70 backdrop-blur-md px-6 md:px-10 py-7 md:py-9 overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)] group">
          <div className="absolute -top-2 left-5 text-primary/35 group-hover:text-primary/55 transition-colors">
            <QuoteIcon className="w-10 h-10" strokeWidth={1.4} />
          </div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-primary/[0.06] blur-3xl pointer-events-none group-hover:bg-primary/[0.12] transition-colors" />
          <div className="flex items-center justify-between mb-3 relative">
            <span className="eyebrow text-primary">Quote of the Day</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-display flex items-center gap-1.5">
              Read the vault <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <blockquote className="relative font-serif italic text-xl md:text-2xl leading-snug text-foreground/95 pl-2 md:pl-4 max-w-3xl">
            “{q.text}”
          </blockquote>
          <div className="mt-4 pl-2 md:pl-4 text-sm text-muted-foreground">
            — <span className="font-display tracking-wide text-foreground/85">{q.speakerLabel || speakerChar?.name || speakerEntity?.name || q.speaker}</span>
            {q.source && <span className="text-[10px] uppercase tracking-[0.22em] ml-3 text-muted-foreground/80">{q.source}</span>}
          </div>
        </div>
      </Link>
    </section>
  );
}

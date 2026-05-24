import { PageHeader, ContinuityBadge } from "@/components/shared/Badges";
import { MEDIA } from "@/data/media";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Film, Scale } from "lucide-react";

export default function ContinuityPage() {
  const canonCount = MEDIA.filter((m) => m.continuity === "Canon").length;
  const legendsCount = MEDIA.filter((m) => m.continuity === "Legends").length;
  const bothCount = MEDIA.filter((m) => m.continuity === "Both").length;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="The Two Galaxies"
        title="Canon vs. Legends"
        description="Star Wars exists in two parallel continuities. Knowing which is which is the single most important piece of context for navigating the lore."
      />

      {/* TL;DR card */}
      <section className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-10">
        <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3 flex items-center gap-2">
          <Scale className="w-3.5 h-3.5" /> The 30-second version
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          On <strong className="text-foreground">25 April 2014</strong>, Lucasfilm reset Star Wars continuity. Everything Disney has produced since
          — the sequel trilogy, every Disney+ series, the Aftermath / High Republic / Thrawn-rebuilt novels, and most new comics — is the
          <span className="text-[hsl(var(--canon))] font-medium"> current Canon</span>. Everything published <em>before</em> that date
          (with a handful of exceptions) was rebranded as <span className="text-[hsl(var(--legends))] font-medium">Star Wars Legends</span> — preserved as
          fiction worth enjoying, but no longer binding on official storytelling. The Skywalker films (Episodes I–VI) and The Clone Wars
          cross-over and remain Canon.
        </p>
      </section>

      {/* Side-by-side comparison */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <ContinuityColumn
          tone="canon"
          label="Canon"
          headline="The Story Group's Continuity"
          since="2014 → present"
          icon={Film}
          count={canonCount}
          paragraphs={[
            "Established when Lucasfilm formed the Lucasfilm Story Group on 25 April 2014. Every piece of Canon material is internally consistent — films, series, novels, comics, games, and reference books are coordinated so a fact in a Disney+ show binds a novel and vice versa.",
            "Includes the Skywalker Saga (Episodes I–IX), Rogue One, Solo, The Clone Wars, Rebels, The Bad Batch, The Mandalorian, Andor, Ahsoka, Obi-Wan Kenobi, Tales of the Jedi, plus all Disney-era novels (Aftermath, Thrawn rebuild, High Republic, etc.) and Marvel comics from 2015 onward.",
            "Canon is the story new fans see. It is what tie-in media, theme parks, video games (Jedi: Fallen Order / Survivor, Squadrons, Outlaws), and merchandise reflect.",
          ]}
          bullets={[
            "Coordinated by the Lucasfilm Story Group",
            "Begins with material released or branded from 25 April 2014",
            "All six original films + The Clone Wars remain in this continuity",
            "Single-line continuity: each story binds the others",
          ]}
        />
        <ContinuityColumn
          tone="legends"
          label="Legends"
          headline="The Expanded Universe (EU)"
          since="1976 → 2014 (paused)"
          icon={BookOpen}
          count={legendsCount}
          paragraphs={[
            "Encompasses 38 years of pre-Disney novels, comics, video games, and reference books — Heir to the Empire (1991), the Thrawn trilogy, Knights of the Old Republic (2003 game and 2006 comic), the Darth Bane trilogy, the New Jedi Order series (Yuuzhan Vong invasion), Legacy of the Force, Fate of the Jedi, Tales of the Jedi (the 1990s comic), Dark Empire, and hundreds more.",
            "Rebranded as 'Legends' in April 2014. The label promises that none of it is being unwritten — Lucasfilm explicitly framed Legends as 'a vast collection of tales that fueled imagination for decades.' But none of it is binding on Canon.",
            "Some elements have been drip-fed back: Grand Admiral Thrawn (Heir to the Empire, 1991) returned via Rebels in 2016; the Inquisitorius and the Nightsisters were retained; Dathomir, Mandalore's history, and elements of the Old Republic and the Sith have been remixed into Canon.",
          ]}
          bullets={[
            "Built collaboratively across publishers (Bantam, Del Rey, Dark Horse, BioWare, etc.)",
            "Begins with Splinter of the Mind's Eye (1978) — the first non-film story",
            "Includes the original Thrawn trilogy, KOTOR I & II, the NJO arc, and Darth Bane",
            "Not binding on new films/series, but preserved as 'tales worth telling'",
          ]}
        />
      </section>

      {/* The split */}
      <section className="mb-12">
        <SectionHeader title="The 2014 Split — What Actually Happened" />
        <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
          <p>
            When Disney acquired Lucasfilm in October 2012, the new owners needed a single authoritative continuity to build the sequel trilogy and a slate of standalone films and series. The Expanded Universe had grown so dense by 2012 that contradictions between novels, comics, and games made it nearly impossible to tell a major new story without breaking something.
          </p>
          <p>
            On 25 April 2014, Lucasfilm announced the formation of the Story Group, the Legends rebrand, and an unambiguous list of what would remain Canon: the six theatrical Skywalker films (Episodes I–VI), The Clone Wars TV series and feature film, and all material released from that day forward. Everything else was preserved under the Legends banner.
          </p>
          <p>
            The first piece of "new Canon" was the Star Wars Rebels animated series and the novel <em>A New Dawn</em> by John Jackson Miller, both released in 2014. From then on, every novel, comic, film, and series has been coordinated by the Story Group.
          </p>
        </div>
      </section>

      {/* Reading order */}
      <section className="mb-12">
        <SectionHeader title="Which Continuity Should I Follow?" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <PathCard
            title="The newcomer"
            description="Watch the films and Disney+ series. Read the Canon novels (Aftermath, Thrawn rebuild, High Republic). Treat Legends as bonus reading."
            recommendation="Canon"
            color="hsl(var(--canon))"
          />
          <PathCard
            title="The lifelong EU fan"
            description="Treat the Skywalker films as shared. Stay in Legends for the deep mythos — Bane, KOTOR, NJO, Legacy. You have decades of incredible novels."
            recommendation="Legends"
            color="hsl(var(--legends))"
          />
          <PathCard
            title="The completionist"
            description="Both. This archive treats them as parallel valid traditions. Use the Continuity badge on every entry to know which world you are in."
            recommendation="Both"
            color="hsl(var(--primary))"
          />
        </div>
      </section>

      {/* What's in this archive */}
      <section className="mb-12">
        <SectionHeader title="How This Archive Handles It" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
          <StatBlock label="Canon entries" value={canonCount} accent="text-[hsl(var(--canon))]" />
          <StatBlock label="Legends entries" value={legendsCount} accent="text-[hsl(var(--legends))]" />
          <StatBlock label="Cross-continuity" value={bothCount} accent="text-primary" />
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">
          Every media entry, character, faction, and species in this archive carries a continuity badge:
          <span className="inline-flex items-center gap-1 mx-1.5"><ContinuityBadge value="Canon" /></span>,
          <span className="inline-flex items-center gap-1 mx-1.5"><ContinuityBadge value="Legends" /></span>, or
          <span className="inline-flex items-center gap-1 mx-1.5"><ContinuityBadge value="Both" /></span>. Filter the Media Library, the Timeline, and the Species Compendium by continuity at any time. We do not pretend the two contradict each other — we present them side by side and note where they diverge.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/media" data-testid="continuity-cta-media">
            <button className="px-4 py-2 rounded-md border border-primary/40 text-primary font-display text-xs tracking-widest uppercase hover-elevate flex items-center gap-2">
              Browse Media Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href="/timeline" data-testid="continuity-cta-timeline">
            <button className="px-4 py-2 rounded-md border border-border text-foreground/85 font-display text-xs tracking-widest uppercase hover-elevate flex items-center gap-2">
              Open Timeline
            </button>
          </Link>
        </div>
      </section>

      {/* Notable divergences */}
      <section className="mb-12">
        <SectionHeader title="Where Canon and Legends Tell Different Stories" />
        <div className="space-y-3">
          <Divergence
            topic="After Return of the Jedi"
            canon="The New Republic forms, fails to disarm the Imperial Remnant, the First Order rises, the sequel trilogy unfolds, and the Skywalkers' direct line ends with Ben Solo and Rey Skywalker."
            legends="The Empire fragments under warlords; Thrawn returns from the Unknown Regions to wage the Thrawn Campaign (9 ABY); the Yuuzhan Vong invade (25 ABY); Jacen Solo falls to the dark side as Darth Caedus; Luke marries Mara Jade; the Skywalker line continues for centuries."
          />
          <Divergence
            topic="The Old Republic"
            canon="Largely unwritten beyond The High Republic Era novels (~232–82 BBY). The deep past is treated as mythic."
            legends="Detailed by KOTOR I and II, the Tales of the Jedi comics, the Old Republic MMO, and the Darth Bane trilogy — including Revan, Malak, Exar Kun, the Mandalorian Wars, the Great Hyperspace War, and a thousand years of Sith Empires."
          />
          <Divergence
            topic="Mandalorian history"
            canon="Mandalore was a green world devastated by the Empire; The Mandalorian, The Book of Boba Fett, and Ahsoka rebuild the culture around the Darksaber, foundlings, and Bo-Katan."
            legends="Centuries of Mandalorian Crusades; Tarre Vizsla as the first Jedi Mandalore; the Mandalorian-Jedi War; named Mandalore the Indomitable / Ultimate / Preserver."
          />
          <Divergence
            topic="The Sith"
            canon="The Sith Order is reformulated by Bane (~1000 BBY) and ends at Endor (4 ABY); Palpatine secretly survives via the Sith Eternal on Exegol."
            legends="A deeper, older Sith mythology: the Sith species on Korriban, Marka Ragnos, Naga Sadow, Exar Kun, Darth Revan, Darth Plagueis, the One Sith of Darth Krayt centuries after Endor."
          />
          <Divergence
            topic="Force philosophy"
            canon="The Force is broadly dualist (Light vs Dark) with hints of Mortis-era avatars and the World Between Worlds."
            legends="Adds the Unifying Force vs Living Force philosophical schools, the Potentium heresy, the Aing-Tii monks, the Fallanassi, and dozens of other Force traditions."
          />
        </div>
      </section>

      <footer className="text-center text-xs text-muted-foreground py-8 border-t border-border">
        <div className="font-display tracking-widest uppercase">Two Galaxies. One Archive.</div>
        <div className="mt-2">Holocron treats Canon and Legends as parallel valid traditions.</div>
      </footer>
    </div>
  );
}

function ContinuityColumn({
  tone,
  label,
  headline,
  since,
  icon: Icon,
  count,
  paragraphs,
  bullets,
}: {
  tone: "canon" | "legends";
  label: string;
  headline: string;
  since: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  count: number;
  paragraphs: string[];
  bullets: string[];
}) {
  const colorVar = tone === "canon" ? "var(--canon)" : "var(--legends)";
  return (
    <div
      className="rounded-xl border bg-card p-6"
      style={{ borderColor: `hsl(${colorVar} / 0.3)` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" style={{ color: `hsl(${colorVar})` }} />
        <span className="text-[10px] uppercase tracking-[0.32em] font-display" style={{ color: `hsl(${colorVar})` }}>
          {label}
        </span>
      </div>
      <h3 className="font-display text-xl text-foreground leading-tight mb-1">{headline}</h3>
      <div className="text-xs text-muted-foreground font-display tracking-widest uppercase mb-4">
        {since} · {count} entries in this archive
      </div>
      <div className="space-y-3 mb-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-foreground/85">{p}</p>
        ))}
      </div>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-xs text-foreground/80 flex gap-2 leading-relaxed">
            <span style={{ color: `hsl(${colorVar})` }}>▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5">
      <div className="text-[10px] uppercase tracking-[0.32em] text-primary font-display mb-1">Section</div>
      <h2 className="font-display text-xl text-foreground">{title}</h2>
    </div>
  );
}

function PathCard({ title, description, recommendation, color }: { title: string; description: string; recommendation: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
      <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display mb-2">Recommended: {recommendation}</div>
      <div className="font-display text-base text-foreground mb-2">{title}</div>
      <p className="text-xs leading-relaxed text-foreground/75">{description}</p>
    </div>
  );
}

function StatBlock({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={`text-2xl font-display ${accent}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Divergence({ topic, canon, legends }: { topic: string; canon: string; legends: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-3">{topic}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5"><ContinuityBadge value="Canon" /></div>
          <p className="text-xs text-foreground/80 leading-relaxed">{canon}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5"><ContinuityBadge value="Legends" /></div>
          <p className="text-xs text-foreground/80 leading-relaxed">{legends}</p>
        </div>
      </div>
    </div>
  );
}

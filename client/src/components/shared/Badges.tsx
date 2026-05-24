import { Continuity, Essentiality, ForceAlignment, MediaType } from "@/data/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// -----------------------------------------------------------------------------
// Tooltip wrapper
// -----------------------------------------------------------------------------

function WithTip({ tip, children }: { tip: string; children: React.ReactNode }) {
  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        <span className="inline-block cursor-help">{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-snug font-sans">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

// -----------------------------------------------------------------------------
// Continuity (Canon / Legends)
// -----------------------------------------------------------------------------

const CONTINUITY_TIP: Record<Continuity, string> = {
  Canon: "Official Lucasfilm-approved storyline after the April 2014 reset. Binding for the modern saga.",
  Legends: "Pre-2014 Expanded Universe. No longer canon, but archived and frequently re-quarried for new stories.",
  Both: "Material exists in both the modern Canon and the older Legends timeline.",
};

export function ContinuityBadge({ value }: { value: Continuity }) {
  if (value === "Canon") {
    return (
      <WithTip tip={CONTINUITY_TIP.Canon}>
        <span
          className="canon-badge text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded font-mono font-medium"
          data-testid="badge-canon"
        >
          Canon
        </span>
      </WithTip>
    );
  }
  if (value === "Legends") {
    return (
      <WithTip tip={CONTINUITY_TIP.Legends}>
        <span
          className="legends-badge text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded font-mono font-medium"
          data-testid="badge-legends"
        >
          Legends
        </span>
      </WithTip>
    );
  }
  return (
    <WithTip tip={CONTINUITY_TIP.Both}>
      <span className="text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border font-mono font-medium">
        Canon · Legends
      </span>
    </WithTip>
  );
}

// -----------------------------------------------------------------------------
// Essentiality
// -----------------------------------------------------------------------------

const ESS_COLOR: Record<Essentiality, string> = {
  Essential: "bg-primary/15 text-primary border-primary/40",
  Recommended: "bg-[hsl(var(--jedi)/0.15)] text-[hsl(var(--jedi))] border-[hsl(var(--jedi)/0.4)]",
  Supplemental: "bg-muted text-muted-foreground border-border",
  "Deep Lore": "bg-[hsl(var(--nightsister)/0.15)] text-[hsl(var(--nightsister))] border-[hsl(var(--nightsister)/0.4)]",
  Optional: "bg-secondary text-secondary-foreground/70 border-border",
};

const ESS_TIP: Record<Essentiality, string> = {
  Essential: "A pillar of the saga. Skip this and you'll be missing core story beats and character arcs.",
  Recommended: "Strongly enhances key arcs and themes. Worth experiencing for any serious fan.",
  Supplemental: "Fills in side stories, worldbuilding, and minor character beats. Optional but rewarding.",
  "Deep Lore": "Niche, completionist material. Heavy on backstory, mysticism, or obscure corners of the galaxy.",
  Optional: "Skippable side content. Nice-to-have for fans who want every detail.",
};

export function EssentialityBadge({ value }: { value: Essentiality }) {
  return (
    <WithTip tip={ESS_TIP[value]}>
      <span
        className={`text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded border font-mono font-medium ${ESS_COLOR[value]}`}
        data-testid={`badge-ess-${value.toLowerCase().replace(/\s/g, "-")}`}
      >
        {value}
      </span>
    </WithTip>
  );
}

// -----------------------------------------------------------------------------
// Force Alignment
// -----------------------------------------------------------------------------

const ALIGN_CLASS: Record<ForceAlignment, string> = {
  Light: "text-[hsl(var(--jedi))] border-[hsl(var(--jedi)/0.4)]",
  Dark: "text-[hsl(var(--sith))] border-[hsl(var(--sith)/0.4)]",
  Gray: "text-muted-foreground border-border",
  Balance: "text-primary border-primary/40",
  None: "text-muted-foreground border-border",
  Corrupted: "text-[hsl(var(--sith))] border-[hsl(var(--sith)/0.4)]",
  Redeemed: "text-[hsl(var(--jedi))] border-[hsl(var(--jedi)/0.4)]",
};

const ALIGN_TIP: Record<ForceAlignment, string> = {
  Light: "Walks the Jedi path — compassion, selflessness, peace through restraint. Aligned with the Light Side.",
  Dark: "Channels passion, fear, and aggression. Aligned with the Dark Side of the Force.",
  Gray: "Rejects both dogmas. Walks a path between Light and Dark — pragmatic, contextual, often heretical.",
  Balance: "Embodies the prophesied balance — neither dogmatic Light nor seductive Dark.",
  None: "Not Force-sensitive. Their power comes from skill, technology, or sheer will.",
  Corrupted: "Began on the Light path but fell to the Dark Side. The classic Sith origin story.",
  Redeemed: "Lived as Dark, died as Light. Returned to the Light Side before the end.",
};

export function AlignmentBadge({ value }: { value: ForceAlignment }) {
  return (
    <WithTip tip={ALIGN_TIP[value]}>
      <span
        className={`text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded border font-mono font-medium ${ALIGN_CLASS[value]}`}
        data-testid={`badge-align-${value.toLowerCase()}`}
      >
        {value}
      </span>
    </WithTip>
  );
}

// -----------------------------------------------------------------------------
// Media Type — color-coded
// -----------------------------------------------------------------------------

interface MediaTypeStyle {
  dot: string; // bg-color class for dot/pill background
  border: string;
  text: string;
  tip: string;
}

export const MEDIA_TYPE_STYLE: Record<MediaType, MediaTypeStyle> = {
  Film: {
    dot: "bg-[hsl(var(--gold))]",
    border: "border-[hsl(var(--gold)/0.5)]",
    text: "text-[hsl(var(--gold))]",
    tip: "Theatrical feature film — the foundation of the saga.",
  },
  "TV Series": {
    dot: "bg-[hsl(var(--jedi))]",
    border: "border-[hsl(var(--jedi)/0.5)]",
    text: "text-[hsl(var(--jedi))]",
    tip: "Live-action streaming or television series.",
  },
  "Animated Series": {
    dot: "bg-[hsl(var(--nightsister))]",
    border: "border-[hsl(var(--nightsister)/0.5)]",
    text: "text-[hsl(var(--nightsister))]",
    tip: "Animated series — often where Star Wars takes its biggest narrative risks.",
  },
  "Animated Film": {
    dot: "bg-[hsl(var(--rebel))]",
    border: "border-[hsl(var(--rebel)/0.5)]",
    text: "text-[hsl(var(--rebel))]",
    tip: "Theatrical or feature-length animated film.",
  },
  Short: {
    dot: "bg-[hsl(var(--mando))]",
    border: "border-[hsl(var(--mando)/0.5)]",
    text: "text-[hsl(var(--mando))]",
    tip: "Short-form animation or live-action vignette.",
  },
  Game: {
    dot: "bg-[hsl(var(--sith))]",
    border: "border-[hsl(var(--sith)/0.5)]",
    text: "text-[hsl(var(--sith))]",
    tip: "Video game — playable narrative or experience.",
  },
  DLC: {
    dot: "bg-[hsl(var(--sith)/0.65)]",
    border: "border-[hsl(var(--sith)/0.4)]",
    text: "text-[hsl(var(--sith))]",
    tip: "Downloadable content or expansion for a parent video game.",
  },
  VR: {
    dot: "bg-[hsl(var(--holocron))]",
    border: "border-[hsl(var(--holocron)/0.5)]",
    text: "text-[hsl(var(--holocron))]",
    tip: "Virtual-reality experience or interactive immersive piece.",
  },
  Novel: {
    dot: "bg-[hsl(var(--crawl))]",
    border: "border-[hsl(var(--crawl)/0.5)]",
    text: "text-[hsl(var(--crawl))]",
    tip: "Full-length adult novel — the spine of expanded-universe storytelling.",
  },
  "Junior Novel": {
    dot: "bg-[hsl(var(--mando))]",
    border: "border-[hsl(var(--mando)/0.5)]",
    text: "text-[hsl(var(--mando))]",
    tip: "Middle-grade or young-reader novel. Often a tie-in to a film or series.",
  },
  Comic: {
    dot: "bg-[hsl(var(--holocron))]",
    border: "border-[hsl(var(--holocron)/0.5)]",
    text: "text-[hsl(var(--holocron))]",
    tip: "Comic book series or graphic novel.",
  },
  Manga: {
    dot: "bg-[hsl(var(--chart-5))]",
    border: "border-[hsl(var(--chart-5)/0.5)]",
    text: "text-[hsl(var(--chart-5))]",
    tip: "Japanese-style manga adaptation or original work.",
  },
  "Audio Drama": {
    dot: "bg-[hsl(var(--imperial))]",
    border: "border-[hsl(var(--imperial)/0.5)]",
    text: "text-[hsl(var(--imperial))]",
    tip: "Full-cast audio drama or radio play.",
  },
  Anthology: {
    dot: "bg-muted-foreground",
    border: "border-border",
    text: "text-muted-foreground",
    tip: "Anthology — a collection of short stories from multiple authors.",
  },
  Reference: {
    dot: "bg-muted-foreground",
    border: "border-border",
    text: "text-muted-foreground",
    tip: "Reference work — visual dictionary, encyclopedia, or in-universe guide.",
  },
  "Web Series": {
    dot: "bg-[hsl(var(--rebel))]",
    border: "border-[hsl(var(--rebel)/0.5)]",
    text: "text-[hsl(var(--rebel))]",
    tip: "Web-distributed short series — typically free, episodic content.",
  },
};

export function MediaTypeBadge({ value, withTip = true }: { value: MediaType; withTip?: boolean }) {
  const s = MEDIA_TYPE_STYLE[value];
  const inner = (
    <span
      className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded border font-mono font-medium ${s.border} ${s.text}`}
      data-testid={`badge-type-${value.toLowerCase().replace(/\s/g, "-")}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} aria-hidden />
      {value}
    </span>
  );
  return withTip ? <WithTip tip={s.tip}>{inner}</WithTip> : inner;
}

// -----------------------------------------------------------------------------
// Importance bar (with tooltip)
// -----------------------------------------------------------------------------

const IMPORTANCE_TIP: Record<number, string> = {
  1: "Importance 1/5 — minor or background figure.",
  2: "Importance 2/5 — recurring but not central.",
  3: "Importance 3/5 — meaningful presence in the saga.",
  4: "Importance 4/5 — major character or work.",
  5: "Importance 5/5 — a pillar of the entire saga.",
};

export function ImportanceBar({ value }: { value: number }) {
  return (
    <WithTip tip={IMPORTANCE_TIP[value] || `Importance ${value}/5`}>
      <span className="flex items-center gap-0.5" aria-label={`Importance ${value}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`w-1.5 h-3 rounded-sm ${i <= value ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </span>
    </WithTip>
  );
}

// -----------------------------------------------------------------------------
// Page header
// -----------------------------------------------------------------------------

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl relative">
      {eyebrow && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-gradient-to-r from-transparent to-primary" />
          <div className="eyebrow">{eyebrow}</div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
      )}
      <h1
        className="font-display text-4xl md:text-5xl text-foreground mb-4 leading-[1.05] tracking-[0.005em]"
        style={{ textShadow: "0 2px 24px hsl(var(--gold) / 0.15)" }}
      >
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground leading-relaxed text-[14px] max-w-2xl">{description}</p>
      )}
    </div>
  );
}

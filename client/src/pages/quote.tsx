import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/Badges";
import { getQuoteOfDay, QUOTES, SagaQuote } from "@/data/quotes";
import { findCharacter } from "@/data/characters";
import { findEntityById } from "@/lib/entityIndex";
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { useLocation } from "wouter";
import EntityLink from "@/components/shared/EntityLink";
import SmartText from "@/components/shared/SmartText";
import SpoilerVeil from "@/components/shared/SpoilerVeil";
import { useSettings } from "@/lib/settings";
import { Quote as QuoteIcon, Shuffle, Calendar } from "lucide-react";

export default function QuotePage() {
  const today = useMemo(() => new Date(), []);
  const dailyQuote = useMemo(() => getQuoteOfDay(today), [today]);
  const [activeQuote, setActiveQuote] = useState<SagaQuote>(dailyQuote);

  const shuffleQuote = () => {
    const others = QUOTES.filter((q) => q.id !== activeQuote.id);
    const next = others[Math.floor(Math.random() * others.length)];
    setActiveQuote(next);
  };

  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Daily Holocron"
        title="Quote of the Day"
        description="One line from across the galaxy, chosen for today. Every speaker links to their full dossier."
      />

      <div className="flex items-center gap-3 -mt-3 mb-8 text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">
        <Calendar className="w-3 h-3" />
        <span data-testid="quote-date">{dateLabel}</span>
      </div>

      <QuoteCard quote={activeQuote} primary />

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={shuffleQuote}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card/60 hover:border-primary hover:text-primary transition-colors text-xs uppercase tracking-[0.22em] font-display"
          data-testid="button-shuffle-quote"
        >
          <Shuffle className="w-3 h-3" />
          Shuffle another
        </button>
      </div>

      <div className="mt-14">
        <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-display mb-4">
          The Vault — {QUOTES.length} quotes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUOTES.map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveQuote(q)}
              className={`text-left rounded-lg border p-4 transition-all ${
                q.id === activeQuote.id
                  ? "border-primary bg-primary/[0.06]"
                  : "border-border bg-card hover-elevate"
              }`}
              data-testid={`vault-quote-${q.id}`}
            >
              <div className="text-[10.5px] font-serif italic text-foreground/85 leading-snug line-clamp-3">"{q.text}"</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-display">
                — {q.speakerLabel || findCharacter(q.speaker)?.name || q.speaker}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuoteCard({ quote, primary }: { quote: SagaQuote; primary?: boolean }) {
  const speakerChar = findCharacter(quote.speaker);
  const speakerEntity = findEntityById(quote.speaker, "character");
  const isSpoiler = quote.tags?.includes("spoiler");
  const { spoilerVeil } = useSettings();
  const [, setLocation] = useLocation();

  const openSpeaker = () => {
    if (!speakerEntity) return;
    setPendingAnchor({ page: speakerEntity.page, id: speakerEntity.id });
    setLocation(speakerEntity.page);
  };

  const content = (
    <article
      className={`relative rounded-2xl border bg-card/70 backdrop-blur-md px-6 md:px-12 py-10 md:py-14 overflow-hidden ${
        primary ? "border-primary/40 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]" : "border-border"
      }`}
      data-testid="quote-card"
    >
      <div className="absolute -top-3 left-6 text-primary/40">
        <QuoteIcon className="w-12 h-12" strokeWidth={1.4} />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-primary/[0.05] blur-3xl pointer-events-none" />

      <blockquote className="relative font-serif italic text-2xl md:text-3xl leading-snug text-foreground/95 pl-2 md:pl-6">
        "{quote.text}"
      </blockquote>

      <div className="mt-7 pl-2 md:pl-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <div className="text-sm text-muted-foreground">
          —{" "}
          {speakerEntity ? (
            <button
              type="button"
              onClick={openSpeaker}
              className="entity-link font-display tracking-wide"
              data-entity-kind="character"
              data-entity-id={speakerEntity.id}
              data-testid={`quote-speaker-${speakerEntity.id}`}
            >
              {quote.speakerLabel || speakerChar?.name || quote.speaker}
            </button>
          ) : (
            <span className="font-display tracking-wide text-foreground/80">
              {quote.speakerLabel || quote.speaker}
            </span>
          )}
        </div>
        {quote.source && (
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-display">
            <SmartText text={quote.source} maxLinks={2} />
          </div>
        )}
      </div>

      {quote.context && (
        <div className="mt-3 pl-2 md:pl-6 text-xs text-muted-foreground italic max-w-2xl">
          <SmartText text={quote.context} excludeId={quote.speaker} />
        </div>
      )}
    </article>
  );

  // Veil entire card when the quote is itself a major spoiler.
  if (isSpoiler && spoilerVeil) {
    return (
      <SpoilerVeil id={`quote-${quote.id}`} label="Major reveal — click to read">
        {content}
      </SpoilerVeil>
    );
  }
  return content;
}

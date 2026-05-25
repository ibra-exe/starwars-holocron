import { useSettings } from "@/lib/settings";
import { playToggle } from "@/lib/sounds";
import { PageHeader } from "@/components/shared/Badges";
import { Sparkles, Link2, EyeOff, Info, RefreshCw, Trash2, Zap, Volume2 } from "lucide-react";
import { findEntityById } from "@/lib/entityIndex";
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const {
    autoLink,
    setAutoLink,
    spoilerVeil,
    setSpoilerVeil,
    smartTooltip,
    setSmartTooltip,
    animations,
    setAnimations,
    sounds,
    setSounds,
    revealedIds,
    resetReveals,
    resetAll,
  } = useSettings();
  const [, setLocation] = useLocation();

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Holocron Controls"
        title="Settings"
        description="Tune how the Holocron reads itself to you. Toggle automatic cross-page linking, veil major spoilers, and manage what you've already revealed."
      />

      <div className="space-y-5 mt-4">
        <SettingsGroup title="Cross-References" icon={Link2}>
          <Toggle
            label="Auto-link entities across pages"
            description="Detect any character, planet, ship, faction, artifact, species, era, or media mentioned in prose and turn it into a clickable deep-link to its profile."
            value={autoLink}
            onChange={setAutoLink}
            testId="toggle-autolink"
          />
          <Toggle
            label="Show tooltip on hover"
            description="Reveal a short subtitle (faction, classification, etc.) when hovering an auto-link."
            value={smartTooltip}
            onChange={setSmartTooltip}
            disabled={!autoLink}
            testId="toggle-tooltip"
          />
        </SettingsGroup>

        <SettingsGroup title="Spoilers" icon={EyeOff}>
          <Toggle
            label="Spoiler veil"
            description="Hide major narrative reveals — Vader's parentage, Palpatine's return, major deaths, sequel-era surprises — behind a click-to-reveal blur until you choose to see them."
            value={spoilerVeil}
            onChange={setSpoilerVeil}
            testId="toggle-spoiler-veil"
          />
          <div className="pt-3 mt-2 border-t border-border/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-display tracking-wide text-foreground/90">Revealed spoilers</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {revealedIds.length === 0
                    ? "You haven't unveiled anything yet."
                    : `You've revealed ${revealedIds.length} ${revealedIds.length === 1 ? "item" : "items"}.`}
                </div>
              </div>
              {revealedIds.length > 0 && (
                <button
                  type="button"
                  onClick={resetReveals}
                  className="shrink-0 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-display px-3 py-2 rounded-md border border-border hover:border-primary hover:text-primary transition-colors"
                  data-testid="button-reset-reveals"
                >
                  <RefreshCw className="w-3 h-3" />
                  Re-veil all
                </button>
              )}
            </div>
            {revealedIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {revealedIds.map((id) => {
                  const ref = findEntityById(id);
                  if (!ref) {
                    return (
                      <span key={id} className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-muted-foreground">
                        {id}
                      </span>
                    );
                  }
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setPendingAnchor({ page: ref.page, id: ref.id });
                        setLocation(ref.page);
                      }}
                      className="text-[11px] px-2 py-1 rounded border border-border bg-secondary/40 text-foreground/85 hover:border-primary hover:text-primary transition-colors"
                      data-testid={`revealed-${id}`}
                    >
                      {ref.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </SettingsGroup>

        <SettingsGroup title="Motion" icon={Zap}>
          <Toggle
            label="UI animations"
            description="Slide-in menus, fade transitions, and smooth panel entrances. Disable for a snappier experience or if you prefer reduced motion."
            value={animations}
            onChange={(v) => { setAnimations(v); if (sounds) playToggle(v); }}
            testId="toggle-animations"
          />
        </SettingsGroup>

        <SettingsGroup title="Sound Effects" icon={Volume2}>
          <Toggle
            label="Star Wars UI sounds"
            description="Lightsaber hum when the menu opens, R2-D2 chirps on profile cards, and blips for settings toggles. Synthesized in-browser — no audio files downloaded. On iOS, sounds are muted when the device silent switch is on."
            value={sounds}
            onChange={(v) => { setSounds(v); playToggle(v); }}
            testId="toggle-sounds"
          />
        </SettingsGroup>

        <SettingsGroup title="Daily Holocron" icon={Sparkles}>
          <div className="text-sm text-foreground/85">
            The <button onClick={() => setLocation("/quote")} className="entity-link" data-entity-kind="character">Quote of the Day</button> page rotates one notable quote each calendar day, deterministically chosen from the character codex. Tap any speaker's name to open their dossier.
          </div>
        </SettingsGroup>

        <SettingsGroup title="Danger zone" icon={Trash2} subtle>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-display tracking-wide text-foreground/90">Reset all preferences</div>
              <div className="text-xs text-muted-foreground mt-1">Restore defaults and re-veil every revealed spoiler. Theme is preserved.</div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="shrink-0 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-display px-3 py-2 rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
              data-testid="button-reset-all"
            >
              <Trash2 className="w-3 h-3" />
              Reset
            </button>
          </div>
        </SettingsGroup>

        <div className="rounded-md border border-border/60 bg-card/40 px-4 py-3 text-[11px] text-muted-foreground flex gap-3">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" />
          <div>Settings persist to your browser via localStorage. They don't sync across devices.</div>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({
  title,
  icon: Icon,
  subtle,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-xl border ${subtle ? "border-border/40" : "border-border"} bg-card/60 backdrop-blur-sm px-5 py-5`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${subtle ? "text-muted-foreground" : "text-primary"}`} />
        <div className="text-[10px] uppercase tracking-[0.28em] font-display text-muted-foreground">
          {title}
        </div>
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
  disabled,
  testId,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  testId?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-5 py-2 ${disabled ? "opacity-50" : ""}`}>
      <div>
        <div className="text-sm font-display tracking-wide text-foreground/90">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors border ${
          value
            ? "bg-primary/85 border-primary"
            : "bg-secondary/60 border-border"
        }`}
        data-testid={testId}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-background shadow transform transition-transform ${
            value ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

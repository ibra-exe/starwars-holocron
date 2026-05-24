// Global entity index — powers universal cross-page linking.
//
// Builds one searchable table containing every entity (character, faction, planet,
// ship, artifact, species, era, media, force concept, lineage) keyed by its
// canonical name plus aliases. Provides fast longest-match-first scanning over
// arbitrary prose so SmartText can turn any reference into a deep link.

import { CHARACTERS } from "@/data/characters";
import { FACTIONS } from "@/data/factions";
import { PLANETS } from "@/data/planets";
import { SHIPS } from "@/data/ships";
import { ARTIFACTS } from "@/data/artifacts";
import { SPECIES } from "@/data/species";
import { ERAS } from "@/data/eras";
import { MEDIA } from "@/data/media";
import { FORCE_CONCEPTS } from "@/data/force";
import { LINEAGES } from "@/data/lineages";

export type EntityKind =
  | "character"
  | "faction"
  | "planet"
  | "ship"
  | "artifact"
  | "species"
  | "era"
  | "media"
  | "force"
  | "lineage";

export interface EntityRef {
  id: string;
  kind: EntityKind;
  name: string;       // canonical display name
  page: string;       // wouter route, used with setPendingAnchor
  accentVar: string;  // css color token for chips (e.g. "var(--primary)")
  subtitle?: string;
}

const KIND_PAGE: Record<EntityKind, string> = {
  character: "/characters",
  faction: "/factions",
  planet: "/planets",
  ship: "/ships",
  artifact: "/artifacts",
  species: "/species",
  era: "/eras",
  media: "/media",
  force: "/force",
  lineage: "/lineages",
};

const KIND_ACCENT: Record<EntityKind, string> = {
  character: "hsl(var(--rebel))",
  faction: "hsl(var(--sith))",
  planet: "hsl(var(--chart-5))",
  ship: "hsl(var(--imperial))",
  artifact: "var(--primary)" as unknown as string,
  species: "hsl(var(--mando))",
  era: "var(--primary)" as unknown as string,
  media: "hsl(var(--jedi))",
  force: "hsl(var(--nightsister))",
  lineage: "hsl(var(--crawl))",
};

export const KIND_LABEL: Record<EntityKind, string> = {
  character: "Character",
  faction: "Faction",
  planet: "Planet",
  ship: "Ship",
  artifact: "Artifact",
  species: "Species",
  era: "Era",
  media: "Media",
  force: "Force",
  lineage: "Lineage",
};

// Words that should never auto-link, even if matched (too generic / ambiguous /
// trigger nonsense matches inside prose).
const STOPWORDS = new Set<string>([
  "the force", "force", "way", "code", "balance", "order", "way of the", "the way",
  "the order", "the empire", "the republic", "the resistance", "the rebellion",
  "the senate", "han", "luke", "leia", // short single-word ambiguous names handled separately
  "ben", "rey", "din", "kyle", "ezra", "sabine", "iden",
]);

// Single-token aliases need to be longer than this to qualify on their own.
// (Prevents "Han" inside "handle", "Rey" inside "Reyes", etc. — boundary regex
// already handles a lot but we still skip these as single-word entries.)
const SHORT_NAME_BLOCKLIST = new Set<string>([
  "han", "luke", "leia", "rey", "ben", "din", "kyle", "ezra", "iden",
  "ren", "mando", "boba", "owen", "beru", "jyn", "cal", "cad", "poe",
]);

function shouldAcceptAlias(raw: string): boolean {
  const t = raw.trim();
  if (!t) return false;
  if (t.length < 4) return false;
  const lower = t.toLowerCase();
  if (STOPWORDS.has(lower)) return false;
  if (!t.match(/[a-zA-Z]/)) return false;
  // Block single-token short names — only allow short names if multi-word
  if (!t.includes(" ") && SHORT_NAME_BLOCKLIST.has(lower)) return false;
  return true;
}

interface IndexEntry {
  match: string;        // lowercase, what to test against
  pattern: string;      // case-insensitive regex source with word boundaries
  length: number;
  ref: EntityRef;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build the index once at module load.
const ENTITIES: EntityRef[] = [];
const ALIAS_INDEX: IndexEntry[] = [];
// Fast O(1) name lookup for things like "Show me Yoda" hovers / [[Yoda]]-style tags.
const NAME_LOOKUP = new Map<string, EntityRef>(); // lower(name) → ref
const ID_LOOKUP = new Map<string, EntityRef>(); // `${kind}:${id}` → ref + plain `id`

function register(entity: EntityRef, names: string[]) {
  ENTITIES.push(entity);
  ID_LOOKUP.set(`${entity.kind}:${entity.id}`, entity);
  // Also a non-namespaced lookup (last-write-wins) for convenience
  if (!ID_LOOKUP.has(entity.id)) ID_LOOKUP.set(entity.id, entity);
  for (const n of names) {
    if (!shouldAcceptAlias(n)) continue;
    const lower = n.toLowerCase();
    if (!NAME_LOOKUP.has(lower)) NAME_LOOKUP.set(lower, entity);
    ALIAS_INDEX.push({
      match: lower,
      pattern: escapeRegex(n),
      length: n.length,
      ref: entity,
    });
  }
}

function expandCharacterNames(name: string): string[] {
  // "Anakin Skywalker / Darth Vader" → ["Anakin Skywalker / Darth Vader", "Anakin Skywalker", "Darth Vader"]
  const out = [name];
  const parts = name.split(/\s+\/\s+/);
  if (parts.length > 1) out.push(...parts);
  return out;
}

for (const c of CHARACTERS) {
  const ref: EntityRef = {
    id: c.id,
    kind: "character",
    name: c.name,
    page: KIND_PAGE.character,
    accentVar: KIND_ACCENT.character,
    subtitle: [c.category, c.species].filter(Boolean).join(" · "),
  };
  const names = [...expandCharacterNames(c.name), ...(c.aliases ?? [])];
  register(ref, names);
}
for (const f of FACTIONS) {
  const ref: EntityRef = {
    id: f.id,
    kind: "faction",
    name: f.name,
    page: KIND_PAGE.faction,
    accentVar: KIND_ACCENT.faction,
    subtitle: `${f.alignment} · ${f.category}`,
  };
  const names = [f.name];
  if (f.shortName && f.shortName !== f.name) names.push(f.shortName);
  register(ref, names);
}
for (const p of PLANETS) {
  const ref: EntityRef = {
    id: p.id,
    kind: "planet",
    name: p.name,
    page: KIND_PAGE.planet,
    accentVar: KIND_ACCENT.planet,
    subtitle: p.classification,
  };
  register(ref, [p.name]);
}
for (const s of SHIPS) {
  const ref: EntityRef = {
    id: s.id,
    kind: "ship",
    name: s.name,
    page: KIND_PAGE.ship,
    accentVar: KIND_ACCENT.ship,
    subtitle: s.category,
  };
  register(ref, [s.name]);
}
for (const a of ARTIFACTS) {
  const ref: EntityRef = {
    id: a.id,
    kind: "artifact",
    name: a.name,
    page: KIND_PAGE.artifact,
    accentVar: KIND_ACCENT.artifact,
    subtitle: a.category,
  };
  register(ref, [a.name]);
}
for (const sp of SPECIES) {
  const ref: EntityRef = {
    id: sp.id,
    kind: "species",
    name: sp.name,
    page: KIND_PAGE.species,
    accentVar: KIND_ACCENT.species,
    subtitle: sp.classification,
  };
  register(ref, [sp.name]);
}
for (const e of ERAS) {
  const ref: EntityRef = {
    id: e.id,
    kind: "era",
    name: e.name,
    page: KIND_PAGE.era,
    accentVar: KIND_ACCENT.era,
    subtitle: e.tagline,
  };
  // Also accept the shortName when distinct
  const names = [e.name];
  if (e.shortName && e.shortName !== e.name) names.push(e.shortName);
  register(ref, names);
}
for (const m of MEDIA) {
  const ref: EntityRef = {
    id: m.id,
    kind: "media",
    name: m.title,
    page: KIND_PAGE.media,
    accentVar: KIND_ACCENT.media,
    subtitle: `${m.type} · ${m.continuity}`,
  };
  register(ref, [m.title]);
}
for (const fc of FORCE_CONCEPTS) {
  const ref: EntityRef = {
    id: fc.id,
    kind: "force",
    name: fc.name,
    page: KIND_PAGE.force,
    accentVar: KIND_ACCENT.force,
    subtitle: fc.category,
  };
  register(ref, [fc.name]);
}
for (const l of LINEAGES) {
  const ref: EntityRef = {
    id: l.id,
    kind: "lineage",
    name: l.name,
    page: KIND_PAGE.lineage,
    accentVar: KIND_ACCENT.lineage,
    subtitle: l.type,
  };
  register(ref, [l.name]);
}

// Sort by length DESC so longest matches consume first ("Darth Vader" before "Vader")
ALIAS_INDEX.sort((a, b) => b.length - a.length);

// Pre-compile combined matcher
const COMBINED_RE = (() => {
  if (ALIAS_INDEX.length === 0) return null;
  // Word boundaries via (^|[^A-Za-z0-9_'-]) and ($|[^A-Za-z0-9_'-]) — we need
  // boundaries that also exclude apostrophes/hyphens (so "Skywalker's" matches Skywalker).
  // Native \b doesn't handle apostrophes, so we use a custom group.
  const alternation = ALIAS_INDEX.map((e) => e.pattern).join("|");
  return new RegExp(`(?<![A-Za-z0-9])(?:${alternation})(?![A-Za-z0-9])`, "gi");
})();

// Lookup-by-lowercase-match for replacement
const LOWER_TO_REF = (() => {
  const m = new Map<string, EntityRef>();
  for (const e of ALIAS_INDEX) {
    if (!m.has(e.match)) m.set(e.match, e.ref);
  }
  return m;
})();

export interface Token {
  type: "text" | "entity";
  text: string;
  ref?: EntityRef;
  matchKey?: string;
}

/**
 * Tokenize a string into text + entity tokens. Returns the original string as
 * a single text token when no matches are found.
 *
 * `excludeId` skips self-references (so a character's bio doesn't link to itself).
 * `excludeKindIds` lets callers suppress specific {kind,id} pairs (e.g. when the
 * surrounding paragraph already has an explicit reference in another widget).
 */
export function tokenize(
  input: string,
  options?: { excludeId?: string; maxLinks?: number },
): Token[] {
  if (!input || !COMBINED_RE) return [{ type: "text", text: input ?? "" }];
  const excludeId = options?.excludeId;
  const maxLinks = options?.maxLinks ?? Infinity;

  // Reset regex
  COMBINED_RE.lastIndex = 0;
  const tokens: Token[] = [];
  let cursor = 0;
  let linked = 0;
  const seen = new Set<string>(); // dedupe to one link per entity per paragraph
  let m: RegExpExecArray | null;
  while ((m = COMBINED_RE.exec(input)) !== null) {
    const matched = m[0];
    const ref = LOWER_TO_REF.get(matched.toLowerCase());
    if (!ref) continue;
    // Skip self-reference
    const idKey = `${ref.kind}:${ref.id}`;
    if (excludeId && (excludeId === ref.id || excludeId === idKey)) continue;
    if (seen.has(idKey)) continue;
    if (linked >= maxLinks) continue;
    if (m.index > cursor) {
      tokens.push({ type: "text", text: input.slice(cursor, m.index) });
    }
    tokens.push({ type: "entity", text: matched, ref, matchKey: idKey });
    seen.add(idKey);
    linked++;
    cursor = m.index + matched.length;
  }
  if (cursor < input.length) {
    tokens.push({ type: "text", text: input.slice(cursor) });
  }
  return tokens.length > 0 ? tokens : [{ type: "text", text: input }];
}

export function findEntityByName(name: string): EntityRef | undefined {
  if (!name) return undefined;
  return NAME_LOOKUP.get(name.toLowerCase());
}

export function findEntityById(id: string, kind?: EntityKind): EntityRef | undefined {
  if (kind) return ID_LOOKUP.get(`${kind}:${id}`);
  return ID_LOOKUP.get(id);
}

export function getAllEntities(): EntityRef[] {
  return ENTITIES;
}

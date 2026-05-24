// Curated registry of major Star Wars spoilers.
//
// When the user enables Spoiler Veil, the Holocron blurs:
//   - notableQuote + bio for characters in CHARACTER_SPOILERS
//   - died field for characters in DEATH_SPOILERS
//   - family relations marked as "twist" reveals
//   - selected lineage/era/media descriptions
//
// IDs match the canonical id used in the rest of the codebase.

export const SPOILER_CHARACTERS: Record<string, { reason: string; mediaContext?: string }> = {
  // Identity / parentage reveals
  "anakin-skywalker": { reason: "Vader's identity reveal", mediaContext: "Empire Strikes Back" },
  "luke-skywalker": { reason: "Parentage reveal", mediaContext: "Empire Strikes Back" },
  "leia-organa": { reason: "Twin sibling reveal", mediaContext: "Return of the Jedi" },
  "ben-solo": { reason: "Kylo Ren turn", mediaContext: "Force Awakens" },
  "rey-skywalker": { reason: "Palpatine lineage reveal", mediaContext: "Rise of Skywalker" },
  "sheev-palpatine": { reason: "Resurrected in sequels", mediaContext: "Rise of Skywalker" },
  "din-djarin": { reason: "Mandalorian creed reveal" },
  "grogu": { reason: "Origin / Jedi training" },
  "ahsoka-tano": { reason: "Survived Order 66 / world between worlds" },
  "ezra-bridger": { reason: "Disappearance with Thrawn" },
  "starkiller": { reason: "Force Unleashed identity" },
  "revan": { reason: "Old Republic identity twist" },
};

// Characters whose deaths are major narrative beats — when veil is on, the
// `died` field & death-related bio is hidden until revealed.
export const DEATH_SPOILER_IDS = new Set<string>([
  "han-solo",
  "luke-skywalker",
  "leia-organa",
  "anakin-skywalker",
  "obi-wan-kenobi",
  "yoda",
  "mace-windu",
  "padme-amidala",
  "qui-gon-jinn",
  "ahsoka-tano",
  "ben-solo",
  "sheev-palpatine",
  "boba-fett",
  "jango-fett",
  "count-dooku",
  "darth-maul",
  "grand-moff-tarkin",
  "snoke",
  "shmi-skywalker",
]);

// Era ids whose existence/events are spoilers for first-time saga viewers
export const SPOILER_ERAS = new Set<string>([
  "first-order-era",
  "resistance-era",
  "post-sequel",
  "new-jedi-order",
]);

export function isCharacterSpoiler(id: string): boolean {
  return id in SPOILER_CHARACTERS;
}

export function isDeathSpoiler(id: string): boolean {
  return DEATH_SPOILER_IDS.has(id);
}

export function isEraSpoiler(id: string): boolean {
  return SPOILER_ERAS.has(id);
}

export function getSpoilerReason(id: string): string | undefined {
  return SPOILER_CHARACTERS[id]?.reason;
}

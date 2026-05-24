// Core type definitions for the Star Wars Lore Intelligence System

export type Continuity = "Canon" | "Legends" | "Both";

export type MediaType =
  | "Film"
  | "TV Series"
  | "Animated Series"
  | "Animated Film"
  | "Short"
  | "Game"
  | "DLC"
  | "VR"
  | "Novel"
  | "Junior Novel"
  | "Comic"
  | "Manga"
  | "Audio Drama"
  | "Anthology"
  | "Reference"
  | "Web Series";

export type Essentiality =
  | "Essential"
  | "Recommended"
  | "Supplemental"
  | "Deep Lore"
  | "Optional";

export type EraId =
  | "dawn-of-jedi"
  | "old-republic"
  | "high-republic"
  | "fall-of-republic"
  | "clone-wars"
  | "rise-of-empire"
  | "imperial-era"
  | "rebellion-era"
  | "new-republic-era"
  | "first-order-era"
  | "resistance-era"
  | "new-jedi-order"
  | "post-sequel";

export type ForceAlignment =
  | "Light"
  | "Dark"
  | "Gray"
  | "Balance"
  | "None"
  | "Corrupted"
  | "Redeemed";

export interface Era {
  id: EraId;
  name: string;
  shortName: string;
  startBBY: number; // negative ABY = BBY; positive = ABY
  endBBY: number;
  tagline: string;
  political: string;
  dominantFactions: string[];
  majorWars: string[];
  ideologicalConflicts: string[];
  technological: string;
  keyMedia: string[]; // media ids
  keyCharacters: string[]; // character ids
  description: string;
  color: string; // hex/css color for visual identity
}

export interface MediaEntry {
  id: string;
  title: string;
  type: MediaType;
  releaseYear: number; // real-world year
  inUniverseDate: string; // human label e.g. "0 BBY", "9 ABY", "5000 BBY"
  inUniverseSortKey: number; // numeric sortable BBY (negative=before, positive=after)
  era: EraId | EraId[];
  continuity: Continuity;
  essentiality: Essentiality;
  summary: string;
  keyCharacters: string[];
  factions: string[];
  events?: string[];
  importance: 1 | 2 | 3 | 4 | 5; // 5 = pillar of the saga
  director?: string;
  creator?: string;
  author?: string;
  parent?: string; // for arcs/seasons
}

export interface Affiliation {
  faction: string;
  from?: string; // era / date label
  to?: string;
  role?: string;
}

export interface Character {
  id: string;
  name: string;
  aliases?: string[];
  species: string;
  homeworld?: string;
  gender?: string;
  born?: string;
  died?: string;
  status: "Alive" | "Deceased" | "Unknown" | "Redeemed/Deceased" | "One with the Force";
  forceAlignment: ForceAlignment;
  forceSensitive: boolean;
  rank?: string;
  imageUrl?: string; // real portrait photo for the visual plate
  affiliations: Affiliation[]; // ordered timeline
  master?: string;
  apprentices?: string[];
  family?: { relation: string; characterId: string }[];
  romantic?: string[];
  rivals?: string[];
  loyaltyTimeline: { era: EraId; label: string; alignment: string }[];
  appearances: string[]; // media ids
  bio: string;
  notableQuote?: string;
  importance: 1 | 2 | 3 | 4 | 5;
  category: "Jedi" | "Sith" | "Mandalorian" | "Bounty Hunter" | "Clone" | "Senator" | "Smuggler" | "Crime" | "Inquisitor" | "Nightsister" | "Droid" | "Imperial" | "Rebel" | "Resistance" | "First Order" | "Civilian" | "Other";
}

export interface FactionRank {
  title: string;
  tier?: number; // 1 = top of hierarchy, increasing as it descends
  holder?: string; // free-text current/notable holder
  holderCharacterId?: string; // link to a character profile
  description: string;
}

export interface Faction {
  id: string;
  name: string;
  shortName?: string;
  ideology: string;
  origin: string; // when/where founded
  founded?: string;
  dissolved?: string;
  eras: EraId[];
  structure: string;
  leadership: { name: string; characterId?: string; period?: string }[];
  ranks?: FactionRank[]; // ordered top → bottom of the hierarchy
  militaryBranches?: string[];
  enemies: string[]; // faction ids
  allies: string[];
  successors?: string[];
  predecessors?: string[];
  symbol: string; // emoji or short symbol description
  philosophy: string;
  riseAndFall: { era: EraId; event: string }[];
  importantEvents: string[];
  description: string;
  category: "Government" | "Religious Order" | "Military" | "Rebellion" | "Criminal" | "Corporate" | "Culture" | "Cult" | "Guild" | "Other";
  alignment: "Light" | "Dark" | "Neutral" | "Mixed";
  color: string; // primary css color
}

export interface ForceConcept {
  id: string;
  name: string;
  category: "Philosophy" | "Phenomenon" | "Artifact" | "Cult" | "Prophecy" | "Entity";
  summary: string;
  details: string;
  relatedFactions: string[];
  relatedCharacters: string[];
}

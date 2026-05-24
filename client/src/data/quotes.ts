// Hand-curated quote registry — the most resonant lines from across the saga.
// Each quote is tagged to a speaker by character id so we can deep-link to the dossier.
//
// Quote IDs are stable so the daily seed picks the same quote on the same calendar day.

export interface SagaQuote {
  id: string;
  text: string;
  speaker: string;       // character id
  speakerLabel?: string; // optional override label (e.g. "Vader" vs "Anakin Skywalker")
  context?: string;      // where / when
  era?: string;          // era id (optional)
  source?: string;       // film/series/book
  tags?: string[];
  importance?: 1 | 2 | 3 | 4 | 5;
}

export const QUOTES: SagaQuote[] = [
  // ===== ORIGINAL TRILOGY =====
  { id: "q-help-me-obi-wan", text: "Help me, Obi-Wan Kenobi. You're my only hope.", speaker: "leia-organa", context: "Holo message to Obi-Wan", source: "A New Hope", era: "rebellion-era", importance: 5 },
  { id: "q-may-the-force", text: "May the Force be with you.", speaker: "obi-wan-kenobi", context: "Said many times across the saga", source: "A New Hope", era: "rebellion-era", importance: 5 },
  { id: "q-luke-i-am-your-father", text: "No. I am your father.", speaker: "anakin-skywalker", speakerLabel: "Darth Vader", context: "Cloud City duel", source: "The Empire Strikes Back", era: "rebellion-era", importance: 5, tags: ["spoiler"] },
  { id: "q-do-or-do-not", text: "Do. Or do not. There is no try.", speaker: "yoda", context: "Training Luke on Dagobah", source: "The Empire Strikes Back", era: "rebellion-era", importance: 5 },
  { id: "q-fear-leads", text: "Fear is the path to the dark side. Fear leads to anger, anger leads to hate, hate leads to suffering.", speaker: "yoda", context: "Testing Anakin before the Jedi Council", source: "The Phantom Menace", era: "fall-of-republic", importance: 5 },
  { id: "q-i-know", text: "I love you. — I know.", speaker: "han-solo", context: "Cloud City, before being frozen in carbonite", source: "The Empire Strikes Back", era: "rebellion-era", importance: 5 },
  { id: "q-look-at-me", text: "Let me look on you with my own eyes.", speaker: "anakin-skywalker", speakerLabel: "Anakin Skywalker", context: "Dying after the Emperor's defeat", source: "Return of the Jedi", era: "rebellion-era", importance: 4, tags: ["spoiler"] },

  // ===== PREQUEL TRILOGY =====
  { id: "q-darksecrets", text: "You were the Chosen One! It was said that you would destroy the Sith, not join them!", speaker: "obi-wan-kenobi", context: "Mustafar duel", source: "Revenge of the Sith", era: "fall-of-republic", importance: 5 },
  { id: "q-from-my-pov", text: "From my point of view the Jedi are evil!", speaker: "anakin-skywalker", speakerLabel: "Anakin Skywalker", context: "Mustafar duel", source: "Revenge of the Sith", era: "fall-of-republic", importance: 4 },
  { id: "q-only-sith", text: "Only a Sith deals in absolutes.", speaker: "obi-wan-kenobi", context: "Mustafar duel", source: "Revenge of the Sith", era: "fall-of-republic", importance: 4 },
  { id: "q-hello-there", text: "Hello there.", speaker: "obi-wan-kenobi", context: "Greeting General Grievous", source: "Revenge of the Sith", era: "fall-of-republic", importance: 3 },
  { id: "q-this-is-where", text: "This is where the fun begins.", speaker: "anakin-skywalker", speakerLabel: "Anakin Skywalker", context: "Boarding the Invisible Hand", source: "Revenge of the Sith", era: "fall-of-republic", importance: 3 },
  { id: "q-not-afraid", text: "I'm not afraid. — You will be. You will be.", speaker: "yoda", context: "Luke entering the cave on Dagobah", source: "The Empire Strikes Back", era: "rebellion-era", importance: 4 },
  { id: "q-have-bad-feeling", text: "I have a bad feeling about this.", speaker: "han-solo", context: "Recurring line across the saga", source: "Various", importance: 3 },
  { id: "q-power", text: "Unlimited power!", speaker: "sheev-palpatine", context: "Killing the Jedi Masters in the Chancellor's office", source: "Revenge of the Sith", era: "fall-of-republic", importance: 4 },
  { id: "q-tragedy", text: "Did you ever hear the tragedy of Darth Plagueis the Wise?", speaker: "sheev-palpatine", context: "The opera house, seducing Anakin", source: "Revenge of the Sith", era: "fall-of-republic", importance: 5 },
  { id: "q-democracy-dies", text: "So this is how liberty dies. With thunderous applause.", speaker: "padme-amidala", context: "Palpatine's emergency powers", source: "Revenge of the Sith", era: "fall-of-republic", importance: 5 },

  // ===== CLONE WARS / REBELS =====
  { id: "q-snips", text: "I am no Jedi.", speaker: "ahsoka-tano", context: "Confronting Maul on Mandalore", source: "The Clone Wars", era: "clone-wars", importance: 4 },
  { id: "q-ghost-of-you", text: "I will avenge what you've done… not as a Jedi, but as someone who loved your son.", speaker: "ahsoka-tano", context: "Confronting Vader at the Sith Temple on Malachor", source: "Rebels", era: "imperial-era", importance: 4, tags: ["spoiler"] },
  { id: "q-revenge", text: "Once more, the Sith will rule the galaxy. And we shall have peace.", speaker: "darth-maul", context: "Final words", source: "Rebels", era: "imperial-era", importance: 3 },

  // ===== MANDALORIAN / BOOK OF BOBA =====
  { id: "q-this-is-the-way", text: "This is the Way.", speaker: "din-djarin", context: "Mandalorian creed affirmation", source: "The Mandalorian", era: "new-republic-era", importance: 5 },
  { id: "q-i-have-spoken", text: "I have spoken.", speaker: "kuiil", context: "Repeatedly", source: "The Mandalorian", era: "new-republic-era", importance: 3 },
  { id: "q-bounty", text: "I'm a simple man making his way through the galaxy.", speaker: "jango-fett", context: "Meeting Obi-Wan on Kamino", source: "Attack of the Clones", era: "fall-of-republic", importance: 3 },

  // ===== SEQUEL TRILOGY =====
  { id: "q-let-the-past-die", text: "Let the past die. Kill it, if you have to.", speaker: "ben-solo", speakerLabel: "Kylo Ren", context: "Throne room confrontation with Rey", source: "The Last Jedi", era: "resistance-era", importance: 4, tags: ["spoiler"] },
  { id: "q-rebellions-built", text: "Rebellions are built on hope.", speaker: "jyn-erso", context: "Convincing the Rebel Alliance to fight", source: "Rogue One", era: "rebellion-era", importance: 5 },
  { id: "q-im-one-with-force", text: "I am one with the Force, and the Force is with me.", speaker: "chirrut-imwe", context: "Mantra on Scarif", source: "Rogue One", era: "rebellion-era", importance: 4 },
  { id: "q-rey-skywalker", text: "Rey. Just Rey.", speaker: "rey-skywalker", context: "Meeting Luke on Ahch-To", source: "The Last Jedi", era: "resistance-era", importance: 3 },
  { id: "q-no-one-ever", text: "No one's ever really gone.", speaker: "luke-skywalker", context: "To Leia on Crait", source: "The Last Jedi", era: "resistance-era", importance: 4 },

  // ===== JEDI WISDOM =====
  { id: "q-truly-wonderful", text: "Truly wonderful, the mind of a child is.", speaker: "yoda", context: "On Geonosis", source: "Attack of the Clones", era: "fall-of-republic", importance: 3 },
  { id: "q-luminous", text: "Luminous beings are we, not this crude matter.", speaker: "yoda", context: "Training Luke on Dagobah", source: "The Empire Strikes Back", era: "rebellion-era", importance: 5 },
  { id: "q-jedi-business", text: "The Force will be with you. Always.", speaker: "obi-wan-kenobi", context: "Last words to Luke", source: "A New Hope", era: "rebellion-era", importance: 5 },
  { id: "q-jedi-master", text: "In a dark place we find ourselves, and a little more knowledge lights our way.", speaker: "yoda", source: "Revenge of the Sith", era: "fall-of-republic", importance: 3 },

  // ===== SITH WISDOM =====
  { id: "q-peace-is-a-lie", text: "Peace is a lie, there is only passion. Through passion, I gain strength.", speaker: "revan", context: "The Sith Code", source: "Knights of the Old Republic", era: "old-republic", importance: 5 },
  { id: "q-ironic", text: "He could save others from death, but not himself.", speaker: "sheev-palpatine", context: "The tragedy of Darth Plagueis", source: "Revenge of the Sith", era: "fall-of-republic", importance: 4 },
];

/**
 * Deterministic daily pick — same calendar day = same quote.
 */
export function getQuoteOfDay(date: Date = new Date()): SagaQuote {
  // YYYY-MM-DD seed in user's local time
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const seed = parseInt(`${y}${m}${d}`, 10);
  const idx = seed % QUOTES.length;
  return QUOTES[idx];
}

export function findQuote(id: string): SagaQuote | undefined {
  return QUOTES.find((q) => q.id === id);
}

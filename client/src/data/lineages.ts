// Family Trees & Mentor Lineages — Star Wars Holocron App

import { EraId } from "./types";

export type LineageType =
  | "Bloodline"
  | "Master-Apprentice (Jedi)"
  | "Master-Apprentice (Sith)"
  | "Clan"
  | "Mentor Chain"
  | "Adopted Family";

export interface LineageNode {
  id: string;
  name: string;
  characterId?: string;
  role?: string;
  era?: EraId;
  note?: string;
  alignment?: "Light" | "Dark" | "Gray" | "Balance" | "None" | "Corrupted" | "Redeemed";
  parents?: string[];
  master?: string;
  apprentices?: string[];
  children?: string[];
  spouse?: string;
  siblings?: string[];
}

export interface Lineage {
  id: string;
  name: string;
  type: LineageType;
  summary: string;
  description: string;
  thematicArc: string;
  spans: EraId[];
  nodes: LineageNode[];
  rootId: string;
  notableEvents: { era: EraId; event: string }[];
  affiliations: string[];
  continuity: "Canon" | "Legends" | "Both";
  importance: 1 | 2 | 3 | 4 | 5;
  color: string;
}

export const LINEAGES: Lineage[] = [
  // ─────────────────────────────────────────────
  // 1. SKYWALKER BLOODLINE
  // ─────────────────────────────────────────────
  {
    id: "skywalker-bloodline",
    name: "The Skywalker Bloodline",
    type: "Bloodline",
    summary:
      "The most Force-potent family in galactic history, stretching from a slave girl's miraculous pregnancy on Tatooine to the last inheritor of the name across three generations of war and redemption.",
    description:
      "Shmi Skywalker bore Anakin with no father — the midi-chlorians themselves are implied to have conceived him, possibly through Darth Plagueis's experiments in manipulating life. Anakin rose to become the Chosen One, secretly wed Padmé Amidala, and fell to the dark side as Darth Vader before his children — twins Luke and Leia — were hidden from him and raised worlds apart. Luke was sent to Tatooine under the care of his uncle Owen and aunt Beru Lars, while Leia was adopted by Bail and Breha Organa of Alderaan. Both siblings eventually joined the Rebel Alliance, and Luke's confrontation with Vader on the second Death Star fulfilled the ancient prophecy by drawing Anakin back to the light. Leia married Han Solo, and their son Ben Solo later fell to darkness as Kylo Ren before a partial redemption. After the final battle of Exegol, Rey — a clone's granddaughter who trained under Luke and Leia — chose to carry on the name Skywalker, completing a legacy of light that spanned nearly a century of galactic conflict.",
    thematicArc:
      "The Skywalker line is the saga's master narrative of inherited power and inherited trauma: each generation must confront the same temptation — fear transmuted into control — that destroyed Anakin. Luke breaks the cycle not through strength but through unconditional love, mirroring the motherly grace Shmi embodied and Padmé died carrying. Leia represents the political and emotional cost of the bloodline, sacrificing a normal life to a galaxy she was never meant to rule. The line's conclusion — Rey choosing the name freely rather than bearing it by blood — argues that legacy is not inheritance but choice.",
    spans: [
      "fall-of-republic",
      "clone-wars",
      "rise-of-empire",
      "imperial-era",
      "rebellion-era",
      "new-republic-era",
      "first-order-era",
      "resistance-era",
    ],
    rootId: "shmi",
    nodes: [
      {
        id: "shmi",
        name: "Shmi Skywalker",
        characterId: "shmi-skywalker",
        role: "Matriarch / Origin",
        era: "fall-of-republic",
        alignment: "None",
        children: ["anakin"],
        note:
          "A slave on Tatooine who bore Anakin without a biological father, Shmi's quiet strength and unconditional love shaped Anakin's deepest emotional core. Her capture and death at the hands of Tusken Raiders was the first crack in Anakin's resolve.",
      },
      {
        id: "anakin",
        name: "Anakin Skywalker / Darth Vader",
        characterId: "anakin-skywalker",
        role: "The Chosen One / Fallen Knight",
        era: "clone-wars",
        alignment: "Redeemed",
        parents: ["shmi"],
        spouse: "padme",
        children: ["luke", "leia"],
        note:
          "Born of the Force itself, Anakin was the most powerful Force-sensitive in recorded history. His fall to the dark side as Darth Vader and ultimate redemption by his son Luke fulfilled the Prophecy of the Chosen One, destroying Palpatine and restoring balance.",
      },
      {
        id: "padme",
        name: "Padmé Amidala",
        characterId: "padme-amidala",
        role: "Mother / Senator of Naboo",
        era: "clone-wars",
        alignment: "None",
        spouse: "anakin",
        children: ["luke", "leia"],
        note:
          "Queen-turned-Senator who secretly wed Anakin and died shortly after giving birth to the twins, broken by Anakin's fall. Her dying words — that there was still good in him — proved prophetic decades later.",
      },
      {
        id: "luke",
        name: "Luke Skywalker",
        characterId: "luke-skywalker",
        role: "Last Jedi / Redeemer",
        era: "rebellion-era",
        alignment: "Light",
        parents: ["anakin", "padme"],
        siblings: ["leia"],
        note:
          "Hidden on Tatooine and raised by Owen and Beru Lars, Luke became the galaxy's last hope, defeated the Emperor through compassion rather than combat, and later trained a new generation of Jedi — including Ben Solo and Rey.",
      },
      {
        id: "leia",
        name: "Leia Organa",
        characterId: "leia-organa",
        role: "Princess / General / Jedi-trained",
        era: "rebellion-era",
        alignment: "Light",
        parents: ["anakin", "padme"],
        siblings: ["luke"],
        spouse: "han",
        children: ["ben-solo"],
        note:
          "Adopted by the Organas of Alderaan and raised a princess and senator, Leia became the heart of the Rebellion and later the Resistance. She completed her Jedi training late in life under Luke's tutelage, passing the knowledge on to Rey.",
      },
      {
        id: "han",
        name: "Han Solo",
        characterId: "han-solo",
        role: "Father / Smuggler-turned-General",
        era: "rebellion-era",
        alignment: "None",
        spouse: "leia",
        children: ["ben-solo"],
        note:
          "The Corellian smuggler who married Leia Organa and fathered Ben Solo. His murder at the hands of his own son on Starkiller Base haunted Ben Solo until his dying moment of redemption.",
      },
      {
        id: "ben-solo",
        name: "Ben Solo / Kylo Ren",
        characterId: "ben-solo",
        role: "Fallen Son / Redeemed",
        era: "first-order-era",
        alignment: "Redeemed",
        parents: ["leia", "han"],
        note:
          "The only biological child of Han and Leia, Ben Solo fell to the dark side under Snoke's manipulation and his uncle Luke's momentary failure of nerve. He killed his father, clashed repeatedly with Rey, and ultimately sacrificed his life to resurrect her after defeating the Emperor.",
      },
      {
        id: "rey-skywalker",
        name: "Rey Skywalker (née Palpatine)",
        characterId: "rey",
        role: "Adopted Daughter / Last Skywalker",
        era: "resistance-era",
        alignment: "Light",
        note:
          "Granddaughter of Emperor Palpatine through a strand-cast son, Rey was trained by Luke and Leia and chose to adopt the name Skywalker after Exegol. Her choice transforms the bloodline from biology into ideology — the Skywalker name as a beacon of light.",
      },
    ],
    notableEvents: [
      { era: "fall-of-republic", event: "Anakin Skywalker born of the Force on Tatooine — no father" },
      { era: "clone-wars", event: "Anakin and Padmé secretly wed on Naboo" },
      { era: "rise-of-empire", event: "Twins Luke and Leia born; Padmé dies; Anakin fully becomes Darth Vader" },
      { era: "rebellion-era", event: "Luke reveals the truth of Vader's identity to Leia; Anakin redeemed and dies" },
      { era: "first-order-era", event: "Ben Solo falls to darkness and kills Han Solo on Starkiller Base" },
      { era: "resistance-era", event: "Rey defeats Palpatine on Exegol; adopts the Skywalker name" },
    ],
    affiliations: ["jedi-order", "galactic-republic", "galactic-empire", "rebel-alliance", "resistance"],
    continuity: "Canon",
    importance: 5,
    color: "#d4a849",
  },

  // ─────────────────────────────────────────────
  // 2. PALPATINE BLOODLINE
  // ─────────────────────────────────────────────
  {
    id: "palpatine-bloodline",
    name: "The Palpatine Bloodline",
    type: "Bloodline",
    summary:
      "The dark mirror of the Skywalker line: a dynasty of engineered corruption rooted in Sheev Palpatine's obsession with immortality, producing an unwanted son and a granddaughter who rejected everything her blood demanded.",
    description:
      "Sheev Palpatine, Darth Sidious, spent decades mastering Sith alchemy and the manipulation of midi-chlorians, seeking the secret of eternal life that his own master Plagueis discovered but never perfected. After his apparent death above Endor, Palpatine transferred his essence into a clone body on Exegol and created what the novelization describes as a 'strand-cast' clone son — a biological vessel without Force sensitivity, produced purely to sire an heir. That unnamed son grew up, fell in love, fathered Rey, and fled Palpatine's control, eventually being murdered by Palpatine's Sith Eternal cult when Rey was still a small child. Rey was hidden on Jakku to keep her safe, unaware of her heritage. The bloodline is thus a story of a tyrant who could not die and a granddaughter who refused to become what her blood demanded, choosing light and the Skywalker name instead.",
    thematicArc:
      "Where the Skywalker bloodline represents power turning toward love and sacrifice, the Palpatine line represents power turning on itself — a man so afraid of death that he manufactured heirs as tools rather than people. The unnamed son's rebellion and his daughter Rey's ultimate rejection of the name are the bloodline's only moments of grace. Palpatine's mistake was assuming that blood could guarantee loyalty and darkness, overlooking that the same cosmic Force that created Anakin could cultivate light in anyone.",
    spans: ["old-republic", "fall-of-republic", "rise-of-empire", "imperial-era", "rebellion-era", "resistance-era"],
    rootId: "palpatine",
    nodes: [
      {
        id: "palpatine",
        name: "Sheev Palpatine / Darth Sidious",
        characterId: "darth-sidious",
        role: "Dark Lord / Founding Patriarch",
        era: "fall-of-republic",
        alignment: "Dark",
        children: ["palpatine-son"],
        note:
          "Senator of Naboo, Chancellor, and secret Dark Lord of the Sith who orchestrated the fall of the Republic and the Jedi Order. Sought immortality through Sith alchemy and ultimately created a strand-cast son as a genetic anchor for his dynasty.",
      },
      {
        id: "palpatine-son",
        name: "Dathan (Palpatine's son)",
        role: "Reluctant Heir / Fugitive",
        era: "imperial-era",
        alignment: "None",
        parents: ["palpatine"],
        spouse: "miramir",
        children: ["rey-palpatine"],
        note:
          "A strand-cast clone of Palpatine, born without Force sensitivity, who fled Exegol to escape his father's control. He married a woman named Miramir and fathered Rey before being hunted down and killed by Palpatine's assassin Ochi of Bestoon.",
      },
      {
        id: "miramir",
        name: "Miramir (Rey's mother)",
        role: "Mother / Protector",
        era: "imperial-era",
        alignment: "None",
        spouse: "palpatine-son",
        children: ["rey-palpatine"],
        note:
          "Rey's mother who hid her daughter on Jakku to protect her from Palpatine's agents. She and Dathan were both killed by Ochi of Bestoon after refusing to reveal Rey's location.",
      },
      {
        id: "rey-palpatine",
        name: "Rey (Palpatine's granddaughter)",
        characterId: "rey",
        role: "Granddaughter / Redeemer",
        era: "resistance-era",
        alignment: "Light",
        parents: ["palpatine-son", "miramir"],
        note:
          "Raised in ignorance of her heritage, Rey discovered the truth on Exegol but refused to take Palpatine's place. She destroyed the Emperor using both Skywalker lightsabers, and chose to rename herself Rey Skywalker — ending the Palpatine bloodline's hold on darkness.",
      },
    ],
    notableEvents: [
      { era: "old-republic", event: "Darth Plagueis masters the midi-chlorian manipulation that sets the stage for Palpatine's obsession" },
      { era: "rise-of-empire", event: "Palpatine kills Plagueis, becoming the most powerful Sith in centuries" },
      { era: "rebellion-era", event: "Palpatine falls at Endor; transfers essence to Exegol clone body" },
      { era: "imperial-era", event: "Strand-cast son Dathan born and eventually flees Exegol with Miramir" },
      { era: "first-order-era", event: "Dathan and Miramir killed by Ochi; Rey hidden on Jakku" },
      { era: "resistance-era", event: "Rey defeats Palpatine on Exegol; bloodline ends in light" },
    ],
    affiliations: ["sith-order", "galactic-empire", "first-order"],
    continuity: "Canon",
    importance: 4,
    color: "#b91c1c",
  },

  // ─────────────────────────────────────────────
  // 3. SOLO FAMILY
  // ─────────────────────────────────────────────
  {
    id: "solo-family",
    name: "The Solo Family",
    type: "Bloodline",
    summary:
      "Han Solo and Leia Organa's small, star-crossed family — a smuggler's heart and a princess's fire producing a son whose fall and redemption became the final act of the Skywalker saga.",
    description:
      "Han Solo of Corellia and Leia Organa of Alderaan formed an unlikely partnership in the Rebellion that became a lifelong bond. They married after the Battle of Endor and had one son, Ben, whose extraordinary Force potential — inherited from both Anakin Skywalker's bloodline and Leia's natural talent — made him a target of Snoke's seduction from before birth. Han and Leia's marriage frayed under the weight of their son's darkness; Han returned to smuggling while Leia led the Resistance. Their reunion on Starkiller Base ended with Ben's patricide, a wound that drove Leia to isolate herself until her death during the Battle of Crait. Ben Solo's resurrection of Rey on Exegol — at the cost of his own life — was the final act of a Solo learning to give rather than take.",
    thematicArc:
      "The Solo family is about the cost of living as legend. Han and Leia loved each other fiercely but could not hold each other — or their son — together against the gravity of galactic war. Ben's tragedy is that he absorbed the loneliness of two parents who were always the galaxy's heroes first and his parents second. His redemption echoes Han's own arc: a cynical man who ultimately sacrifices everything for others.",
    spans: ["rebellion-era", "new-republic-era", "first-order-era", "resistance-era"],
    rootId: "han-solo-node",
    nodes: [
      {
        id: "han-solo-node",
        name: "Han Solo",
        characterId: "han-solo",
        role: "Father / Patriarch",
        era: "rebellion-era",
        alignment: "None",
        spouse: "leia-solo-node",
        children: ["ben-solo-node"],
        note:
          "Corellian smuggler, Alliance general, and father who struggled to connect with a Force-sensitive son he didn't fully understand. Han chose to face Ben alone on Starkiller Base in an act of parental love that cost him his life.",
      },
      {
        id: "leia-solo-node",
        name: "Leia Organa Solo",
        characterId: "leia-organa",
        role: "Mother / General",
        era: "rebellion-era",
        alignment: "Light",
        spouse: "han-solo-node",
        children: ["ben-solo-node"],
        note:
          "Leia bore Ben knowing he would be powerful and knowing the risk — she sensed his dark nature in the womb yet chose to give him every chance. Her death during the Resistance's darkest hour released the last tether holding Ben Solo to the light.",
      },
      {
        id: "ben-solo-node",
        name: "Ben Solo / Kylo Ren",
        characterId: "ben-solo",
        role: "Son / Supreme Leader / Redeemed",
        era: "first-order-era",
        alignment: "Redeemed",
        parents: ["leia-solo-node", "han-solo-node"],
        note:
          "The only child of Han and Leia, Ben was seduced by Snoke and abandoned the Solo name for Kylo Ren. His murder of his father and eventual resurrection of Rey — collapsing in death afterward — form the Solo family's closing tragedy and grace note.",
      },
      {
        id: "chewie-node",
        name: "Chewbacca",
        characterId: "chewbacca",
        role: "Honorary Family / Co-Pilot",
        era: "rebellion-era",
        alignment: "None",
        note:
          "Chewbacca was Han's Wookiee co-pilot and life-debt partner for decades, functioning as extended family to the Solos. He carried Han's grief and Leia's memory across the galaxy's final war.",
      },
    ],
    notableEvents: [
      { era: "rebellion-era", event: "Han and Leia marry after the Battle of Endor" },
      { era: "new-republic-era", event: "Ben Solo born; Leia senses darkness in him" },
      { era: "new-republic-era", event: "Ben Solo sent to Luke's Jedi Academy; falls to Snoke and destroys it" },
      { era: "first-order-era", event: "Han Solo murdered by Ben Solo on Starkiller Base" },
      { era: "resistance-era", event: "Leia reaches out through the Force and dies; Ben Solo redeems himself" },
    ],
    affiliations: ["rebel-alliance", "new-republic", "resistance"],
    continuity: "Canon",
    importance: 4,
    color: "#ea580c",
  },

  // ─────────────────────────────────────────────
  // 4. ORGANA FAMILY
  // ─────────────────────────────────────────────
  {
    id: "organa-family",
    name: "The Organa Family of Alderaan",
    type: "Adopted Family",
    summary:
      "Alderaan's royal house who adopted Leia Amidala Skywalker and raised her as a princess of peace, shaped her political and moral identity, and were ultimately annihilated by the Empire she fought to defeat.",
    description:
      "Senator Bail Organa of Alderaan and his wife Queen Breha Organa were among the few trusted with the secret of Padmé's twins at the end of the Clone Wars. They adopted the infant Leia and raised her as a princess of a world celebrated for pacifism, culture, and senatorial influence. Bail was a founding architect of the Rebel Alliance, laying groundwork in secret while maintaining his seat in the Imperial Senate. Leia internalized both her mother's compassion and her father's political cunning, becoming the Rebellion's most brilliant strategist. When Grand Moff Tarkin and Darth Vader destroyed Alderaan with the Death Star to demonstrate Imperial power, Bail, Breha, and the entire population of 2 billion were killed — transforming Leia's grief into irreversible commitment to the Rebellion. The Organa legacy lives on in every moment Leia chose diplomacy over destruction, mercy over revenge.",
    thematicArc:
      "The Organa family represents chosen love over biological destiny — Bail and Breha took a child of war and raised a champion of peace, proving that nurture can redirect the most potent blood in the galaxy. Alderaan's destruction is the saga's clearest argument that the Empire's brutality creates its own resistance. Leia's dual identity — Skywalker by blood, Organa by soul — is a recurring tension the sequel trilogy only resolves by affirming that Bail and Breha's love shaped her more than Anakin's midi-chlorians.",
    spans: ["fall-of-republic", "clone-wars", "rise-of-empire", "imperial-era", "rebellion-era"],
    rootId: "bail-organa",
    nodes: [
      {
        id: "bail-organa",
        name: "Bail Organa",
        characterId: "bail-organa",
        role: "Adoptive Father / Senator / Rebel Founder",
        era: "fall-of-republic",
        alignment: "Light",
        spouse: "breha-organa",
        children: ["leia-organa-node"],
        note:
          "Senator of Alderaan who witnessed Order 66 firsthand and co-founded the seeds of the Rebellion. He adopted Leia with the full knowledge that her parentage made her the galaxy's most dangerous secret.",
      },
      {
        id: "breha-organa",
        name: "Breha Organa",
        characterId: "breha-organa",
        role: "Adoptive Mother / Queen of Alderaan",
        era: "fall-of-republic",
        alignment: "Light",
        spouse: "bail-organa",
        children: ["leia-organa-node"],
        note:
          "Queen of Alderaan who raised Leia with warmth and dignity. She perished with Alderaan's 2 billion inhabitants when Tarkin destroyed the planet, a loss that steeled Leia's resolve irrevocably.",
      },
      {
        id: "leia-organa-node",
        name: "Leia Organa",
        characterId: "leia-organa",
        role: "Adopted Daughter / Princess",
        era: "imperial-era",
        alignment: "Light",
        parents: ["bail-organa", "breha-organa"],
        note:
          "Raised as a Alderaanian princess and senator, Leia carried her adoptive family's values of justice and peaceful resistance into the Rebellion. She considered herself Organa in every way that mattered, even after learning her biological parentage.",
      },
      {
        id: "winter-organa",
        name: "Winter Celchu (Winter Organa)",
        role: "Adopted Sister / Aide",
        era: "imperial-era",
        alignment: "Light",
        note:
          "Leia's childhood companion and adopted sister in Legends continuity, Winter served as one of the Rebellion's most valuable intelligence operatives, her perfect memory making her irreplaceable.",
      },
    ],
    notableEvents: [
      { era: "rise-of-empire", event: "Bail and Breha Organa formally adopt infant Leia Amidala Skywalker" },
      { era: "imperial-era", event: "Leia becomes youngest Imperial Senator, secretly carries Rebel intelligence" },
      { era: "imperial-era", event: "Bail Organa dies when Alderaan is destroyed by the Death Star" },
      { era: "rebellion-era", event: "Leia learns the truth of her Skywalker parentage from Luke" },
    ],
    affiliations: ["galactic-republic", "rebel-alliance", "new-republic"],
    continuity: "Both",
    importance: 4,
    color: "#2dd4bf",
  },

  // ─────────────────────────────────────────────
  // 5. LARS FAMILY (Tatooine Branch)
  // ─────────────────────────────────────────────
  {
    id: "lars-family",
    name: "The Lars Family of Tatooine",
    type: "Adopted Family",
    summary:
      "The humble moisture-farming family that sheltered Luke Skywalker in plain sight on Tatooine, connecting the galaxy's greatest bloodline to the most backwater world in the Outer Rim.",
    description:
      "Cliegg Lars was a free colonist on Tatooine who purchased and freed Shmi Skywalker from slavery, falling in love with and marrying her. His son from a prior relationship, Owen Lars, thus became Shmi's stepson — and by extension, Anakin Skywalker's stepbrother. When Shmi was captured by Tusken Raiders, Cliegg led a rescue party that ended in failure, leaving him wheelchair-bound and Shmi dead. After Padmé's death, Obi-Wan Kenobi brought infant Luke to Owen and his wife Beru Whitesun Lars, asking them to raise the boy quietly under the radar of the Empire. Owen deeply resented any association with the Force and Anakin's legacy, determined to give Luke a normal life — or at least the illusion of one. Both Owen and Beru were murdered by Imperial stormtroopers searching for R2-D2, their charred remains the catalyst that fully committed Luke to the Rebellion.",
    thematicArc:
      "The Lars family is the saga's emblem of ordinary courage: people with no Force gift, no political power, and no destiny who nonetheless shaped one of the most important lives in history. Owen's protectiveness — however smothering — came from real love and real fear; he had seen what Anakin became. Their deaths transform Luke from a dreamer into a hero, meaning the Empire's brutality was the very thing that created its most formidable enemy.",
    spans: ["fall-of-republic", "rise-of-empire", "imperial-era", "rebellion-era"],
    rootId: "cliegg-lars",
    nodes: [
      {
        id: "cliegg-lars",
        name: "Cliegg Lars",
        role: "Patriarch / Shmi's Husband",
        era: "fall-of-republic",
        alignment: "None",
        spouse: "shmi-lars",
        children: ["owen-lars"],
        note:
          "A free moisture farmer who purchased Shmi Skywalker's freedom and married her, making Owen her stepson and creating the unexpected link between the Lars homestead and the Skywalker bloodline.",
      },
      {
        id: "shmi-lars",
        name: "Shmi Skywalker Lars",
        characterId: "shmi-skywalker",
        role: "Wife / Anakin's Mother",
        era: "fall-of-republic",
        alignment: "None",
        spouse: "cliegg-lars",
        children: ["anakin-lars-ref"],
        note:
          "Freed from slavery by Cliegg and finally given a life of peace, Shmi was captured and tortured by Tusken Raiders and died in Anakin's arms — the trauma that first cracked his Jedi vows and pointed him toward the dark side.",
      },
      {
        id: "anakin-lars-ref",
        name: "Anakin Skywalker (stepson)",
        characterId: "anakin-skywalker",
        role: "Stepson / The Prodigal",
        era: "clone-wars",
        alignment: "Corrupted",
        note:
          "Anakin's ties to the Lars household were severed by Shmi's death and his own fall. He never returned to Tatooine as Darth Vader, but the homestead endured as the hiding place for his son.",
      },
      {
        id: "owen-lars",
        name: "Owen Lars",
        characterId: "owen-lars",
        role: "Adoptive Uncle / Moisture Farmer",
        era: "imperial-era",
        alignment: "None",
        parents: ["cliegg-lars"],
        spouse: "beru-lars-node",
        children: ["luke-lars-ref"],
        note:
          "Anakin's stepbrother who reluctantly agreed to raise Luke, Owen was deeply protective and deliberately kept Luke ignorant of his heritage, understanding — perhaps better than anyone — what power and destiny had done to Anakin.",
      },
      {
        id: "beru-lars-node",
        name: "Beru Whitesun Lars",
        characterId: "beru-lars",
        role: "Adoptive Aunt",
        era: "imperial-era",
        alignment: "None",
        spouse: "owen-lars",
        children: ["luke-lars-ref"],
        note:
          "Owen's wife and Luke's gentle, perceptive aunt who quietly encouraged the boy's curiosity and potential, even when Owen discouraged it. She and Owen were killed by Imperial stormtroopers while the droids were en route to Luke.",
      },
      {
        id: "luke-lars-ref",
        name: "Luke Skywalker (ward)",
        characterId: "luke-skywalker",
        role: "Ward / Nephew",
        era: "rebellion-era",
        alignment: "Light",
        parents: ["owen-lars", "beru-lars-node"],
        note:
          "Raised as a Lars nephew, Luke chafed at moisture farming but honored Owen's wishes until their deaths freed and obligated him simultaneously. The Lars homestead on Tatooine became a recurring symbol of the home worth fighting for.",
      },
    ],
    notableEvents: [
      { era: "fall-of-republic", event: "Cliegg Lars frees and marries Shmi Skywalker" },
      { era: "fall-of-republic", event: "Shmi captured and killed by Tusken Raiders; Cliegg crippled in failed rescue" },
      { era: "rise-of-empire", event: "Obi-Wan Kenobi delivers infant Luke to Owen and Beru on Tatooine" },
      { era: "imperial-era", event: "Owen and Beru Lars killed by Imperial stormtroopers during search for R2-D2" },
    ],
    affiliations: [],
    continuity: "Canon",
    importance: 3,
    color: "#c97a3f",
  },

  // ─────────────────────────────────────────────
  // 6. KENOBI MENTOR LINEAGE
  // ─────────────────────────────────────────────
  {
    id: "kenobi-lineage",
    name: "The Kenobi Mentor Lineage",
    type: "Master-Apprentice (Jedi)",
    summary:
      "The central light-side pedagogical chain of the saga: from Yoda through Dooku, Qui-Gon, Obi-Wan, Anakin, and Ahsoka to Sabine — each link transmitting wisdom, failure, and an unyielding commitment to the Force's living light.",
    description:
      "This lineage begins with Yoda, the ancient Grand Master, who trained Count Dooku before Dooku's eventual fall. Dooku trained Qui-Gon Jinn, who became perhaps the Jedi Order's most unorthodox and prescient master, emphasizing the Living Force over dogma. Qui-Gon trained Obi-Wan Kenobi, and his dying wish bound Obi-Wan to the destiny of training Anakin Skywalker. Obi-Wan trained Anakin from childhood to Knighthood, a bond so deep and fraternal that Anakin's betrayal nearly destroyed Obi-Wan. Anakin trained Ahsoka Tano during the Clone Wars, imparting his own unconventional boldness and deep emotional investment; Ahsoka eventually walked away from the Order but continued to embody its best traditions. Ahsoka later took Sabine Wren as her apprentice in the years after the fall of the Empire, extending the chain into a new generation untethered from the old Order's orthodoxy. Informally, Obi-Wan and Yoda both guided Luke Skywalker through the Force after death, making this chain the invisible spine of the saga's light side.",
    thematicArc:
      "The Kenobi lineage is about knowledge surviving catastrophe. Each master passes on what the Order got right while their own generation's failures erode the institution around them: Dooku's fall, Qui-Gon's death, Anakin's turn, the Purge. Obi-Wan is the chain's tragic center — faithful to a student who became his greatest enemy, faithful still to the hope that the light survives. Ahsoka and Sabine represent the chain's renewal: women who train outside the Order's ruins, proving that the light does not need a temple to endure.",
    spans: [
      "old-republic",
      "fall-of-republic",
      "clone-wars",
      "rise-of-empire",
      "imperial-era",
      "rebellion-era",
      "new-republic-era",
      "first-order-era",
    ],
    rootId: "yoda-kenobi",
    nodes: [
      {
        id: "yoda-kenobi",
        name: "Yoda",
        characterId: "yoda",
        role: "Grand Master / Root of the Chain",
        era: "old-republic",
        alignment: "Light",
        apprentices: ["dooku-kenobi"],
        note:
          "The 900-year-old Grand Master who trained hundreds of Jedi and serves as the chain's ultimate origin point. Yoda's teaching of Dooku — before recognizing Dooku's creeping pride — planted both the line's greatest successes and its darkest offshoot.",
      },
      {
        id: "dooku-kenobi",
        name: "Count Dooku / Darth Tyranus",
        characterId: "count-dooku",
        role: "Yoda's Apprentice / Qui-Gon's Master",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "yoda-kenobi",
        apprentices: ["qui-gon-kenobi"],
        note:
          "A brilliant and principled Jedi Master who grew disillusioned with the Republic's corruption and fell to Sidious's seduction. As Darth Tyranus, he trained Qui-Gon before his own fall and later fought Obi-Wan and Anakin multiple times.",
      },
      {
        id: "qui-gon-kenobi",
        name: "Qui-Gon Jinn",
        characterId: "qui-gon-jinn",
        role: "Maverick Master / Anakin's Discoverer",
        era: "fall-of-republic",
        alignment: "Light",
        master: "dooku-kenobi",
        apprentices: ["obi-wan-kenobi-node"],
        note:
          "A Jedi Master who defied the Council and championed the Living Force, Qui-Gon discovered Anakin on Tatooine and died on Naboo believing in the boy's destiny. His pioneering of Force-ghost techniques meant he continued to teach even after death.",
      },
      {
        id: "obi-wan-kenobi-node",
        name: "Obi-Wan Kenobi",
        characterId: "obi-wan-kenobi",
        role: "The Faithful Keeper",
        era: "clone-wars",
        alignment: "Light",
        master: "qui-gon-kenobi",
        apprentices: ["anakin-kenobi", "luke-kenobi-informal"],
        note:
          "The lineage's emotional heart — Obi-Wan kept faith with the Force, with Anakin's memory, and with Luke's destiny across decades of exile. His death on the Death Star was a final teaching moment, becoming more powerful as a Force ghost than he ever was in life.",
      },
      {
        id: "anakin-kenobi",
        name: "Anakin Skywalker",
        characterId: "anakin-skywalker",
        role: "The Prodigal Apprentice",
        era: "clone-wars",
        alignment: "Corrupted",
        master: "obi-wan-kenobi-node",
        apprentices: ["ahsoka-kenobi"],
        note:
          "Obi-Wan's apprentice from age nine, Anakin surpassed every expectation in martial skill and Force sensitivity before catastrophically falling. His training of Ahsoka Tano was perhaps his most lasting positive contribution — she carried his fire without his shadow.",
      },
      {
        id: "ahsoka-kenobi",
        name: "Ahsoka Tano",
        characterId: "ahsoka-tano",
        role: "The Survivor / Heir of the Chain",
        era: "clone-wars",
        alignment: "Light",
        master: "anakin-kenobi",
        apprentices: ["sabine-kenobi"],
        note:
          "Anakin's Padawan who left the Order before Order 66, surviving as 'Fulcrum' within the Rebellion and later as a key figure in the New Republic era. Ahsoka proved that the lineage's light could survive the Order's destruction completely intact.",
      },
      {
        id: "sabine-kenobi",
        name: "Sabine Wren",
        characterId: "sabine-wren",
        role: "Ahsoka's Apprentice / Mandalorian Jedi",
        era: "new-republic-era",
        alignment: "Light",
        master: "ahsoka-kenobi",
        note:
          "A Mandalorian warrior who studied under Ahsoka years after the fall of the Empire, Sabine represents the chain's democratization — Force users outside the old Order's gatekeeping, trained by lineage rather than institution.",
      },
      {
        id: "luke-kenobi-informal",
        name: "Luke Skywalker (informal apprentice of Obi-Wan)",
        characterId: "luke-skywalker",
        role: "Obi-Wan's Indirect Student",
        era: "rebellion-era",
        alignment: "Light",
        master: "obi-wan-kenobi-node",
        note:
          "Obi-Wan guided Luke from Tatooine to the first lightsaber lesson to his post-death instructions across the original trilogy. Though Yoda completed Luke's formal training, the Kenobi influence — 'trust the Force' — was Luke's foundational philosophy.",
      },
    ],
    notableEvents: [
      { era: "fall-of-republic", event: "Qui-Gon killed by Darth Maul; Obi-Wan pledges to train Anakin" },
      { era: "clone-wars", event: "Ahsoka Tano assigned as Anakin's Padawan during the Clone Wars" },
      { era: "rise-of-empire", event: "Order 66 and the Great Jedi Purge; Obi-Wan enters exile on Tatooine" },
      { era: "imperial-era", event: "Ahsoka walks away from the Order; survives as Fulcrum in the Rebellion" },
      { era: "rebellion-era", event: "Obi-Wan sacrifices himself on the Death Star; continues guiding Luke as a Force ghost" },
      { era: "new-republic-era", event: "Ahsoka takes Sabine Wren as apprentice in the post-Imperial era" },
    ],
    affiliations: ["jedi-order"],
    continuity: "Canon",
    importance: 5,
    color: "#4cc9f0",
  },

  // ─────────────────────────────────────────────
  // 7. YODA'S KNOWN APPRENTICES
  // ─────────────────────────────────────────────
  {
    id: "yoda-lineage",
    name: "Yoda's Apprentices and Teachings",
    type: "Master-Apprentice (Jedi)",
    summary:
      "Over nine centuries, Yoda personally trained an estimated 800 Jedi Padawans, with his most notable direct apprentices including Dooku, Mace Windu (informally), and Luke Skywalker — a sweep from the height of the Order to its sole survivor.",
    description:
      "Yoda spent nearly nine hundred years as the Jedi Order's foremost teacher, sitting at the heart of its knowledge and tradition. His known formal apprentices include Count Dooku, whose elegant mastery of Makashi dueling reflected Yoda's own perfectionism, and Yaddle, a member of Yoda's own species who served on the High Council. While Mace Windu was not formally Yoda's Padawan, the two co-led the Council for decades in a relationship of deep mutual influence. Rahm Kota (Legends) was a noted product of Yoda's Order. Late in life, after Order 66, Yoda accepted responsibility for the galaxy's failure and chose exile on Dagobah for decades of meditation and self-examination before training Luke Skywalker — his final and perhaps most unconventional student. Luke arrived too old by the Order's standards, untrained, impatient, and yet Yoda saw in him the hope the Order had lost. His final instruction — 'Pass on what you have learned' — became the whole purpose of the Jedi's survival.",
    thematicArc:
      "Yoda's lineage dramatizes the limits of wisdom: a master so revered that the Order stopped questioning his judgments, including his failure to see Dooku's disillusionment and Palpatine's identity. His exile is not cowardice but honest reckoning — a great teacher who learned that nine centuries of knowing can still leave one blind. Luke's training, stripped of all ceremony, is Yoda's corrected approach: the Force does not require a temple, just a student willing to face themselves.",
    spans: ["old-republic", "high-republic", "fall-of-republic", "clone-wars", "rise-of-empire", "rebellion-era"],
    rootId: "yoda-root",
    nodes: [
      {
        id: "yoda-root",
        name: "Yoda",
        characterId: "yoda",
        role: "Grand Master",
        era: "old-republic",
        alignment: "Light",
        apprentices: ["dooku-yoda", "yaddle-yoda", "luke-yoda"],
        note:
          "The 900-year-old Grand Master of the Jedi Order, the longest-serving and most widely respected force-wielder in galactic history. His exile after Order 66 and his death on Dagobah bracket the saga's central catastrophe.",
      },
      {
        id: "dooku-yoda",
        name: "Count Dooku / Darth Tyranus",
        characterId: "count-dooku",
        role: "Fallen Apprentice",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "yoda-root",
        note:
          "Yoda's most gifted formal apprentice, Dooku's eventual fall to the dark side was a failure Yoda never fully forgave himself for. In their final duel on Geonosis, Yoda's equal combat with Dooku was as much grief as strategy.",
      },
      {
        id: "yaddle-yoda",
        name: "Yaddle",
        role: "Council Member (same species as Yoda)",
        era: "fall-of-republic",
        alignment: "Light",
        master: "yoda-root",
        note:
          "A member of Yoda's unnamed species who served on the Jedi High Council during the last decades of the Republic. She left the Council before the Clone Wars; canon sources (Tales of the Jedi) show her willing to sacrifice herself rather than allow further harm.",
      },
      {
        id: "mace-yoda",
        name: "Mace Windu",
        characterId: "mace-windu",
        role: "Council Co-Leader / Peer",
        era: "clone-wars",
        alignment: "Light",
        master: "yoda-root",
        note:
          "Mace Windu co-led the Jedi Council alongside Yoda through the Clone Wars, and though not formally Yoda's Padawan, their relationship was the Order's central leadership partnership. Mace invented the unique Vaapad lightsaber form.",
      },
      {
        id: "rahm-kota",
        name: "Rahm Kota",
        role: "Jedi General (Legends)",
        era: "imperial-era",
        alignment: "Light",
        master: "yoda-root",
        note:
          "In Legends continuity, Rahm Kota was a Jedi General who refused to use clone troopers in his command, a decision that saved his life when Order 66 came. He survived into the Imperial era and became a mentor to Galen Marek.",
      },
      {
        id: "luke-yoda",
        name: "Luke Skywalker",
        characterId: "luke-skywalker",
        role: "Final Apprentice",
        era: "rebellion-era",
        alignment: "Light",
        master: "yoda-root",
        note:
          "Yoda's last and arguably most important student, trained on Dagobah under deliberately austere conditions. Luke completed his training not through the curriculum Yoda prescribed but through his own confrontation of Vader and Palpatine, which Yoda recognized as the only true path.",
      },
    ],
    notableEvents: [
      { era: "old-republic", event: "Yoda begins training Padawans at the Jedi Temple on Coruscant" },
      { era: "fall-of-republic", event: "Count Dooku leaves the Order and eventually falls to the dark side" },
      { era: "clone-wars", event: "Yoda leads the Jedi Council through the galactic war alongside Mace Windu" },
      { era: "rise-of-empire", event: "Order 66 decimates Yoda's legacy; he duels Palpatine in the Senate chambers" },
      { era: "imperial-era", event: "Yoda enters exile on Dagobah, 20 years of isolation and meditation" },
      { era: "rebellion-era", event: "Yoda trains Luke and passes on his last teachings before dying and becoming one with the Force" },
    ],
    affiliations: ["jedi-order", "galactic-republic"],
    continuity: "Both",
    importance: 5,
    color: "#84cc16",
  },

  // ─────────────────────────────────────────────
  // 8. SKYWALKER JEDI TRAINING CHAIN
  // ─────────────────────────────────────────────
  {
    id: "skywalker-jedi-chain",
    name: "The Skywalker Jedi Training Chain",
    type: "Master-Apprentice (Jedi)",
    summary:
      "Separate from the bloodline, this chain traces the formal and informal training of the Skywalker Force-sensitive lineage: Qui-Gon to Anakin, Anakin to Ahsoka, and Yoda/Obi-Wan to Luke, ending with Luke's training of Ben Solo and Rey.",
    description:
      "The Skywalker training chain begins with Qui-Gon Jinn's discovery of Anakin on Tatooine — a child he believed to be the Chosen One — and his deathbed demand that Obi-Wan train him. Obi-Wan carried out that training for over a decade, and Anakin's assigned Padawan Ahsoka Tano continued in that tradition of passionate, unorthodox mentorship. After Order 66, the chain lay dormant until Obi-Wan and the ghost of Yoda guided Luke Skywalker through the Force. Luke in turn established his own Jedi Academy, training Ben Solo among others, and in his final years accepted Rey as his student despite deep misgivings about whether the Jedi Order should continue. Rey's subsequent training under Leia completed the cycle — the Skywalker bloodline teaching the next generation of Skywalkers, biological or chosen.",
    thematicArc:
      "The Skywalker training chain dramatizes how wisdom passes imperfectly through generations, each link carrying the previous master's gifts and unresolved wounds. Qui-Gon transmitted his love of the Living Force to Obi-Wan; Obi-Wan transmitted his loyalty and restraint to Anakin; Anakin transmitted his boldness and emotional intensity to Ahsoka. Luke received both the best and worst of the chain's legacy and tried to build something new — only partially succeeding, because Ben Solo inherited Anakin's darkness as well as his light.",
    spans: [
      "fall-of-republic",
      "clone-wars",
      "rise-of-empire",
      "rebellion-era",
      "new-republic-era",
      "first-order-era",
      "resistance-era",
    ],
    rootId: "qui-gon-sw-chain",
    nodes: [
      {
        id: "qui-gon-sw-chain",
        name: "Qui-Gon Jinn",
        characterId: "qui-gon-jinn",
        role: "Discoverer / Origin of the Chain",
        era: "fall-of-republic",
        alignment: "Light",
        apprentices: ["anakin-sw-chain"],
        note:
          "Qui-Gon identified Anakin as the prophesied Chosen One and insisted on training him against the Council's reservations. His death immediately made Anakin's future Obi-Wan's responsibility rather than a considered choice.",
      },
      {
        id: "anakin-sw-chain",
        name: "Anakin Skywalker",
        characterId: "anakin-skywalker",
        role: "Chosen One / Master of Ahsoka",
        era: "clone-wars",
        alignment: "Corrupted",
        master: "qui-gon-sw-chain",
        apprentices: ["ahsoka-sw-chain"],
        note:
          "Trained by Obi-Wan, Anakin became one of the most powerful Jedi of his era and trained Ahsoka during the Clone Wars. His fall interrupted the chain for a generation, but Ahsoka carried his lineage forward in the light.",
      },
      {
        id: "ahsoka-sw-chain",
        name: "Ahsoka Tano",
        characterId: "ahsoka-tano",
        role: "Anakin's Padawan / Living Link",
        era: "clone-wars",
        alignment: "Light",
        master: "anakin-sw-chain",
        note:
          "Ahsoka bridges the Old Jedi Order and the post-Empire era, keeping Anakin's training methodology alive without his darkness. She refused the Jedi title but remained the most active Force teacher outside the Order's institutional memory.",
      },
      {
        id: "obi-wan-sw-chain",
        name: "Obi-Wan Kenobi",
        characterId: "obi-wan-kenobi",
        role: "Luke's First Teacher",
        era: "rebellion-era",
        alignment: "Light",
        apprentices: ["luke-sw-chain"],
        note:
          "Obi-Wan gave Luke his first lightsaber lessons and the philosophical foundation of the Force before dying, then continued as a Force ghost. His deathbed instruction to seek out Yoda was the practical handoff that completed Luke's training.",
      },
      {
        id: "yoda-sw-chain",
        name: "Yoda",
        characterId: "yoda",
        role: "Luke's Formal Trainer",
        era: "rebellion-era",
        alignment: "Light",
        apprentices: ["luke-sw-chain"],
        note:
          "Yoda completed what Obi-Wan began, testing Luke on Dagobah with philosophy and physical trial. His acceptance that Luke would confront Vader — despite the risk — was the final piece of the chain's continuity.",
      },
      {
        id: "luke-sw-chain",
        name: "Luke Skywalker",
        characterId: "luke-skywalker",
        role: "Last Jedi Master / Reluctant Trainer",
        era: "new-republic-era",
        alignment: "Light",
        master: "yoda-sw-chain",
        apprentices: ["ben-solo-sw-chain", "rey-sw-chain"],
        note:
          "Luke established the New Jedi Order and trained a generation of students including Ben Solo. After the academy's destruction and his self-imposed exile, he reluctantly accepted Rey as a student, resuming the chain from a place of humility rather than confidence.",
      },
      {
        id: "ben-solo-sw-chain",
        name: "Ben Solo / Kylo Ren",
        characterId: "ben-solo",
        role: "Luke's Fallen Student",
        era: "first-order-era",
        alignment: "Redeemed",
        master: "luke-sw-chain",
        note:
          "Ben Solo was Luke's most gifted student and the chain's second great failure. Unlike Anakin, Ben Solo's redemption came without a formal return to the Jedi tradition — his sacrifice for Rey was the act of a man reclaiming his own identity, not a Jedi's vow.",
      },
      {
        id: "rey-sw-chain",
        name: "Rey Skywalker",
        characterId: "rey",
        role: "Chain's Final Keeper",
        era: "resistance-era",
        alignment: "Light",
        master: "luke-sw-chain",
        note:
          "Trained by both Luke (grudgingly) and Leia (tenderly), Rey received the full lineage of the Skywalker training chain and carried it forward. Her declaration of the Skywalker name closes the chain as a living tradition rather than an institution.",
      },
    ],
    notableEvents: [
      { era: "fall-of-republic", event: "Qui-Gon discovers Anakin on Tatooine; Council refuses to sanction his training" },
      { era: "clone-wars", event: "Ahsoka Tano assigned as Anakin's Padawan at start of Clone Wars" },
      { era: "rebellion-era", event: "Luke Skywalker receives first training from Obi-Wan, completed by Yoda on Dagobah" },
      { era: "new-republic-era", event: "Luke establishes New Jedi Academy; Ben Solo and others trained" },
      { era: "first-order-era", event: "Ben Solo destroys Luke's Jedi Academy; Luke retreats to Ahch-To" },
      { era: "resistance-era", event: "Rey trained by Luke and Leia; defeats Palpatine at Exegol" },
    ],
    affiliations: ["jedi-order"],
    continuity: "Canon",
    importance: 5,
    color: "#4cc9f0",
  },

  // ─────────────────────────────────────────────
  // 9. SITH RULE OF TWO LINEAGE
  // ─────────────────────────────────────────────
  {
    id: "sith-rule-of-two",
    name: "The Sith Rule of Two — Full Chain",
    type: "Master-Apprentice (Sith)",
    summary:
      "The complete unbroken chain of Sith Masters and Apprentices from Darth Bane's reformation through Darth Plagueis, Darth Sidious, and Sidious's multiple concurrent apprentices, culminating in the First Order era.",
    description:
      "Darth Bane destroyed the Brotherhood of Darkness at the Thought Bomb on Ruusan and instituted the Rule of Two: one Master to embody the power of the dark side, one Apprentice to crave it. Bane's chain passed through Darth Zannah to Darth Cognus, then through a line of masters that eventually reached Darth Tenebrous, a Bith scientist who took Darth Plagueis as his apprentice. Plagueis, obsessed with conquering death through midi-chlorian manipulation, trained Palpatine — Darth Sidious — who then murdered Plagueis in his sleep. Sidious bent the Rule of Two to his needs, taking Darth Maul, then Dooku as Darth Tyranus, and finally Anakin Skywalker as Darth Vader — though he also used Snoke as a proxy to cultivate Kylo Ren. The Rule of Two ends definitively when Ben Solo renounces the Sith title and Rey destroys Palpatine, breaking the chain Bane built a millennium earlier.",
    thematicArc:
      "The Rule of Two is a philosophy of institutionalized betrayal: the Apprentice must eventually kill the Master, meaning every Sith relationship is built on the anticipation of murder. This produces masters of extraordinary cunning but guarantees the lineage can never build trust, love, or loyalty — the very things that ultimately defeated it. Sidious's hubris was believing he could hold multiple apprentices and cheat death itself; both impulses violated the Rule, and both hastened his destruction.",
    spans: [
      "old-republic",
      "fall-of-republic",
      "clone-wars",
      "rise-of-empire",
      "imperial-era",
      "rebellion-era",
      "first-order-era",
      "resistance-era",
    ],
    rootId: "darth-bane-sith",
    nodes: [
      {
        id: "darth-bane-sith",
        name: "Darth Bane",
        characterId: "darth-bane",
        role: "Founder of the Rule of Two",
        era: "old-republic",
        alignment: "Dark",
        apprentices: ["darth-zannah"],
        note:
          "Sole survivor of the Sith Brotherhood of Darkness, Bane established the Rule of Two on Ruusan and began a thousand-year shadow campaign to reclaim the galaxy. He wore Orbalisks — symbiotic parasites — as living armor before being cured and facing his first test of the Rule from his own apprentice.",
      },
      {
        id: "darth-zannah",
        name: "Darth Zannah",
        role: "Bane's Apprentice / Sorcerer",
        era: "old-republic",
        alignment: "Dark",
        master: "darth-bane-sith",
        apprentices: ["darth-cognus"],
        note:
          "Bane's female apprentice who mastered Sith sorcery and illusion, Zannah eventually defeated Bane in combat and took the mantle of Master — fulfilling the Rule's demand that the stronger must prevail.",
      },
      {
        id: "darth-cognus",
        name: "Darth Cognus",
        role: "The Huntress / Third in Chain",
        era: "old-republic",
        alignment: "Dark",
        master: "darth-zannah",
        apprentices: ["darth-millennial-sith"],
        note:
          "A three-eyed Iktotchi assassin who became Zannah's apprentice after proving her worth through contract killing. Cognus's apprentice Millennial broke the Rule and founded a splinter sect, a deviation the orthodox chain had to absorb.",
      },
      {
        id: "darth-millennial-sith",
        name: "Darth Millennial",
        role: "The Apostate (broke Rule of Two)",
        era: "old-republic",
        alignment: "Dark",
        master: "darth-cognus",
        note:
          "Cognus's apprentice who rejected the Rule of Two and fled to Dromund Kaas to found the dark side cult called the Prophets of the Dark Side. His defection forced Cognus to find another apprentice, and the orthodox Bane line continued without him.",
      },
      {
        id: "darth-vectivus",
        name: "Darth Vectivus",
        role: "The Businessman Sith",
        era: "old-republic",
        alignment: "Dark",
        note:
          "A Sith Lord noted for living a largely ordinary life as a mining magnate while wielding the dark side — remarkable in the chain for causing no extraordinary destruction. He is cited in Legends as evidence that the dark side need not produce monsters, merely power.",
      },
      {
        id: "darth-tenebrous",
        name: "Darth Tenebrous",
        role: "Plagueis's Master",
        era: "old-republic",
        alignment: "Dark",
        apprentices: ["darth-plagueis-sith"],
        note:
          "A Bith Sith Master who was also a theoretical physicist, Tenebrous secretly created bioengineered midi-chlorians called maxi-chlorians to anchor his consciousness after death. He was killed by Plagueis in a cave-in on Bal'demnic, fulfilling the Rule.",
      },
      {
        id: "darth-plagueis-sith",
        name: "Darth Plagueis the Wise",
        characterId: "darth-plagueis",
        role: "Master of Midi-chlorians",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "darth-tenebrous",
        apprentices: ["darth-sidious-sith"],
        note:
          "A Muun Sith Lord obsessed with mastering death itself, Plagueis developed techniques to manipulate midi-chlorians to create and sustain life. He is implied to have influenced Anakin's conception and was murdered by his own apprentice Palpatine while sleeping — the ultimate expression of the Rule of Two.",
      },
      {
        id: "darth-sidious-sith",
        name: "Darth Sidious / Emperor Palpatine",
        characterId: "darth-sidious",
        role: "Supreme Dark Lord",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "darth-plagueis-sith",
        apprentices: ["darth-maul-sith", "darth-tyranus-sith", "darth-vader-sith"],
        note:
          "The most successful Sith in the chain's history, Sidious bent the Rule of Two to accommodate multiple simultaneous apprentices, orchestrated the fall of the Republic, declared the Galactic Empire, and rebuilt his essence after death on Exegol. His final defeat came at his own granddaughter's hands.",
      },
      {
        id: "darth-maul-sith",
        name: "Darth Maul",
        characterId: "darth-maul",
        role: "First Apprentice (replaced)",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "darth-sidious-sith",
        note:
          "Sidious's first public apprentice, Maul was presumed dead after Qui-Gon's funeral on Naboo but survived bisection through sheer dark-side rage. He was ultimately replaced in Sidious's plans, a casualty of the Rule's logic that the Master's needs supersede the Apprentice's survival.",
      },
      {
        id: "darth-tyranus-sith",
        name: "Darth Tyranus / Count Dooku",
        characterId: "count-dooku",
        role: "Second Public Apprentice",
        era: "clone-wars",
        alignment: "Dark",
        master: "darth-sidious-sith",
        note:
          "Sidious recruited Dooku to lead the Separatist movement as a political tool, knowing he would eventually be replaced. Dooku was killed by Anakin in front of Palpatine — a deliberate test of Anakin's potential and a coldly calculated sacrifice of his own apprentice.",
      },
      {
        id: "darth-vader-sith",
        name: "Darth Vader",
        characterId: "darth-vader",
        role: "Supreme Apprentice / Redeemed",
        era: "rise-of-empire",
        alignment: "Redeemed",
        master: "darth-sidious-sith",
        note:
          "Sidious's most powerful and most personal apprentice, Vader enforced the Emperor's will for twenty years before his son's love reached through the darkness. His destruction of Palpatine to save Luke — fulfilling the Chosen One prophecy — ended the Rule of Two's active reign.",
      },
      {
        id: "snoke-sith",
        name: "Snoke (Palpatine's proxy)",
        role: "Supreme Leader / Manipulator of Kylo Ren",
        era: "first-order-era",
        alignment: "Dark",
        master: "darth-sidious-sith",
        apprentices: ["kylo-ren-sith"],
        note:
          "A genetically engineered strand-cast puppet of Palpatine, Snoke served as a proxy master to guide Ben Solo toward the dark side without exposing Palpatine's survival. He was killed by Kylo Ren — who used a variant of the Rule to destroy him — before Kylo ever knew Palpatine was pulling the strings.",
      },
      {
        id: "kylo-ren-sith",
        name: "Kylo Ren / Ben Solo",
        characterId: "ben-solo",
        role: "Final Self-styled Sith / Redeemed",
        era: "first-order-era",
        alignment: "Redeemed",
        master: "snoke-sith",
        note:
          "Ben Solo was trained by Snoke as a Sith-adjacent dark side user, though he called himself neither Sith nor Jedi. His redemption and self-sacrifice broke the chain definitively, as no new Master-Apprentice pair arose to continue the Rule of Two after Palpatine's final death.",
      },
    ],
    notableEvents: [
      { era: "old-republic", event: "Battle of Ruusan; Darth Bane survives the Thought Bomb and institutes the Rule of Two" },
      { era: "fall-of-republic", event: "Palpatine murders Darth Plagueis in his sleep; becomes sole Sith Master" },
      { era: "fall-of-republic", event: "Darth Maul killed (presumed) on Naboo; Palpatine recruits Dooku as replacement" },
      { era: "clone-wars", event: "Count Dooku killed by Anakin Skywalker at Palpatine's command" },
      { era: "rebellion-era", event: "Darth Vader kills Palpatine at Endor; Rule of Two briefly broken" },
      { era: "resistance-era", event: "Palpatine destroyed by Rey on Exegol; Rule of Two chain ends" },
    ],
    affiliations: ["sith-order", "galactic-empire", "first-order"],
    continuity: "Both",
    importance: 5,
    color: "#b91c1c",
  },

  // ─────────────────────────────────────────────
  // 10. BANE-LINE SITH (LEGENDS EXTENDED)
  // ─────────────────────────────────────────────
  {
    id: "sith-bane-line-legends",
    name: "Darth Bane's Sith Line — Legends Extended Chain",
    type: "Master-Apprentice (Sith)",
    summary:
      "The full Legends-continuity chain of Darth Bane's Rule of Two line, documenting the succession of Sith Lords through the centuries leading to Darth Plagueis and Palpatine.",
    description:
      "The Legends expanded universe detailed the Rule of Two's unbroken succession across a thousand years, most fully in the Darth Bane trilogy by Drew Karpyshyn and the Darth Plagueis novel by James Luceno. After Bane and Zannah, the chain passed through Darth Cognus to her apprentice Darth Millennial — who broke the Rule and had to be disowned — and then through a line including Darth Vectivus and Darth Plagueis. Bane had been tempted to abandon the Rule himself on multiple occasions; Zannah's killing of him proved the Rule functioned. Subsequent Sith maintained absolute secrecy, each generation watching the Republic and waiting for the perfect moment. Darth Tenebrous, in Legends, secretly created 'maxi-chlorians' as a failsafe for his own consciousness, a gambit that ultimately failed. The chain's final canonical overlap with Legends is in the Darth Plagueis novel, which bridges Legends material with broad canonical compatibility.",
    thematicArc:
      "The Legends extension of Bane's chain illustrates the Rule of Two's fundamental irony: a system designed for strength produced masters who spent most of their energy managing their own succession rather than prosecuting the Sith's revenge. Each generation added cunning and self-discipline, but also paranoia, isolation, and the psychological damage of spending one's entire life in anticipation of being murdered by one's student.",
    spans: ["old-republic", "fall-of-republic"],
    rootId: "bane-legends",
    nodes: [
      {
        id: "bane-legends",
        name: "Darth Bane",
        characterId: "darth-bane",
        role: "Founder",
        era: "old-republic",
        alignment: "Dark",
        apprentices: ["zannah-legends"],
        note:
          "Drew Karpyshyn's Darth Bane trilogy depicts his origin as a miner named Dessel who discovered the dark side through Sith Holocrons on Korriban. Bane's insistence on the Orbalisk armor and his near-insanity before its removal are unique to the Legends novels.",
      },
      {
        id: "zannah-legends",
        name: "Darth Zannah",
        role: "Bane's Female Apprentice / Sorcerer",
        era: "old-republic",
        alignment: "Dark",
        master: "bane-legends",
        apprentices: ["cognus-legends"],
        note:
          "A gifted Sith sorcerer who mastered force illusions and torture-based techniques, Zannah defeated an aging Bane in their final duel and took the title of Dark Lord — demonstrating that the Rule selected for cunning and will over brute power.",
      },
      {
        id: "cognus-legends",
        name: "Darth Cognus",
        role: "The Huntress",
        era: "old-republic",
        alignment: "Dark",
        master: "zannah-legends",
        apprentices: ["millennial-legends"],
        note:
          "An Iktotchi three-eyed assassin with precognitive abilities who became Zannah's apprentice after Zannah hired her as a contract killer. Cognus's ability to glimpse the future made her an unusually patient and calculating Sith Master.",
      },
      {
        id: "millennial-legends",
        name: "Darth Millennial",
        role: "Apostate — founded Prophets of the Dark Side",
        era: "old-republic",
        alignment: "Dark",
        master: "cognus-legends",
        note:
          "Cognus's apprentice who refused the Rule of Two and fled to establish the Prophets of the Dark Side on Dromund Kaas. His defection forced Cognus to seek another student; the Prophets survived as a fringe dark-side cult into the Imperial era.",
      },
      {
        id: "vectivus-legends",
        name: "Darth Vectivus",
        role: "The Unremarkable Sith",
        era: "old-republic",
        alignment: "Dark",
        note:
          "A Sith who lived as an ordinary mining magnate on an asteroid facility built over a dark side nexus. Vectivus studied the dark side without cruelty or ambition for conquest, making him paradoxically notable in a chain defined by violent ambition.",
      },
      {
        id: "tenebrous-legends",
        name: "Darth Tenebrous",
        role: "Scientific Sith Master",
        era: "old-republic",
        alignment: "Dark",
        apprentices: ["plagueis-legends"],
        note:
          "A Bith Sith who used theoretical physics and midi-chlorian science as Force study, Tenebrous attempted to transcend the Rule of Two through his maxi-chlorian project — engineering a way to possess Force-sensitive hosts after death. His plan failed when Plagueis killed him.",
      },
      {
        id: "plagueis-legends",
        name: "Darth Plagueis",
        characterId: "darth-plagueis",
        role: "Architect of Palpatine's Rise",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "tenebrous-legends",
        apprentices: ["sidious-legends"],
        note:
          "James Luceno's novel 'Darth Plagueis' presents the Muun banker Hego Damask as Plagueis's civilian identity, funding galactic politics while manipulating midi-chlorians in secret. His murder of Tenebrous and his own murder by Sidious bookend a brilliance that never achieved its goal of eternal life.",
      },
      {
        id: "sidious-legends",
        name: "Darth Sidious",
        characterId: "darth-sidious",
        role: "The Rule's Apex and End",
        era: "fall-of-republic",
        alignment: "Dark",
        master: "plagueis-legends",
        note:
          "In both Legends and Canon, Sidious represents the culmination of a thousand years of patient Sith planning. The Legends novel explicitly shows Plagueis and Sidious co-orchestrating the Trade Federation's blockade of Naboo before Sidious killed Plagueis.",
      },
    ],
    notableEvents: [
      { era: "old-republic", event: "Darth Bane destroys the Sith Brotherhood of Darkness and establishes the Rule of Two on Ruusan" },
      { era: "old-republic", event: "Darth Zannah defeats Bane; Rule of Two succession begins" },
      { era: "old-republic", event: "Darth Millennial breaks the Rule; founds Prophets of the Dark Side" },
      { era: "fall-of-republic", event: "Darth Tenebrous killed by Plagueis on Bal'demnic" },
      { era: "fall-of-republic", event: "Darth Plagueis and Sidious co-orchestrate the Naboo crisis" },
      { era: "fall-of-republic", event: "Palpatine murders Plagueis; Rule of Two devolves to Sidious's manipulation" },
    ],
    affiliations: ["sith-order"],
    continuity: "Legends",
    importance: 3,
    color: "#b91c1c",
  },

  // ─────────────────────────────────────────────
  // 11. CLAN MUDHORN / DIN DJARIN
  // ─────────────────────────────────────────────
  {
    id: "clan-mudhorn",
    name: "Clan Mudhorn — Din Djarin and Grogu",
    type: "Clan",
    summary:
      "The foundling tradition made personal: a Mandalorian bounty hunter and a 50-year-old Force-sensitive child who adopted each other across three seasons of war, diplomacy, and sacrifice.",
    description:
      "Din Djarin was himself a foundling — rescued by Death Watch Mandalorians during the Clone Wars and raised under the Children of the Watch, a fundamentalist sect that followed the Way of the Mandalore with absolute strictness. Contracted to retrieve a high-value target, Din instead chose to protect the child Grogu — a Jedi foundling who escaped Order 66 — and this act of mercy defined the rest of his story. The two formally became Clan Mudhorn when Din carved the signet after defeating the mudhorn beast together, a symbol of their unexpected bond. Din eventually removed his helmet — breaking his sect's most sacred rule — to let Grogu see his face, and was subsequently expelled from his covert. He underwent redemption by bathing in the Living Waters beneath the Mines of Mandalore. Grogu was eventually accepted as a member of the Armorer's new Mandalorian covert, and their family endured despite every separation the galaxy imposed.",
    thematicArc:
      "Clan Mudhorn is about the foundling tradition as the Mandalorian code's moral center — the idea that family is made by choice and protection, not birth or blood. Din Djarin's arc is one of a rigid man learning when rules must yield to love, and Grogu's arc is one of a child who remembers his first family (the Jedi) but chooses his second. Their clan represents the Mandalorian way at its best: warfare in service of the defenseless.",
    spans: ["new-republic-era", "first-order-era"],
    rootId: "din-djarin",
    nodes: [
      {
        id: "din-djarin",
        name: "Din Djarin (The Mandalorian)",
        characterId: "din-djarin",
        role: "Foundling / Clan Father",
        era: "new-republic-era",
        alignment: "None",
        children: ["grogu-node"],
        note:
          "A foundling raised by Death Watch who became a bounty hunter, Din broke every personal code he held to protect Grogu and eventually forged a new understanding of what it means to follow 'the Way.' His helmet removal and subsequent redemption arc redeemed not just himself but his rigid sect's interpretation of Mandalorian custom.",
      },
      {
        id: "grogu-node",
        name: "Grogu",
        characterId: "grogu",
        role: "Foundling / Adopted Son",
        era: "new-republic-era",
        alignment: "Light",
        parents: ["din-djarin"],
        note:
          "A 50-year-old member of Yoda's species who was a Jedi youngling during Order 66 and was hidden in the galaxy by multiple protectors before Din found him. Grogu chose Din over Luke Skywalker's Jedi training, receiving Mandalorian beskar armor from Luke as a parting gift.",
      },
      {
        id: "bo-katan-mudhorn",
        name: "Bo-Katan Kryze",
        characterId: "bo-katan-kryze",
        role: "Ally / Future Manda'lor",
        era: "new-republic-era",
        alignment: "Gray",
        note:
          "Bo-Katan's arc intersects deeply with Clan Mudhorn when Din's accidental acquisition of the Darksaber makes her quest for its return central to Mandalorian politics. She eventually reclaims the Darksaber and begins the process of Mandalorian reunification.",
      },
      {
        id: "armorer-mudhorn",
        name: "The Armorer",
        role: "Clan Forge-Keeper / Religious Authority",
        era: "new-republic-era",
        alignment: "None",
        note:
          "The spiritual and practical leader of Din's covert, the Armorer forged Grogu's beskar chainmail and formally named Clan Mudhorn's signet. She expelled Din when he removed his helmet and later readmitted him after his redemption in the Living Waters.",
      },
    ],
    notableEvents: [
      { era: "new-republic-era", event: "Din Djarin retrieves then defects to protect Grogu; forms Clan Mudhorn" },
      { era: "new-republic-era", event: "Din removes his helmet to let Grogu see his face; breaks the Way" },
      { era: "new-republic-era", event: "Grogu chooses Din over Luke Skywalker's Jedi training" },
      { era: "new-republic-era", event: "Din redeems himself in the Living Waters of Mandalore; rejoins his people" },
      { era: "new-republic-era", event: "Bo-Katan reclaims the Darksaber; Mandalore begins to be restored" },
    ],
    affiliations: ["mandalorians"],
    continuity: "Canon",
    importance: 4,
    color: "#94a3b8",
  },

  // ─────────────────────────────────────────────
  // 12. HOUSE VIZSLA / DEATH WATCH / KRYZE
  // ─────────────────────────────────────────────
  {
    id: "vizsla-kryze",
    name: "House Vizsla, Death Watch, and Clan Kryze",
    type: "Clan",
    summary:
      "The political and martial lineage of Mandalore's most powerful houses, spanning from the first Mandalorian Jedi and the Darksaber's forging through the Death Watch's rise to Bo-Katan Kryze's bid for unity.",
    description:
      "Tarre Vizsla was the first — and for millennia, only — Mandalorian to be inducted into the Jedi Order, and he forged the unique black-bladed lightsaber known as the Darksaber, which became the symbol of Mandalorian leadership. After Tarre's death, House Vizsla retrieved the Darksaber from the Jedi Temple and wielded it as a symbol of clan primacy for generations. Pre Vizsla, a descendant, founded Death Watch as a hardline nationalist faction opposing Duchess Satine Kryze's pacifist rule, and briefly wielded the Darksaber as a warlord before being killed by Darth Maul. Satine Kryze — sister to Bo-Katan — was a pacifist leader of the New Mandalorians who maintained a careful neutrality during the Clone Wars until her murder by Maul. Bo-Katan Kryze rejected Death Watch's terrorism while also rejecting her sister's pacifism, seeking a middle path of warrior honor. She eventually claimed the Darksaber legitimately and sought to unite the Mandalorian clans after the Empire's Night of a Thousand Tears decimated Mandalore.",
    thematicArc:
      "The Vizsla-Kryze lineage is Mandalore's political soul: the eternal tension between warrior tradition and civilized governance, between power claimed by conquest and power legitimized by unity. The Darksaber is the lineage's central symbol — whoever holds it holds Mandalore's identity, but the blade demands it be won, not given, lest its holder face rejection from the people. Bo-Katan's tragedy is that she received the Darksaber from Din Djarin (who won it accidentally) rather than in true combat, poisoning her authority until she redeemed it through genuine battle.",
    spans: [
      "old-republic",
      "fall-of-republic",
      "clone-wars",
      "rise-of-empire",
      "imperial-era",
      "rebellion-era",
      "new-republic-era",
    ],
    rootId: "tarre-vizsla",
    nodes: [
      {
        id: "tarre-vizsla",
        name: "Tarre Vizsla",
        role: "First Mandalorian Jedi / Darksaber's Forger",
        era: "old-republic",
        alignment: "Light",
        children: ["house-vizsla-line"],
        note:
          "The only Mandalorian inducted into the Jedi Order in the Old Republic era, Tarre Vizsla forged the Darksaber — a unique black-bladed lightsaber that became the symbol of Mandalorian leadership. His dual identity as Jedi and Mandalorian established that the two traditions need not be mutually exclusive.",
      },
      {
        id: "house-vizsla-line",
        name: "House Vizsla (unnamed generations)",
        role: "Darksaber Keepers",
        era: "old-republic",
        alignment: "None",
        parents: ["tarre-vizsla"],
        children: ["pre-vizsla-node"],
        note:
          "The Vizsla clan retrieved the Darksaber from the Jedi Temple after Tarre's death and wielded it as a symbol of clan authority for centuries, establishing the precedent that the Darksaber and Mandalorian leadership were inseparable.",
      },
      {
        id: "pre-vizsla-node",
        name: "Pre Vizsla",
        characterId: "pre-vizsla",
        role: "Death Watch Founder / Warlord",
        era: "clone-wars",
        alignment: "Dark",
        parents: ["house-vizsla-line"],
        siblings: ["satine-vizsla-ref"],
        note:
          "Governor of Concordia and founder of Death Watch, Pre Vizsla briefly allied with Darth Maul before being killed by him in a Darksaber duel — transferring the blade to a Sith Lord and creating the political crisis that followed. His nationalism masked personal ambition.",
      },
      {
        id: "satine-kryze-node",
        name: "Duchess Satine Kryze",
        characterId: "satine-kryze",
        role: "Pacifist Duchess of Mandalore",
        era: "clone-wars",
        alignment: "None",
        siblings: ["bo-katan-node"],
        note:
          "A pacifist leader who maintained Mandalore's neutrality during the Clone Wars at enormous political cost, Satine had a deep and unspoken romantic bond with Obi-Wan Kenobi. She was murdered by Darth Maul to punish Obi-Wan, an act that destabilized Mandalore for years.",
      },
      {
        id: "bo-katan-node",
        name: "Bo-Katan Kryze",
        characterId: "bo-katan-kryze",
        role: "Regent / Manda'lor-in-Waiting",
        era: "clone-wars",
        alignment: "Gray",
        siblings: ["satine-kryze-node"],
        note:
          "Satine's warrior sister who served in Death Watch before renouncing its terrorism, Bo-Katan was appointed Regent of Mandalore and has spent decades seeking the Darksaber as the symbol of legitimate rule. She embodies the conflict between Mandalorian warrior heritage and the responsibility of leadership.",
      },
      {
        id: "korkie-kryze",
        name: "Korkie Kryze",
        role: "Satine's nephew / Young Cadet",
        era: "clone-wars",
        alignment: "None",
        note:
          "Satine's nephew and a cadet at the Royal Mandalorian Academy, Korkie attempted to help Obi-Wan rescue Satine and later resisted Death Watch's occupation. His parentage is notably ambiguous in canon.",
      },
      {
        id: "paz-vizsla",
        name: "Paz Vizsla",
        role: "Children of the Watch / Vizsla Descendant",
        era: "new-republic-era",
        alignment: "None",
        note:
          "A heavy infantry warrior of the Children of the Watch covert and descendant of House Vizsla, Paz Vizsla challenged Din Djarin for the Darksaber and lost, granting Din a measure of legitimacy. He died heroically during the siege of the Mandalorian covert.",
      },
    ],
    notableEvents: [
      { era: "old-republic", event: "Tarre Vizsla inducted into Jedi Order; forges the Darksaber" },
      { era: "old-republic", event: "House Vizsla retrieves the Darksaber from the Jedi Temple after Tarre's death" },
      { era: "clone-wars", event: "Pre Vizsla founds Death Watch; allies with then is killed by Darth Maul" },
      { era: "clone-wars", event: "Satine Kryze murdered by Maul; Bo-Katan refuses to accept Maul's rule" },
      { era: "imperial-era", event: "Imperial Night of a Thousand Tears devastates Mandalore" },
      { era: "new-republic-era", event: "Bo-Katan reclaims the Darksaber and works toward Mandalorian reunification" },
    ],
    affiliations: ["mandalorians", "death-watch"],
    continuity: "Canon",
    importance: 4,
    color: "#1e40af",
  },

  // ─────────────────────────────────────────────
  // 13. FETT CLONE FAMILY
  // ─────────────────────────────────────────────
  {
    id: "fett-clone-family",
    name: "The Fett Bloodline and Clone Legacy",
    type: "Bloodline",
    summary:
      "Jango Fett's genetic legacy spans a bounty hunting dynasty and the entire Grand Army of the Republic — one man's DNA became both a son and a million soldiers.",
    description:
      "Jango Fett was a Mandalorian foundling who became arguably the galaxy's most skilled bounty hunter, chosen by Darth Tyranus (Dooku) to be the template for the Republic's clone army. As his price for the contract, Jango demanded an unmodified clone to raise as a son — Boba Fett. Boba was raised alongside his father and witnessed Jango's decapitation by Mace Windu on Geonosis, a trauma that defined his life. The clone troopers — Rex, Cody, Fives, Wolffe, and thousands more — were Jango's biological legacy, trained for war and implanted with inhibitor chips that would execute Order 66. Some clones, notably Rex and Fives, removed or discovered their chips and retained free will. Boba Fett grew from a boy seeking revenge into the galaxy's most feared bounty hunter, eventually claiming the throne of Jabba's criminal empire on Tatooine and attempting a new kind of leadership based on respect rather than fear.",
    thematicArc:
      "The Fett legacy raises the saga's sharpest questions about identity and free will: when a man's DNA is used to create an army without their consent, who owns the descendants? The clones are simultaneously Jango's sons and the Republic's tools, a tension the best clone stories (Rex, Fives, the Bad Batch) explore through the cost of individuality within a programmed identity. Boba's journey from orphan to crime lord mirrors his father's rise as a man who turned abandonment into armor.",
    spans: ["fall-of-republic", "clone-wars", "rise-of-empire", "imperial-era", "rebellion-era", "new-republic-era"],
    rootId: "jango-fett-node",
    nodes: [
      {
        id: "jango-fett-node",
        name: "Jango Fett",
        characterId: "jango-fett",
        role: "Template / Father",
        era: "fall-of-republic",
        alignment: "None",
        children: ["boba-fett-node", "clone-army-ref"],
        note:
          "A Mandalorian foundling who became the Republic's clone template at Dooku's request, Jango was as calculating in business as in combat. His death on Geonosis left ten-year-old Boba holding his helmet in the arena dust.",
      },
      {
        id: "boba-fett-node",
        name: "Boba Fett",
        characterId: "boba-fett",
        role: "Unmodified Son / Crime Lord",
        era: "imperial-era",
        alignment: "None",
        parents: ["jango-fett-node"],
        note:
          "The only unmodified Fett clone, raised as Jango's true son, Boba became a feared bounty hunter before his apparent death in the Sarlacc pit and eventual return as Daimyo of Tatooine. He attempted to rule through respect rather than fear — with mixed results.",
      },
      {
        id: "clone-army-ref",
        name: "The Grand Army of the Republic (Clone Troopers)",
        role: "Genetic Legacy / Mass Clone Force",
        era: "clone-wars",
        alignment: "None",
        parents: ["jango-fett-node"],
        note:
          "Three million clone troopers carrying Jango's genetics were produced at the Kaminoan facilities, each accelerated to double the aging rate and implanted with inhibitor chips. Their execution of Order 66 destroyed the Jedi Order — a legacy Jango never intended and Boba never claimed.",
      },
      {
        id: "rex-node",
        name: "Captain Rex (CT-7567)",
        role: "Clone Captain / Free Agent",
        era: "clone-wars",
        alignment: "Light",
        parents: ["jango-fett-node"],
        note:
          "Rex was perhaps the most fully realized individual clone, his identity shaped by years of service with Anakin Skywalker and Ahsoka Tano. He removed his inhibitor chip before Order 66 and survived to fight in the Rebellion, appearing at the Battle of Endor in Legends continuity.",
      },
      {
        id: "cody-node",
        name: "Commander Cody (CC-2224)",
        role: "Clone Commander",
        era: "clone-wars",
        alignment: "None",
        parents: ["jango-fett-node"],
        note:
          "Obi-Wan Kenobi's trusted clone commander who executed Order 66 against him on Utapau — one of the saga's most painful moments of institutional betrayal. Cody's chip worked as intended, making him the dark mirror of Rex's free will.",
      },
    ],
    notableEvents: [
      { era: "fall-of-republic", event: "Jango Fett contracts with Dooku as clone template; requests Boba as payment" },
      { era: "fall-of-republic", event: "Jango Fett killed by Mace Windu at the Battle of Geonosis" },
      { era: "clone-wars", event: "Clone Trooper Fives discovers the inhibitor chip conspiracy; killed before warning Anakin" },
      { era: "rise-of-empire", event: "Order 66 executed by clone troopers; Great Jedi Purge begins" },
      { era: "rebellion-era", event: "Boba Fett falls into the Sarlacc pit on Tatooine" },
      { era: "new-republic-era", event: "Boba Fett returns and claims Jabba's throne as Daimyo of Mos Espa" },
    ],
    affiliations: ["galactic-republic", "mandalorians", "jabbas-criminal-empire"],
    continuity: "Both",
    importance: 4,
    color: "#78716c",
  },

  // ─────────────────────────────────────────────
  // 14. TANO INFORMAL LINEAGE
  // ─────────────────────────────────────────────
  {
    id: "tano-informal-lineage",
    name: "Ahsoka Tano's Informal Teaching Lineage",
    type: "Mentor Chain",
    summary:
      "The living chain from Anakin Skywalker through Ahsoka Tano to Sabine Wren and Ezra Bridger — a non-institutional Jedi legacy passed between survivors and misfits who kept the light burning outside any temple.",
    description:
      "Ahsoka Tano received her training from Anakin Skywalker during the Clone Wars, absorbing his aggressive, emotionally driven approach to the Force. When she left the Order before its fall, she became the bridge between the Old Republic Jedi tradition and whatever came after. During the Galactic Civil War she served as Fulcrum, a Rebellion intelligence asset, and mentored young Force-users she encountered without ever reclaiming the Jedi title. Kanan Jarrus and Ezra Bridger were members of the Ghost crew she advised and connected to the broader Rebel network; Ezra's training under Kanan and his own unconventional growth drew from the same lineage Ahsoka represented. After the Empire's fall, Ahsoka formally took Sabine Wren — a Mandalorian with latent Force sensitivity and zero interest in becoming a Jedi — as her apprentice, proving the Force could be taught outside institutional walls and to people who didn't fit traditional profiles. Sabine and Ahsoka's search for Ezra Bridger (missing after the Battle of Lothal) continued this tradition of chosen family over ordained structure.",
    thematicArc:
      "Ahsoka's lineage is about the Force as living relationship rather than institutional curriculum. Each person in this chain was in some way rejected or excluded by the Jedi Order — Ahsoka falsely accused, Kanan traumatized by the Purge, Ezra a street orphan, Sabine a Mandalorian with a troubled past. Their connections prove that the Force doesn't require credentialing or tradition: it requires the teacher's genuine investment in the student's wholeness, which is exactly what Anakin gave Ahsoka and she passed forward.",
    spans: ["clone-wars", "imperial-era", "rebellion-era", "new-republic-era", "first-order-era"],
    rootId: "anakin-tano",
    nodes: [
      {
        id: "anakin-tano",
        name: "Anakin Skywalker",
        characterId: "anakin-skywalker",
        role: "Origin of the Chain",
        era: "clone-wars",
        alignment: "Corrupted",
        apprentices: ["ahsoka-tano-node"],
        note:
          "Anakin's unconventional, emotionally raw teaching style made Ahsoka uniquely adaptable. He taught her to fight, to question, and to trust herself — and in doing so gave her the tools to survive what he could not.",
      },
      {
        id: "ahsoka-tano-node",
        name: "Ahsoka Tano",
        characterId: "ahsoka-tano",
        role: "Living Link / Chain Keeper",
        era: "imperial-era",
        alignment: "Light",
        master: "anakin-tano",
        apprentices: ["sabine-tano", "ezra-adjacent"],
        note:
          "The chain's central figure across multiple decades and media, Ahsoka refused the Jedi title but lived every principle the Order claimed. Her white lightsabers — purified from fallen Sith — symbolize a Force philosophy she developed independently of institutional doctrine.",
      },
      {
        id: "kanan-tano-adjacent",
        name: "Kanan Jarrus",
        characterId: "kanan-jarrus",
        role: "Rebel Jedi / Adjacent to Chain",
        era: "imperial-era",
        alignment: "Light",
        note:
          "A Padawan who survived Order 66 and trained Ezra Bridger in the field, Kanan was connected to Ahsoka's network through the Ghost crew. Though he trained independently, Ahsoka's guidance and his connection to her lineage informed his approach to Ezra's irregular education.",
      },
      {
        id: "ezra-adjacent",
        name: "Ezra Bridger",
        characterId: "ezra-bridger",
        role: "Irregular Padawan",
        era: "imperial-era",
        alignment: "Light",
        master: "kanan-tano-adjacent",
        note:
          "Ezra was trained by Kanan and advised by Ahsoka, navigating the temptation of the dark side with less support than any traditional Padawan. His sacrifice at Lothal — redirecting a purrgil pod into hyperspace — echoed the chain's recurring theme of selflessness over self-preservation.",
      },
      {
        id: "sabine-tano",
        name: "Sabine Wren",
        characterId: "sabine-wren",
        role: "Ahsoka's Formal Apprentice",
        era: "new-republic-era",
        alignment: "Light",
        master: "ahsoka-tano-node",
        note:
          "A Mandalorian warrior and artist who studied under Ahsoka years after the Empire's fall, Sabine came to the Force late and reluctantly, driven by personal loyalty rather than spiritual calling. Her development represents the chain's final evolution: Force training as an extension of character, not its definition.",
      },
    ],
    notableEvents: [
      { era: "clone-wars", event: "Ahsoka Tano assigned to Anakin as Padawan; the chain begins" },
      { era: "clone-wars", event: "Ahsoka leaves the Jedi Order after false accusations — severs institutional ties" },
      { era: "imperial-era", event: "Ahsoka joins the Rebellion as Fulcrum; advises Ghost crew including Kanan and Ezra" },
      { era: "rebellion-era", event: "Ahsoka duels Vader on Malachor; presumed dead, actually saved" },
      { era: "rebellion-era", event: "Ezra Bridger sacrifices himself to save Lothal; disappears into hyperspace" },
      { era: "new-republic-era", event: "Ahsoka takes Sabine Wren as apprentice; both search for Ezra Bridger" },
    ],
    affiliations: ["jedi-order", "rebel-alliance"],
    continuity: "Canon",
    importance: 4,
    color: "#a78bfa",
  },
];

export function findLineage(id: string): Lineage | undefined {
  return LINEAGES.find((l) => l.id === id);
}

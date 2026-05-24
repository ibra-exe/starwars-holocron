// Faction rank hierarchies — maps faction id → ordered ranks (top → bottom).
// Each rank carries title, optional tier, notable/current holder, optional character link, and lore description.
import { FactionRank } from "./types";

export const FACTION_RANKS: Record<string, FactionRank[]> = {
  // ───────────────────────── Jedi Order ─────────────────────────
  "jedi-order": [
    {
      title: "Grand Master",
      tier: 1,
      holder: "Yoda (Clone Wars era); Luke Skywalker (post-OT)",
      holderCharacterId: "yoda",
      description:
        "Highest spiritual authority of the Order. Recognized as the wisest living Jedi, presiding over the Council and serving as the moral compass of the entire institution.",
    },
    {
      title: "Master of the Order",
      tier: 1,
      holder: "Mace Windu (Clone Wars)",
      holderCharacterId: "mace-windu",
      description:
        "Administrative head of the High Council. Conducts Council sessions, liaises with the Senate and the Supreme Chancellor, and oversees Order-wide policy.",
    },
    {
      title: "High Council Member (Jedi Master, Council Seat)",
      tier: 2,
      description:
        "One of twelve seated Masters who govern the Order from the Jedi Temple on Coruscant. Five permanent seats, four long-term seats, three short-term seats. Sets doctrine, assigns Knights, and ratifies trials.",
    },
    {
      title: "Council Member — Council of First Knowledge / Reconciliation / Reassignment",
      tier: 2,
      description:
        "Sub-councils that govern the Archives & education, diplomatic mediation, and the Service Corps. Each is chaired by senior Masters.",
    },
    {
      title: "Jedi Master",
      tier: 3,
      description:
        "A Knight who has successfully trained a Padawan to Knighthood, or whose contributions to the Order are judged worthy of the title by the Council. May sit on sub-councils, teach in the Temple, or undertake long solo missions.",
    },
    {
      title: "Jedi Knight",
      tier: 4,
      description:
        "Full Jedi who has passed the Trials of Knighthood (Skill, Courage, Flesh, Spirit, Insight). Wears robes without a Padawan braid. Specializes as Guardian (warrior), Consular (scholar/diplomat), or Sentinel (investigator).",
    },
    {
      title: "Padawan Learner",
      tier: 5,
      description:
        "Apprentice assigned to one Knight or Master. Wears the Padawan braid. Trains via direct field experience until ready for the Trials, typically over a decade.",
    },
    {
      title: "Jedi Initiate (Youngling)",
      tier: 6,
      description:
        "Force-sensitive child taken in by the Order. Trained in clans (e.g., the Bear Clan under Yoda). At ~13 must be chosen as Padawan or transferred to the Service Corps.",
    },
    {
      title: "Service Corps Member",
      tier: 7,
      description:
        "Initiates who were never selected as Padawans. Serve in the Agricultural, Medical, Educational, or Exploration Corps — performing humanitarian missions across the galaxy.",
    },
    {
      title: "Specialist Role — Battlemaster / Watchman / Shadow",
      tier: 4,
      description:
        "Specialty titles overlaid on Knight/Master rank. Battlemasters teach lightsaber forms (e.g., Cin Drallig). Watchmen oversee a single sector or world. Shadows hunt Sith and dark-side cults in secret.",
    },
  ],

  // ───────────────────────── Sith Order (Rule of Two) ─────────────────────────
  "sith-order": [
    {
      title: "Dark Lord of the Sith (Sith Master)",
      tier: 1,
      holder: "Darth Sidious",
      holderCharacterId: "sheev-palpatine",
      description:
        "Embodiment of Sith power under Bane's Rule of Two. The Master holds dominion, possesses the deepest knowledge of the dark side, and shapes the Sith Grand Plan against the Jedi.",
    },
    {
      title: "Sith Lord (Apprentice / 'Darth')",
      tier: 2,
      holder: "Darth Vader",
      holderCharacterId: "darth-vader",
      description:
        "The sole official Sith apprentice, granted the 'Darth' title upon initiation. Inherits the Master's secrets, executes their will, and is destined either to overthrow them or be replaced.",
    },
    {
      title: "Acolyte / Sith Assassin (unofficial)",
      tier: 3,
      description:
        "Hidden dark-side adherents kept off the books — Maul after his demotion, Savage Opress, Asajj Ventress, Snoke (as Sidious's strand-cast pawn). They served Sith ends without bearing the 'Darth' title, because the Rule of Two forbade a third Sith.",
    },
    {
      title: "Hand of the Emperor (Imperial Era extension)",
      tier: 3,
      description:
        "Dark-side servants directly bonded to Palpatine — Mara Jade (Legends), Sentinel droids and operatives — used to enforce his will without violating the Rule of Two.",
    },
  ],

  // ───────────────────────── Sith Eternal ─────────────────────────
  "sith-eternal": [
    {
      title: "Emperor Reborn",
      tier: 1,
      holder: "Sheev Palpatine (cloned)",
      holderCharacterId: "sheev-palpatine",
      description:
        "Resurrected and sustained by the cult on Exegol. The cult's sole purpose is to preserve and embody his consciousness across cloned bodies until a true heir can wield him.",
    },
    {
      title: "Sith Eternal Cultist (Sovereign Protector)",
      tier: 2,
      description:
        "Hooded acolytes of Exegol — geneticists, prophets, and zealots descended from generations of Sith loyalists who fled the Empire's fall. They built the Final Order fleet in secret.",
    },
    {
      title: "Sith Trooper",
      tier: 3,
      description:
        "Elite crimson-armored stormtroopers raised in Sith Eternal nurseries on Exegol. Each is indoctrinated from birth and serves as ground enforcer of the Final Order.",
    },
    {
      title: "Knight of Ren (allied vassal)",
      tier: 3,
      description:
        "Dark-side warrior cult that swore to Kylo Ren and indirectly served the Eternal's resurrection plan.",
    },
  ],

  // ───────────────────────── Galactic Republic ─────────────────────────
  "galactic-republic": [
    {
      title: "Supreme Chancellor",
      tier: 1,
      holder: "Sheev Palpatine (32–19 BBY)",
      holderCharacterId: "sheev-palpatine",
      description:
        "Elected head of state and presiding officer of the Galactic Senate. Term-limited under normal law, granted emergency powers during the Clone Wars — never relinquished.",
    },
    {
      title: "Vice Chair / Vice Chancellor",
      tier: 2,
      description:
        "Second-in-command, presides over the Senate in the Chancellor's absence. Held by Mas Amedda during the Clone Wars.",
    },
    {
      title: "Senator (Galactic Senate)",
      tier: 3,
      holder: "Padmé Amidala, Bail Organa, Mon Mothma",
      holderCharacterId: "padme-amidala",
      description:
        "Elected or appointed representative of a sector or world. Drafts legislation, votes on war powers, and serves on committees. ~1,024 sectors are represented.",
    },
    {
      title: "Junior / Apprentice Legislator",
      tier: 4,
      description:
        "Youth program creating future Senators — Padmé began her career here. Apprentice Legislators advise their senior senator and lobby the Senate.",
    },
    {
      title: "Member of the Loyalist Committee",
      tier: 4,
      description:
        "Senators who openly opposed the Separatist movement and the Chancellor's emergency powers — Padmé, Bail Organa, Mon Mothma, Onaconda Farr.",
    },
    {
      title: "Supreme Court Justice",
      tier: 3,
      description:
        "Highest judicial authority of the Republic, interpreting constitutional law.",
    },
    {
      title: "Judicial Forces Officer",
      tier: 4,
      description:
        "Pre-Clone-Wars peacekeeping branch — sector judicial officers handled law enforcement before the Grand Army of the Republic was created.",
    },
  ],

  // ───────────────────────── CIS (Separatists) ─────────────────────────
  "cis": [
    {
      title: "Head of State (Shadow leader)",
      tier: 1,
      holder: "Darth Sidious (secret)",
      holderCharacterId: "sheev-palpatine",
      description:
        "The hidden Sith master who manufactured the Separatist crisis as both sides of the war. None of the CIS's public leaders knew he commanded them.",
    },
    {
      title: "Head of State (public)",
      tier: 1,
      holder: "Count Dooku / Darth Tyranus",
      holderCharacterId: "count-dooku",
      description:
        "Charismatic political face of the Confederacy. Former Jedi Master who rallied corporations and disenfranchised systems against the Republic.",
    },
    {
      title: "Supreme Commander, Droid Armies",
      tier: 2,
      holder: "General Grievous",
      holderCharacterId: "general-grievous",
      description:
        "Cyborg Kaleesh warlord and Jedi-killer in command of the entire droid army. Reported to Dooku and, after his death, directly to Sidious.",
    },
    {
      title: "Separatist Council Member",
      tier: 2,
      description:
        "Heads of the megacorporations that formed the Confederacy — Nute Gunray (Trade Federation), Wat Tambor (Techno Union), San Hill (InterGalactic Banking Clan), Poggle the Lesser (Geonosian Industries), Shu Mai (Commerce Guild), Po Nudo (Hyper-Communications Cartel), Tikkes (Quarren Isolation League), Passel Argente (Corporate Alliance).",
    },
    {
      title: "Separatist Senator",
      tier: 3,
      description:
        "Representatives of seceding worlds in the Confederate Senate on Raxus. Mina Bonteri and Lux Bonteri led the moderate peace faction.",
    },
    {
      title: "Field General / Admiral",
      tier: 3,
      description:
        "Sentient officers — Asajj Ventress, Trench, Riff Tamson — commanding droid armies and Separatist fleets in the field.",
    },
    {
      title: "Battle Droid Tactical Officer (OOM-series)",
      tier: 4,
      description:
        "Yellow-marked command droids leading B1 battle droid squads on the ground.",
    },
  ],

  // ───────────────────────── Trade Federation ─────────────────────────
  "trade-federation": [
    {
      title: "Viceroy",
      tier: 1,
      holder: "Nute Gunray",
      description:
        "Supreme executive of the Federation — sat in the Galactic Senate, controlled the Droid Army that invaded Naboo, later joined the Separatist Council. Killed on Mustafar by Vader.",
    },
    {
      title: "Settlement Officer / Director of the Trade Federation Directorate",
      tier: 2,
      holder: "Rune Haako, Daultay Dofine, Lott Dod",
      description:
        "Senior Neimoidian officials managing trade routes, taxation, and the political committee. Lott Dod was the Federation's Senator.",
    },
    {
      title: "Captain of the Droid Control Ship",
      tier: 3,
      description:
        "Commanded the orbital Lucrehulk freighters whose central computer remotely controlled every battle droid in a sector.",
    },
  ],

  // ───────────────────────── Galactic Empire ─────────────────────────
  "galactic-empire": [
    {
      title: "Emperor",
      tier: 1,
      holder: "Sheev Palpatine / Darth Sidious",
      holderCharacterId: "sheev-palpatine",
      description:
        "Absolute ruler of the galaxy after the Republic's transformation in 19 BBY. Combined head of state, religious authority (as a secret Sith Lord), and supreme military commander.",
    },
    {
      title: "Grand Vizier",
      tier: 2,
      holder: "Mas Amedda",
      description:
        "Highest civilian official below the Emperor; chief of staff for the Imperial bureaucracy.",
    },
    {
      title: "Dark Lord of the Sith / Emperor's Enforcer",
      tier: 2,
      holder: "Darth Vader",
      holderCharacterId: "darth-vader",
      description:
        "The Emperor's personal apprentice and right hand. Outside the formal military chain of command, Vader could countermand any officer and answered only to Palpatine.",
    },
    {
      title: "Grand Moff",
      tier: 3,
      holder: "Wilhuff Tarkin",
      description:
        "Highest regional governor — ruled an Oversector (Priority Sector) containing multiple unstable systems. Tarkin commanded the Death Star.",
    },
    {
      title: "Moff",
      tier: 4,
      holder: "Moff Gideon",
      description:
        "Imperial governor of a single sector. Held civil authority and could direct Imperial military assets in their region. Persisted in the Imperial Remnants.",
    },
    {
      title: "Grand Admiral",
      tier: 3,
      holder: "Grand Admiral Thrawn",
      holderCharacterId: "thrawn",
      description:
        "Twelve white-uniformed admirals personally appointed by the Emperor. Each commanded vast fleets and answered only to Palpatine and Vader.",
    },
    {
      title: "Grand General",
      tier: 3,
      description:
        "Army equivalent of Grand Admiral. Far rarer than naval Grand Admirals; the Empire was a navy-dominated power.",
    },
    {
      title: "Admiral / Vice Admiral / Rear Admiral",
      tier: 4,
      description:
        "Standard flag officers commanding star destroyer task forces. Wear gray (admiral) or rank-coded uniforms.",
    },
    {
      title: "Captain (Naval)",
      tier: 5,
      description:
        "Commands a single Star Destroyer or capital ship. Captain Piett, Captain Needa, Captain Pellaeon.",
    },
    {
      title: "Commander / Commodore",
      tier: 5,
      description:
        "Senior officer of a smaller cruiser or staff officer aboard a flagship.",
    },
    {
      title: "Lieutenant / Ensign",
      tier: 6,
      description:
        "Junior naval officers; bridge crew of capital ships.",
    },
    {
      title: "Stormtrooper Commander",
      tier: 5,
      description:
        "Field officer of stormtrooper legions — typically a Major or Captain in the Stormtrooper Corps, separate from the army's chain of command.",
    },
    {
      title: "Stormtrooper",
      tier: 7,
      description:
        "The Emperor's elite shock infantry. Initially clones of Jango Fett, increasingly replaced by conscripts and volunteers after the Imperial era began.",
    },
    {
      title: "ISB Director / Colonel",
      tier: 4,
      description:
        "Imperial Security Bureau — the Empire's intelligence and counter-insurgency arm. Director Krennic (Advanced Weapons Research), Colonel Yularen (head of ISB), Major Partagaz, Supervisor Dedra Meero.",
    },
    {
      title: "COMPNOR / Inquisitor (separate orders)",
      tier: 4,
      description:
        "Commission for the Preservation of the New Order — political/cultural arm. Inquisitors served Vader as Jedi hunters but were not formally part of the military hierarchy.",
    },
  ],

  // ───────────────────────── Inquisitorius ─────────────────────────
  "inquisitorius": [
    {
      title: "Grand Inquisitor",
      tier: 1,
      holder: "The Grand Inquisitor (Pau'an, former Temple Guard)",
      holderCharacterId: "grand-inquisitor",
      description:
        "Leader of the order; sole one wearing the title. Directly answers to Darth Vader. Killed by Kanan Jarrus on Mustafar.",
    },
    {
      title: "Second Sister / Brother",
      tier: 2,
      holder: "Trilla Suduri (Cal Kestis era), Barriss Offee (Tales canon variant)",
      description:
        "Second-ranking Inquisitor, often given high-priority Jedi-hunting assignments.",
    },
    {
      title: "Third Sister / Brother",
      tier: 2,
      holder: "Reva Sevander",
      description:
        "Third in the order. Reva infiltrated to assassinate Vader after surviving Order 66 as a youngling.",
    },
    {
      title: "Fourth–Tenth Inquisitor",
      tier: 3,
      holder: "Fourth Sister, Fifth Brother, Sixth Brother, Seventh Sister, Eighth Brother, Ninth Sister, Tenth Brother (Marrok)",
      description:
        "Numbered Inquisitors ranked by seniority. Each is a fallen or coerced Force-sensitive — many former Jedi Padawans or Initiates — armed with a spinning double-bladed red lightsaber.",
    },
    {
      title: "Purge Trooper",
      tier: 4,
      description:
        "Elite stormtroopers in jet-black armor who accompanied Inquisitors on Jedi-hunting missions.",
    },
  ],

  // ───────────────────────── Rebel Alliance ─────────────────────────
  "rebel-alliance": [
    {
      title: "Chief of State",
      tier: 1,
      holder: "Mon Mothma",
      holderCharacterId: "mon-mothma",
      description:
        "Founder and civilian head of the Alliance. Authored the Declaration of Rebellion. Coordinated political resistance across cells.",
    },
    {
      title: "Alliance High Command (Senate-in-exile)",
      tier: 2,
      holder: "Bail Organa, Garm Bel Iblis, Cassio Tagge dissidents",
      holderCharacterId: "bail-organa",
      description:
        "Council of senior politicians, generals, and admirals overseeing strategy. Met aboard Home One and various secret bases.",
    },
    {
      title: "General (Alliance Army)",
      tier: 3,
      holder: "Jan Dodonna, Carlist Rieekan, Crix Madine, Davits Draven",
      description:
        "Senior ground commanders. Dodonna planned the Death Star attack; Rieekan commanded Echo Base on Hoth.",
    },
    {
      title: "Admiral (Alliance Fleet)",
      tier: 3,
      holder: "Admiral Ackbar, Admiral Raddus",
      description:
        "Fleet commanders. Ackbar led the Battle of Endor. Mon Calamari naval expertise formed the backbone of the Alliance fleet.",
    },
    {
      title: "Princess / Senator-in-Exile",
      tier: 3,
      holder: "Leia Organa",
      holderCharacterId: "leia-organa",
      description:
        "Royal titles retained from member worlds, used as both diplomatic and operational ranks within the Alliance.",
    },
    {
      title: "Captain / Major / Commander",
      tier: 4,
      holder: "Hera Syndulla (Captain → General), Cassian Andor (Captain), Han Solo (Captain → General)",
      description:
        "Mid-rank field officers leading squadrons, ships, and strike teams.",
    },
    {
      title: "Rebel Cell Leader",
      tier: 4,
      holder: "Saw Gerrera (Partisans), Hera Syndulla (Spectres)",
      description:
        "Commander of an autonomous cell — small, independent units that joined the Alliance under loose central command.",
    },
    {
      title: "Lieutenant / Sergeant",
      tier: 5,
      description:
        "Junior officers and squad leaders — Bodhi Rook (Lt.), Luke Skywalker (Commander after Yavin, started as a Lieutenant).",
    },
    {
      title: "Pilot (Rogue/Gold/Red Squadron)",
      tier: 6,
      description:
        "Starfighter pilots. Wedge Antilles led Rogue Squadron after Yavin. Each squadron used color-coded callsigns.",
    },
    {
      title: "Pathfinder / Special Forces Operator",
      tier: 5,
      description:
        "Elite ground commandos under Crix Madine — Endor strike team operatives.",
    },
  ],

  // ───────────────────────── New Republic ─────────────────────────
  "new-republic": [
    {
      title: "Chancellor of the New Republic",
      tier: 1,
      holder: "Mon Mothma (first); later Lanever Villecham",
      holderCharacterId: "mon-mothma",
      description:
        "Civilian head of state. Elected by the New Republic Senate. Mothma established the office, refused dictatorial emergency powers, and stepped down voluntarily.",
    },
    {
      title: "Chief of Naval Operations / Defense Minister",
      tier: 2,
      description:
        "Headed the dismantled-and-rebuilt New Republic military — Ackbar served until retirement.",
    },
    {
      title: "Senator",
      tier: 3,
      holder: "Leia Organa, Tai-Lin Garr, Ransolm Casterfo",
      holderCharacterId: "leia-organa",
      description:
        "Elected representatives of member worlds. The Senate rotated between capital worlds (Chandrila, Hosnian Prime) rather than centralizing on Coruscant.",
    },
    {
      title: "Centrist vs. Populist Factions",
      tier: 3,
      description:
        "Political blocs — Centrists favored a strong central military; Populists (Leia's faction) favored member-world autonomy. The divide allowed the First Order's rise to go unchallenged.",
    },
    {
      title: "New Republic Marshal",
      tier: 4,
      holder: "Cara Dune, Greef Karga (allied)",
      description:
        "Frontier law enforcement, especially on Outer Rim worlds — chasing former Imperials and crime syndicates.",
    },
    {
      title: "Starfighter Corps Pilot",
      tier: 5,
      description:
        "Carson Teva, Trapper Wolf — patrol pilots flying X-wings under the post-Endor military.",
    },
  ],

  // ───────────────────────── First Order ─────────────────────────
  "first-order": [
    {
      title: "Supreme Leader",
      tier: 1,
      holder: "Snoke (cloned strand-cast); Kylo Ren (briefly)",
      holderCharacterId: "snoke",
      description:
        "Absolute ruler. Snoke was a manufactured proxy of Palpatine; Kylo killed him and took the title before being subordinated to the resurrected Emperor.",
    },
    {
      title: "Master of the Knights of Ren",
      tier: 2,
      holder: "Kylo Ren",
      holderCharacterId: "kylo-ren",
      description:
        "Leader of the dark-side warrior cult. Distinct from but parallel to the Supreme Leader role.",
    },
    {
      title: "Allegiant General",
      tier: 2,
      holder: "Allegiant General Pryde",
      description:
        "Former Imperial officer; political-ideological leader of the First Order's military, more senior than General Hux.",
    },
    {
      title: "General",
      tier: 3,
      holder: "Armitage Hux",
      holderCharacterId: "general-hux",
      description:
        "Operational commander of the First Order Army. Designed Starkiller Base. Demoted under Pryde, secretly defected as a Resistance spy.",
    },
    {
      title: "Captain",
      tier: 4,
      holder: "Captain Phasma",
      holderCharacterId: "captain-phasma",
      description:
        "Commander of the stormtrooper corps. Phasma wore unique chrome armor and oversaw the training of conscripted child stormtroopers.",
    },
    {
      title: "Stormtrooper (FN-/JB-/etc. series)",
      tier: 5,
      description:
        "Conscripted from infancy and trained for absolute loyalty. FN-2187 (Finn) defected during the assault on Tuanul.",
    },
  ],

  // ───────────────────────── Resistance ─────────────────────────
  "resistance": [
    {
      title: "General / Founder",
      tier: 1,
      holder: "General Leia Organa",
      holderCharacterId: "leia-organa",
      description:
        "Founded the Resistance in defiance of New Republic complacency. Funded it privately at first, later with covert Senate support.",
    },
    {
      title: "Vice Admiral",
      tier: 2,
      holder: "Amilyn Holdo",
      description:
        "Held command during the Crait evacuation. Sacrificed the Raddus in a lightspeed ramming maneuver.",
    },
    {
      title: "Commander",
      tier: 3,
      holder: "Poe Dameron",
      holderCharacterId: "poe-dameron",
      description:
        "Squadron leader of Black Squadron; demoted by Holdo, eventually promoted to General after Crait.",
    },
    {
      title: "Captain / Lieutenant",
      tier: 4,
      holder: "Captain Cardinal-Sized command (Connix), Snap Wexley",
      description:
        "Junior officers and mid-rank operatives running logistics and intelligence.",
    },
    {
      title: "Pilot / Mechanic / Operative",
      tier: 5,
      holder: "Rose Tico, Paige Tico, Finn, BB-8",
      description:
        "Frontline volunteers — engineers, pilots, defectors, and droids who made up the small but devoted Resistance force.",
    },
  ],

  // ───────────────────────── Mandalorians ─────────────────────────
  "mandalorians": [
    {
      title: "Mand'alor (The Sole Ruler)",
      tier: 1,
      holder: "Bo-Katan Kryze (post-Purge); historically Mandalore the Indomitable, Tarre Vizsla (first Jedi Mand'alor)",
      holderCharacterId: "bo-katan-kryze",
      description:
        "Sole monarch of the Mandalorian people, traditionally won by defeating the previous Mand'alor in combat for the Darksaber. Unifies all clans.",
    },
    {
      title: "Duchess (New Mandalorian Government)",
      tier: 1,
      holder: "Satine Kryze",
      description:
        "Pacifist royal title used by the New Mandalorian movement during the Clone Wars. Rejected the warrior tradition.",
    },
    {
      title: "Clan Chief (Alor)",
      tier: 2,
      description:
        "Patriarch or matriarch of a single Mandalorian clan. Clans align under different houses (Vizsla, Kryze, Wren, Saxon, Rook, etc.) and answer to the Mand'alor in unified eras.",
    },
    {
      title: "House Leader",
      tier: 2,
      description:
        "Heads a coalition of clans. The major historical houses are Vizsla, Kryze, Saxon, and others.",
    },
    {
      title: "Armorer",
      tier: 3,
      holder: "The Armorer",
      holderCharacterId: "armorer",
      description:
        "Spiritual leader of a covert. Maintains beskar forging traditions, conducts Creed ceremonies, and pronounces Mandalorian law within the tribe.",
    },
    {
      title: "Death Watch Lieutenant (historical)",
      tier: 3,
      description:
        "Officers of Pre Vizsla's terrorist organization that overthrew Duchess Satine. Splintered into Nite Owls (Bo-Katan loyalists).",
    },
    {
      title: "Nite Owl",
      tier: 4,
      description:
        "Bo-Katan's elite faction of female Mandalorian warriors with owl-marked helmets.",
    },
    {
      title: "Foundling",
      tier: 5,
      description:
        "Adopted child raised in the Mandalorian Way. Grogu was made Din Djarin's foundling. Many Mandalorians are foundlings rather than blood-Mandalorian.",
    },
    {
      title: "Apprentice / Acolyte (the Watch tribe)",
      tier: 5,
      description:
        "Children of the Watch undergoing training in the Resol'nare and the use of beskar weapons before earning their first beskar plate.",
    },
  ],

  // ───────────────────────── Hutt Cartel ─────────────────────────
  "hutt-cartel": [
    {
      title: "Council of Elders (Hutt Grand Council)",
      tier: 1,
      description:
        "The supreme governing body of Hutt Space, seated on Nal Hutta. Made up of the heads of the major kajidics (Hutt clans) — Desilijic, Besadii, and others.",
    },
    {
      title: "Kajidic Patriarch / Matriarch",
      tier: 2,
      holder: "Jabba Desilijic Tiure ('Jabba the Hutt')",
      holderCharacterId: "jabba-the-hutt",
      description:
        "Head of a single Hutt clan. Jabba ruled the Desilijic kajidic and operated his empire from Tatooine. Other major leaders include Gardulla Besadii and Marlo the Hutt.",
    },
    {
      title: "Lieutenant / Majordomo",
      tier: 3,
      holder: "Bib Fortuna",
      description:
        "Trusted non-Hutt advisor who runs day-to-day operations. Bib Fortuna ran Jabba's palace after his death until killed by Boba Fett.",
    },
    {
      title: "Underling — Slaver, Gambler, Enforcer",
      tier: 4,
      description:
        "Network of subordinate operatives — Crumb the salacious B'omarr, gamoreans, weequay enforcers, twi'lek dancers, and bounty hunters on retainer.",
    },
    {
      title: "Bounty Hunter on Retainer",
      tier: 4,
      holder: "Boba Fett, Greedo, Bossk, IG-88 (era)",
      holderCharacterId: "boba-fett",
      description:
        "Independent hunters frequently contracted by Hutt kajidics for collections, assassinations, and recoveries.",
    },
  ],

  // ───────────────────────── Crimson Dawn ─────────────────────────
  "crimson-dawn": [
    {
      title: "Founder & True Master",
      tier: 1,
      holder: "Maul (Darth Maul, post-Naboo)",
      holderCharacterId: "darth-maul",
      description:
        "The vengeful former Sith who built Crimson Dawn into the most secretive criminal empire in the galaxy after his demotion by Sidious.",
    },
    {
      title: "Lieutenant (Public face)",
      tier: 2,
      holder: "Dryden Vos",
      description:
        "Operational chief who appeared as Crimson Dawn's leader to outsiders. Killed by Qi'ra aboard his yacht.",
    },
    {
      title: "Lady (post-Vos)",
      tier: 2,
      holder: "Qi'ra",
      holderCharacterId: "qira",
      description:
        "Inherited Crimson Dawn from Vos. Schemed during the Galactic Civil War to take down both the Empire and the Hidden Hand — Sidious's secret network.",
    },
    {
      title: "Captain / Enforcer",
      tier: 3,
      description:
        "Lieutenants stationed across syndicate territories, often running individual rackets — smuggling, bounty hunting, weapons trafficking.",
    },
  ],

  // ───────────────────────── Black Sun ─────────────────────────
  "black-sun": [
    {
      title: "Underlord / Prince (Vigo Council Head)",
      tier: 1,
      holder: "Prince Xizor (Legends, pre-Endor); Ziton Moj (Canon, Clone Wars era)",
      description:
        "Supreme leader. In Legends, Xizor was a Falleen prince and Vader's rival. In Canon, leadership rotates between major Vigos.",
    },
    {
      title: "Vigo",
      tier: 2,
      description:
        "One of nine sub-bosses of the Black Sun syndicate, each controlling a region or operation type (slave trade, spice, weapons, assassinations).",
    },
    {
      title: "Lieutenant / Captain",
      tier: 3,
      description:
        "Mid-rank operatives running individual rackets and crews.",
    },
    {
      title: "Soldier / Enforcer",
      tier: 4,
      description:
        "Frontline criminal labor — smugglers, killers, and racketeers.",
    },
  ],

  // ───────────────────────── Nightsisters ─────────────────────────
  "nightsisters": [
    {
      title: "Mother (Clan Matriarch)",
      tier: 1,
      holder: "Mother Talzin",
      holderCharacterId: "mother-talzin",
      description:
        "Spiritual leader and most powerful witch of the Nightsisters on Dathomir. Master of the dark-side Magicks of Dathomir.",
    },
    {
      title: "Spell-Weaver / Witch-Mother",
      tier: 2,
      description:
        "Senior witches who shape the Magicks — spirit ichor rituals, resurrection rites, and combat hexes.",
    },
    {
      title: "Nightsister Warrior",
      tier: 3,
      holder: "Asajj Ventress, Merrin (Survivor era)",
      holderCharacterId: "asajj-ventress",
      description:
        "Combat-trained witches wielding the Magicks in battle. Ventress was sold to Dooku as an assassin but returned to her clan during the Clone Wars.",
    },
    {
      title: "Nightbrother",
      tier: 4,
      holder: "Maul, Savage Opress, Feral",
      description:
        "Male Dathomirian Zabraks — second-class to the witches. Selected by Nightsister mothers as mates, slaves, or sacrificial vessels for ritual transformation.",
    },
    {
      title: "Acolyte (resurrected)",
      tier: 5,
      description:
        "Reanimated Nightsister corpses raised through ichor-driven necromancy after Grievous's massacre of Dathomir.",
    },
  ],

  // ───────────────────────── Bounty Hunters Guild ─────────────────────────
  "bounty-hunters-guild": [
    {
      title: "Guildmaster",
      tier: 1,
      holder: "Greef Karga (Nevarro chapter, Imperial Era)",
      holderCharacterId: "greef-karga",
      description:
        "Leader of a regional Guild chapter. Assigns pucks, settles disputes, enforces Guild Code, and brokers high-value contracts.",
    },
    {
      title: "Chapter Officer / Brotherhood Member",
      tier: 2,
      description:
        "Mid-rank governance — coordinates between chapters, mediates between rival hunters, and represents the Guild to clients like the Empire or Hutts.",
    },
    {
      title: "Master Bounty Hunter",
      tier: 3,
      holder: "Boba Fett, Cad Bane, Embo, Dengar, IG-88, Bossk",
      holderCharacterId: "boba-fett",
      description:
        "Legendary hunters known across the galaxy. Take direct contracts from clients including the Emperor and Darth Vader.",
    },
    {
      title: "Journeyman Hunter",
      tier: 4,
      holder: "Din Djarin (early career)",
      holderCharacterId: "din-djarin",
      description:
        "Active hunter in good standing with the Guild — works pucks for steady pay.",
    },
    {
      title: "Initiate / Apprentice",
      tier: 5,
      description:
        "New hunters proving themselves with minor pucks before earning full Guild standing.",
    },
  ],

  // ───────────────────────── Chiss Ascendancy ─────────────────────────
  "chiss-ascendancy": [
    {
      title: "Aristocra (Ruling Family Member)",
      tier: 1,
      description:
        "Senior members of the Nine Ruling Families (Csapla, Nuruodo, Inrokini, Sabosen, Chaf, Ufsa, Irizi, Plikh, Mitth — though only some are 'in ascendancy' at any given time). Govern the Ascendancy collectively.",
    },
    {
      title: "Syndic",
      tier: 2,
      description:
        "Head of state of a single Ruling Family. Negotiates between families and oversees family operations.",
    },
    {
      title: "Supreme General / Supreme Admiral",
      tier: 2,
      description:
        "Head of the Chiss Expansionary Defense Fleet. Highest military rank.",
    },
    {
      title: "Mid Captain (Senior Captain)",
      tier: 3,
      holder: "Mitth'raw'nuruodo (Thrawn) — early career",
      holderCharacterId: "thrawn",
      description:
        "Senior naval officer — Thrawn rose to this rank before exile and his later Imperial career.",
    },
    {
      title: "Captain / Junior Captain",
      tier: 4,
      description:
        "Standard naval command rank in the Defense Fleet.",
    },
    {
      title: "Sky-walker (Force-sensitive child navigator)",
      tier: 4,
      description:
        "Force-sensitive Chiss girls used as hyperspace navigators in the Chaos. Their abilities fade at puberty. Sacred to the Ascendancy.",
    },
    {
      title: "Commoner / Merit-adoptive",
      tier: 5,
      description:
        "Non-family Chiss who can be merit-adopted into one of the Ruling Families as a 'distant' or 'trial-born' to recognize service.",
    },
  ],

  // ───────────────────────── Knights of Ren ─────────────────────────
  "knights-of-ren": [
    {
      title: "Master of the Knights of Ren",
      tier: 1,
      holder: "Ren (founder); Kylo Ren (Ben Solo)",
      holderCharacterId: "kylo-ren",
      description:
        "Leader of the cult. Wields 'the shadow,' a dark-side energy distinct from the Force as Sith use it. Ben Solo killed the previous Master to take the title.",
    },
    {
      title: "Knight of Ren",
      tier: 2,
      holder: "Ap'lek, Cardo, Kuruk, Trudgen, Ushar, Vicrul",
      description:
        "Six masked warriors who serve the Master. Wield non-lightsaber melee weapons (vibro-cleavers, war-axes, sniper rifles, scythes). Killed on Kef Bir during the Battle of Exegol.",
    },
    {
      title: "Acolyte / Recruit",
      tier: 3,
      description:
        "Former dark-side warriors and disciples drawn into the cult before earning a mask and Knight status.",
    },
  ],

  // ───────────────────────── Imperial Remnants ─────────────────────────
  "imperial-remnants": [
    {
      title: "Shadow Council Member",
      tier: 1,
      description:
        "Secret governing body of Imperial Era warlords in the post-Endor period — Moff Gideon, Brendol Hux, Commandant Hux, Grand Admiral Sloane, Brendol's son Armitage. Met to plan the Imperial restoration.",
    },
    {
      title: "Moff",
      tier: 2,
      holder: "Moff Gideon",
      description:
        "Surviving regional governors who maintained Imperial enclaves. Gideon ran a covert cloning operation aimed at fusing Force-sensitive DNA (Grogu's) with Imperial soldiers.",
    },
    {
      title: "Grand Admiral / Admiral (Remnant Fleet)",
      tier: 2,
      holder: "Grand Admiral Sloane (Operation: Cinder era)",
      description:
        "Senior naval officers commanding the scattered Imperial fleet after Jakku. Many emigrated to the Unknown Regions to seed the First Order.",
    },
    {
      title: "Warlord / Self-Proclaimed Commander",
      tier: 3,
      description:
        "Renegade officers who carved out personal fiefdoms (e.g., Zsinj-style petty empires in Legends; Imperial holdouts on Outer Rim worlds in canon).",
    },
    {
      title: "Dark Trooper",
      tier: 4,
      description:
        "Cybernetically enhanced or pure-droid super-soldiers built by Moff Gideon's program. Used to capture Grogu.",
    },
    {
      title: "Death Trooper",
      tier: 4,
      description:
        "Elite black-armored ISB special forces; some served in remnant operations.",
    },
  ],

  // ───────────────────────── Path of the Open Hand ─────────────────────────
  "path-of-the-open-hand": [
    {
      title: "The Mother",
      tier: 1,
      holder: "Elecia Zeveron (the Mother)",
      description:
        "Charismatic prophet who founded and led the Path. Preached that the Force is corrupted by use; manipulated her followers to trigger the Great Hyperspace Disaster.",
    },
    {
      title: "Herald / Lead Disciple",
      tier: 2,
      holder: "Werth Plouth (the Herald)",
      description:
        "Senior leader who interpreted the Mother's will and managed Path operations across worlds.",
    },
    {
      title: "Path Disciple",
      tier: 3,
      description:
        "Devoted followers — many former Force-sensitives who renounced power. Wore Path robes and lived in religious communes.",
    },
    {
      title: "Convert / Recruit",
      tier: 4,
      description:
        "New members drawn from disillusioned ex-Jedi and trauma survivors during the High Republic Era.",
    },
  ],

  // ───────────────────────── Nihil ─────────────────────────
  "nihil": [
    {
      title: "Eye of the Nihil",
      tier: 1,
      holder: "Marchion Ro",
      description:
        "Supreme leader; sole holder of the Nameless creatures (Levelers) that hunt Jedi. Marchion inherited the role and modernized the Nihil into a Jedi-killing force.",
    },
    {
      title: "Tempest Runner",
      tier: 2,
      holder: "Lourna Dee, Pan Eyta, Zeetar",
      description:
        "Three regional warlords commanding their own 'Tempest' fleets. Operate semi-independently and answer to the Eye.",
    },
    {
      title: "Storm",
      tier: 3,
      description:
        "Mid-rank cell leader under a Tempest Runner. Each Storm commands several raid crews.",
    },
    {
      title: "Cloud",
      tier: 4,
      description:
        "Frontline raider — pilots and ground attackers. The Nihil draw their hierarchy from Hetzal weather metaphors: cloud→storm→tempest→eye.",
    },
    {
      title: "Strikes (small raid units)",
      tier: 5,
      description:
        "Smallest organized unit; conducts smash-and-grab attacks using Path-engine hyperspace jumps.",
    },
  ],

  // ───────────────────────── Yuuzhan Vong ─────────────────────────
  "yuuzhan-vong": [
    {
      title: "Supreme Overlord",
      tier: 1,
      holder: "Shimrra Jamaane",
      description:
        "Theocratic ruler of the entire Yuuzhan Vong civilization. Considered the gods' chosen vessel. Killed by Jacen Solo at the end of the invasion.",
    },
    {
      title: "High Priest / High Prefect",
      tier: 2,
      description:
        "Religious and administrative heads — guide ritual sacrifice, blessing of warriors, and the Vong creed of pain-as-worship.",
    },
    {
      title: "Warmaster",
      tier: 2,
      holder: "Tsavong Lah, Czulkang Lah",
      description:
        "Supreme military commander, equivalent to a Grand Admiral. Tsavong Lah personally led the invasion of the New Republic and was killed at Ebaq 9.",
    },
    {
      title: "Domain Master (Caste Leader)",
      tier: 3,
      description:
        "Each Yuuzhan Vong belongs to a caste/domain: Warrior, Shaper, Priest, Intendant, Worker. Domain Masters lead each caste.",
    },
    {
      title: "Shaper",
      tier: 3,
      description:
        "Biological engineers who design Vong weapons, ships, and creatures — coralskippers, yorik coral vessels, amphistaffs, voxyn (Jedi-hunters).",
    },
    {
      title: "Warrior Caste Officer",
      tier: 4,
      description:
        "Subaltar, Commander, Captain ranks in the warrior caste. Compete for status via duels and self-mutilation.",
    },
    {
      title: "Intendant / Bureaucrat",
      tier: 4,
      description:
        "Manages logistics and civilian governance of occupied territories.",
    },
    {
      title: "Worker / Shamed One",
      tier: 5,
      description:
        "Lowest castes — workers serve everyone above; Shamed Ones are warriors stripped of caste for failure. Many Shamed Ones secretly converted to the Jeedai (Jedi) heresy preached by Vergere.",
    },
  ],
};

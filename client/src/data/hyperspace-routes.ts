/** Named hyperspace lanes that connect planets across the galaxy. */

export interface HyperspaceRoute {
  id: string;
  name: string;
  color: string;
  /** Ordered list of planet IDs along the route. */
  planets: string[];
}

export const HYPERSPACE_ROUTES: HyperspaceRoute[] = [
  {
    id: "corellian-run",
    name: "Corellian Run",
    color: "#4fc3f7",
    planets: ["coruscant", "corellia", "ryloth", "geonosis", "tatooine"],
  },
  {
    id: "perlemian-trade-route",
    name: "Perlemian Trade Route",
    color: "#81d4fa",
    planets: ["coruscant", "chandrila", "alderaan", "kuat", "cato-neimoidia", "hosnian-prime"],
  },
  {
    id: "hydian-way",
    name: "Hydian Way",
    color: "#a5d6a7",
    planets: ["coruscant", "bothawui", "mandalore", "felucia", "sullust"],
  },
  {
    id: "corellian-trade-spine",
    name: "Corellian Trade Spine",
    color: "#ffcc80",
    planets: ["corellia", "kashyyyk", "kessel", "bespin", "hoth"],
  },
  {
    id: "rimma-trade-route",
    name: "Rimma Trade Route",
    color: "#f48fb1",
    planets: ["chandrila", "naboo", "sullust", "scarif"],
  },
  {
    id: "mid-rim-trade",
    name: "Mid Rim Trade Route",
    color: "#ce93d8",
    planets: ["naboo", "geonosis", "kamino", "lothal", "vandor"],
  },
  {
    id: "mandalore-passage",
    name: "Mandalore Passage",
    color: "#90a4ae",
    planets: ["mandalore", "concordia", "dathomir", "nevarro", "sorgan"],
  },
  {
    id: "sith-worlds",
    name: "Sith Worlds",
    color: "#ef5350",
    planets: ["korriban", "dromund-kaas", "ziost", "mustafar", "exegol"],
  },
  {
    id: "jedi-path",
    name: "Jedi Path",
    color: "#7986cb",
    planets: ["coruscant", "dagobah", "ahch-to", "tython", "jedha", "ilum"],
  },
  {
    id: "unknown-regions",
    name: "Unknown Regions",
    color: "#546e7a",
    planets: ["ilum", "exegol", "mortis", "lehon", "bastion"],
  },
  {
    id: "rebellion-supply-lines",
    name: "Rebellion Supply Lines",
    color: "#fff176",
    planets: ["yavin-4", "hoth", "dagobah", "endor", "mon-cala"],
  },
  {
    id: "resistance-route",
    name: "Resistance Route",
    color: "#ff8a65",
    planets: ["d-qar", "crait", "ahch-to", "kijimi", "pasaana", "exegol"],
  },
  {
    id: "outer-rim-crossroads",
    name: "Outer Rim Crossroads",
    color: "#ffb74d",
    planets: ["tatooine", "jakku", "ord-mantell", "cantonica", "takodana"],
  },
  {
    id: "outer-rim-research-corridor",
    name: "Outer Rim Research Corridor",
    color: "#80cbc4",
    planets: ["polis-massa", "pillio", "eadu", "bakura"],
  },
];

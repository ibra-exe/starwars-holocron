import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { PageHeader } from "@/components/shared/Badges";
import { FACTIONS } from "@/data/factions";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#1b1f2c",
    primaryTextColor: "#ecd7a6",
    primaryBorderColor: "#3a3a4a",
    lineColor: "#7a7a8a",
    secondaryColor: "#252734",
    tertiaryColor: "#1a1c26",
    fontFamily: "Inter, sans-serif",
  },
  flowchart: { curve: "basis", htmlLabels: true },
  securityLevel: "loose",
});

const VIZ = [
  {
    id: "skywalker-tree",
    title: "The Skywalker Bloodline",
    description: "From Shmi Skywalker to Ben Solo — the family at the heart of the saga.",
    type: "mermaid" as const,
    code: `flowchart TD
  shmi["Shmi Skywalker"]
  anakin["Anakin Skywalker<br/>(Darth Vader)"]
  padme["Padmé Amidala"]
  luke["Luke Skywalker"]
  leia["Leia Organa"]
  han["Han Solo"]
  ben["Ben Solo<br/>(Kylo Ren)"]
  rey["Rey<br/>(adopted as Skywalker)"]
  shmi --> anakin
  anakin -. married .- padme
  anakin --> luke
  anakin --> leia
  padme --> luke
  padme --> leia
  leia -. married .- han
  leia --> ben
  han --> ben
  luke -. trained .-> rey
  ben -. dyad .- rey
  classDef sith fill:#3a1417,stroke:#c0392b,color:#fbd1c8
  classDef jedi fill:#14253a,stroke:#3498db,color:#cfe6ff
  class anakin sith
  class luke,leia,rey jedi`,
  },
  {
    id: "palpatine-line",
    title: "The Palpatine Line",
    description: "Sheev Palpatine's secret bloodline — Dathomir, Exegol, and the dyad.",
    type: "mermaid" as const,
    code: `flowchart TD
  palp["Sheev Palpatine<br/>(Darth Sidious)"]
  clone["Strand-cast son<br/>(failed clone, force-null)"]
  miramir["Miramir of Jakku"]
  rey["Rey Skywalker"]
  palp --> clone
  clone -. married .- miramir
  clone --> rey
  classDef sith fill:#3a1417,stroke:#c0392b,color:#fbd1c8
  classDef jedi fill:#14253a,stroke:#3498db,color:#cfe6ff
  class palp,clone sith
  class rey jedi`,
  },
  {
    id: "jedi-lineage",
    title: "Jedi Master Lineage",
    description: "The unbroken chain of training from Yoda to Rey — light side.",
    type: "mermaid" as const,
    code: `flowchart LR
  yoda["Yoda"]
  dooku["Dooku<br/>(later Sith)"]
  qui["Qui-Gon Jinn"]
  obi["Obi-Wan Kenobi"]
  anakin["Anakin Skywalker"]
  ahsoka["Ahsoka Tano"]
  luke["Luke Skywalker"]
  ben["Ben Solo"]
  rey["Rey"]
  yoda --> dooku
  dooku --> qui
  qui --> obi
  obi --> anakin
  anakin --> ahsoka
  yoda --> luke
  obi --> luke
  luke --> ben
  luke --> rey
  classDef sith fill:#3a1417,stroke:#c0392b,color:#fbd1c8
  classDef jedi fill:#14253a,stroke:#3498db,color:#cfe6ff
  class dooku sith
  class yoda,qui,obi,anakin,ahsoka,luke,rey,ben jedi`,
  },
  {
    id: "sith-lineage",
    title: "Sith Lineage (Rule of Two)",
    description: "From Darth Bane through Sidious, Vader, and the resurrected emperor.",
    type: "mermaid" as const,
    code: `flowchart LR
  bane["Darth Bane<br/>(founder, Rule of Two)"]
  zannah["Darth Zannah"]
  cog["Darth Cognus"]
  multi["…centuries of secrecy…"]
  plagueis["Darth Plagueis"]
  sidious["Darth Sidious<br/>(Palpatine)"]
  maul["Darth Maul"]
  tyranus["Darth Tyranus<br/>(Dooku)"]
  vader["Darth Vader<br/>(Anakin)"]
  bane --> zannah --> cog --> multi --> plagueis --> sidious
  sidious --> maul
  sidious --> tyranus
  sidious --> vader
  classDef sith fill:#3a1417,stroke:#c0392b,color:#fbd1c8
  class bane,zannah,cog,plagueis,sidious,maul,tyranus,vader sith`,
  },
  {
    id: "war-chart",
    title: "Major Wars of the Galaxy",
    description: "A chronological flow of every major conflict.",
    type: "mermaid" as const,
    code: `flowchart TB
  fw["Force Wars<br/>~25,000 BBY"]
  gsw["Great Sith War<br/>~3996 BBY"]
  mw["Mandalorian Wars<br/>~3976 BBY"]
  jcw["Jedi Civil War<br/>~3959 BBY"]
  ggw["Great Galactic War<br/>~3681 BBY"]
  nsw["New Sith Wars<br/>~2000-1000 BBY"]
  ni["Nihil Incursion<br/>~232 BBY"]
  nw["Naboo Crisis<br/>32 BBY"]
  cw["Clone Wars<br/>22-19 BBY"]
  gcw["Galactic Civil War<br/>0 BBY - 4 ABY"]
  yvw["Yuuzhan Vong War<br/>25-29 ABY (Legends)"]
  forw["First Order/Resistance War<br/>34-35 ABY"]
  fw --> gsw --> mw --> jcw --> ggw --> nsw --> ni --> nw --> cw --> gcw --> yvw --> forw`,
  },
];

function MermaidDiagram({ id, code }: { id: string; code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const uniqueId = `${id}-${Math.random().toString(36).slice(2, 8)}`;
    mermaid
      .render(uniqueId, code)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch((err) => {
        if (ref.current)
          ref.current.innerHTML = `<pre class="text-xs text-destructive">${String(err)}</pre>`;
      });
  }, [id, code]);
  return <div ref={ref} className="w-full overflow-x-auto py-4" />;
}

function FactionRelationshipGraph() {
  // Compact custom SVG graph using force-directed layout precomputed
  const nodes = FACTIONS.slice(0, 14).map((f, i) => ({
    id: f.id,
    name: f.shortName || f.name,
    color: f.color,
    alignment: f.alignment,
  }));
  // Arrange nodes around a circle
  const cx = 400;
  const cy = 280;
  const r = 220;
  const positioned = nodes.map((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  // Edges: from FACTIONS.enemies & allies
  const edges: { from: string; to: string; kind: "enemy" | "ally" }[] = [];
  for (const f of FACTIONS.slice(0, 14)) {
    for (const e of f.enemies) {
      if (positioned.find((n) => n.id === e) && !edges.find((x) => (x.from === e && x.to === f.id))) {
        edges.push({ from: f.id, to: e, kind: "enemy" });
      }
    }
    for (const a of f.allies) {
      if (positioned.find((n) => n.id === a) && !edges.find((x) => (x.from === a && x.to === f.id))) {
        edges.push({ from: f.id, to: a, kind: "ally" });
      }
    }
  }

  const pos = Object.fromEntries(positioned.map((n) => [n.id, n]));

  return (
    <div className="w-full overflow-x-auto py-4">
      <svg viewBox="0 0 800 560" className="w-full max-w-3xl mx-auto block">
        {edges.map((e, i) => {
          const a = pos[e.from];
          const b = pos[e.to];
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={e.kind === "enemy" ? "rgba(220,80,80,0.4)" : "rgba(80,160,255,0.35)"}
              strokeWidth={e.kind === "enemy" ? 1.5 : 1}
              strokeDasharray={e.kind === "ally" ? "4 4" : "none"}
            />
          );
        })}
        {positioned.map((n) => (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <circle r="34" fill={n.color} fillOpacity="0.18" stroke={n.color} strokeWidth="1.5" />
            <text
              y="4"
              textAnchor="middle"
              fontSize="10"
              fill="#ecd7a6"
              fontFamily="Inter"
              fontWeight="500"
            >
              {n.name.length > 14 ? n.name.slice(0, 13) + "…" : n.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex gap-4 justify-center text-xs text-muted-foreground mt-2 font-display tracking-widest uppercase">
        <span><span className="inline-block w-4 h-px align-middle bg-[hsl(var(--sith)/0.7)] mr-1" /> Enemies</span>
        <span><span className="inline-block w-4 h-px align-middle border-t border-dashed border-[hsl(var(--jedi)/0.7)] mr-1" /> Allies</span>
      </div>
    </div>
  );
}

export default function VisualizationsPage() {
  const [active, setActive] = useState(VIZ[0].id);
  const all = [...VIZ, { id: "faction-graph", title: "Faction Relationship Graph", description: "Allies (dashed) and enemies (solid) between every major faction.", type: "svg" as const, code: "" }];
  const current = all.find((v) => v.id === active)!;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Maps"
        title="Visualizations"
        description="Interactive diagrams of bloodlines, master/apprentice chains, faction relationships, and major wars."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {all.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest font-display rounded-md border ${
              active === v.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`button-viz-${v.id}`}
          >
            {v.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl mb-1">{current.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{current.description}</p>
        {current.type === "mermaid" ? (
          <MermaidDiagram id={current.id} code={current.code} />
        ) : (
          <FactionRelationshipGraph />
        )}
      </div>
    </div>
  );
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// @ts-ignore – react-force-graph-3d ships its own types
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { PLANETS, findPlanet } from "@/data/planets";
import { FACTIONS } from "@/data/factions";
import { HYPERSPACE_ROUTES } from "@/data/hyperspace-routes";
import { DrawerPortal } from "@/components/shared/DrawerPortal";
import DrawerSection from "@/components/shared/DrawerSection";
import { ContinuityBadge, ImportanceBar } from "@/components/shared/Badges";
import { Link } from "wouter";
import { RotateCcw, Search, X } from "lucide-react";

// ─── Color maps ──────────────────────────────────────────────────────────────

const REGION_COLORS: Record<string, string> = {
  "Core World": "#4fc3f7",
  "Deep Core": "#ffd54f",
  Colonies: "#81d4fa",
  "Inner Rim": "#a5d6a7",
  "Expansion Region": "#80cbc4",
  "Mid Rim": "#ffb74d",
  "Outer Rim": "#ef9a9a",
  "Hutt Space": "#ce93d8",
  "Wild Space": "#b0bec5",
  "Unknown Regions": "#78909c",
};

const IMPORTANCE_COLORS: Record<number, string> = {
  1: "#607d8b",
  2: "#2196f3",
  3: "#4caf50",
  4: "#ff9800",
  5: "#ff5252",
};

type ColorMode = "region" | "faction" | "importance";
type EdgeMode = "none" | "faction" | "hyperspace";

// ─── Legend data ─────────────────────────────────────────────────────────────

const REGION_LEGEND = Object.entries(REGION_COLORS);
const IMPORTANCE_LEGEND: [string, string][] = [
  ["Iconic", "#ff5252"],
  ["Major", "#ff9800"],
  ["Significant", "#4caf50"],
  ["Notable", "#2196f3"],
  ["Minor", "#607d8b"],
];

// ─── Graph node/link types ────────────────────────────────────────────────────

interface GNode {
  id: string;
  name: string;
  val: number;
  color: string;
  classification: string;
  importance: number;
  // force-graph adds these at runtime:
  x?: number;
  y?: number;
  z?: number;
}

interface GLink {
  source: string | GNode;
  target: string | GNode;
  color: string;
  label?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNodeColor(planetId: string, mode: ColorMode): string {
  const p = findPlanet(planetId);
  if (!p) return "#555";
  if (mode === "region") return REGION_COLORS[p.classification] ?? "#888";
  if (mode === "importance") return IMPORTANCE_COLORS[p.importance] ?? "#888";
  // faction – use dominant (first) affiliation
  if (p.affiliations.length > 0) {
    const fid = p.affiliations[0].faction;
    const faction = FACTIONS.find((f) => f.id === fid);
    if (faction?.color) return faction.color;
  }
  return "#888";
}

const PLANET_IDS = new Set(PLANETS.map((p) => p.id));

// ─── Component ────────────────────────────────────────────────────────────────

export default function GalaxyPage() {
  const [colorMode, setColorMode] = useState<ColorMode>("region");
  const [edgeMode, setEdgeMode] = useState<EdgeMode>("hyperspace");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [graphW, setGraphW] = useState(800);
  const [graphH, setGraphH] = useState(600);

  // Measure container
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setGraphW(e.contentRect.width);
        setGraphH(e.contentRect.height);
      }
    });
    ro.observe(el);
    setGraphW(el.clientWidth);
    setGraphH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  // Nodes
  const nodes = useMemo<GNode[]>(() => {
    return PLANETS.map((p) => ({
      id: p.id,
      name: p.name,
      val: p.importance * 1.6,
      color: getNodeColor(p.id, colorMode),
      classification: p.classification,
      importance: p.importance,
    }));
  }, [colorMode]);

  // Links
  const links = useMemo<GLink[]>(() => {
    if (edgeMode === "none") return [];

    if (edgeMode === "hyperspace") {
      return HYPERSPACE_ROUTES.flatMap((route) => {
        const valid = route.planets.filter((id) => PLANET_IDS.has(id));
        return valid.slice(0, -1).map((id, i) => ({
          source: id,
          target: valid[i + 1],
          color: route.color,
          label: route.name,
        }));
      });
    }

    // Faction mode: chain planets that share a faction
    const byFaction = new Map<string, string[]>();
    PLANETS.forEach((p) => {
      p.affiliations.forEach((a) => {
        const k = a.faction;
        if (!byFaction.has(k)) byFaction.set(k, []);
        byFaction.get(k)!.push(p.id);
      });
    });
    const out: GLink[] = [];
    byFaction.forEach((pids, fid) => {
      if (pids.length < 2) return;
      const faction = FACTIONS.find((f) => f.id === fid);
      const color = faction?.color ?? "#444";
      const sorted = [...pids].sort(
        (a, b) =>
          (findPlanet(b)?.importance ?? 0) - (findPlanet(a)?.importance ?? 0),
      );
      // cap at 5 edges per faction to avoid visual clutter
      for (let i = 0; i < Math.min(sorted.length - 1, 5); i++) {
        out.push({ source: sorted[i], target: sorted[i + 1], color, label: faction?.name });
      }
    });
    return out;
  }, [edgeMode]);

  // Search highlight set
  const highlightIds = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return new Set(
      PLANETS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q),
      ).map((p) => p.id),
    );
  }, [search]);

  // Custom Three.js node: glowing sphere
  const nodeThreeObject = (node: any) => {
    const group = new THREE.Group();
    const highlighted = !highlightIds || highlightIds.has(node.id as string);
    const col = new THREE.Color(node.color as string);
    const r = Math.cbrt(node.val as number) * 1.4;

    // Core
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(r, 14, 14),
      new THREE.MeshBasicMaterial({
        color: col,
        transparent: !highlighted,
        opacity: highlighted ? 1 : 0.12,
      }),
    );
    group.add(core);

    // Glow halo (only for highlighted nodes)
    if (highlighted) {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(r * 2.6, 14, 14),
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.07,
          depthWrite: false,
        }),
      );
      group.add(halo);
    }

    return group;
  };

  const selected = selectedId ? findPlanet(selectedId) : null;

  const resetView = () => {
    graphRef.current?.zoomToFit(600, 60);
  };

  // Reset camera on mount once graph cools
  useEffect(() => {
    const t = setTimeout(() => resetView(), 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Legend content ──────────────────────────────────────────────────────
  const legendItems: [string, string][] =
    colorMode === "region"
      ? REGION_LEGEND
      : colorMode === "importance"
        ? IMPORTANCE_LEGEND
        : FACTIONS.slice(0, 12).map((f) => [f.shortName ?? f.name, f.color]);

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100dvh" }}>
      {/* ── Controls bar ── */}
      <div className="shrink-0 z-20 px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center border-b border-border bg-black/70 backdrop-blur-md">
        <span className="font-display text-[11px] uppercase tracking-[0.28em] text-primary mr-1">
          Galaxy Map
        </span>

        {/* Color mode */}
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest font-display hidden sm:inline">Color</span>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="region">By Region</option>
            <option value="faction">By Faction</option>
            <option value="importance">By Importance</option>
          </select>
        </label>

        {/* Edge mode */}
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest font-display hidden sm:inline">Edges</span>
          <select
            value={edgeMode}
            onChange={(e) => setEdgeMode(e.target.value as EdgeMode)}
            className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="hyperspace">Hyperspace Routes</option>
            <option value="faction">Faction Connections</option>
            <option value="none">No Edges</option>
          </select>
        </label>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Highlight planet…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md bg-input border border-border text-sm w-44 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowLegend((v) => !v)}
            className="px-3 py-1.5 rounded-md text-xs font-display uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            {showLegend ? "Hide" : "Show"} Legend
          </button>
          <button
            onClick={resetView}
            title="Reset camera"
            className="px-2 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Graph canvas ── */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {graphW > 0 && graphH > 0 && (
          <ForceGraph3D
            ref={graphRef}
            graphData={{ nodes, links }}
            width={graphW}
            height={graphH}
            backgroundColor="#00001a"
            nodeId="id"
            nodeLabel="name"
            nodeThreeObject={nodeThreeObject}
            nodeThreeObjectExtend={false}
            linkColor={(link: any) => link.color ?? "#334"}
            linkWidth={0.8}
            linkOpacity={0.55}
            linkDirectionalParticles={edgeMode === "hyperspace" ? 2 : 0}
            linkDirectionalParticleWidth={1.2}
            linkDirectionalParticleColor={(link: any) => link.color ?? "#fff"}
            onNodeClick={(node: any) => setSelectedId(node.id as string)}
            cooldownTicks={150}
            d3AlphaDecay={0.015}
            d3VelocityDecay={0.25}
          />
        )}

        {/* Legend overlay */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-border bg-black/70 backdrop-blur-md p-3 max-w-[200px]">
            <div className="text-[9px] uppercase tracking-[0.28em] text-primary font-display mb-2">
              {colorMode === "region"
                ? "Galactic Region"
                : colorMode === "faction"
                  ? "Faction"
                  : "Importance"}
            </div>
            <div className="space-y-1">
              {legendItems.map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  <span className="text-[10px] text-foreground/75 truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Planet count */}
        <div className="absolute top-3 right-4 z-10 text-[10px] font-display uppercase tracking-widest text-muted-foreground">
          {PLANETS.length} planets · {links.length} connections
        </div>
      </div>

      {/* ── Detail drawer ── */}
      {selected && (
        <DrawerPortal>
          <div
            className="fixed inset-0 z-50 flex"
            onClick={() => setSelectedId(null)}
            data-testid="galaxy-detail-overlay"
          >
            <div className="flex-1 bg-background/40 backdrop-blur-sm" />
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-sm bg-card border-l border-border overflow-y-auto overscroll-y-contain"
            >
              <div className="p-5" style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-display">
                    {selected.classification}
                  </span>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="font-display text-xl text-foreground mb-1">{selected.name}</h2>
                <div className="text-[10px] uppercase tracking-widest text-primary font-display mb-3">
                  {selected.region} · {selected.system ?? selected.sector ?? ""}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <ContinuityBadge value={selected.continuity} />
                  <ImportanceBar value={selected.importance} />
                </div>

                {selected.imageUrl && (
                  <div className="rounded-lg overflow-hidden mb-4 border border-border">
                    <img
                      src={selected.imageUrl}
                      alt={selected.name}
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}

                <p className="text-xs text-foreground/80 leading-relaxed mb-4">
                  {selected.loreSignificance}
                </p>

                {selected.affiliations.length > 0 && (
                  <DrawerSection title="Affiliations">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.affiliations.slice(0, 6).map((a) => (
                        <span
                          key={a.faction + (a.era ?? "")}
                          className="px-2 py-0.5 rounded-full text-[10px] border border-border text-muted-foreground"
                        >
                          {FACTIONS.find((f) => f.id === a.faction)?.shortName ??
                            a.faction}
                        </span>
                      ))}
                    </div>
                  </DrawerSection>
                )}

                <div className="mt-5 pt-4 border-t border-border">
                  <Link
                    href={`/planets#${selected.id}`}
                    className="block w-full text-center py-2 rounded-md border border-primary text-primary text-xs font-display uppercase tracking-widest hover:bg-primary/10 transition-colors"
                  >
                    Full Entry →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </DrawerPortal>
      )}
    </div>
  );
}

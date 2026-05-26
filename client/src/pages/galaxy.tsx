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

// ─── Texture cache (module-level so it persists across re-renders) ──────────

const _texLoader = new THREE.TextureLoader();
const _texCache = new Map<string, THREE.Texture>();

function getTexture(url: string): THREE.Texture {
  if (!_texCache.has(url)) {
    const tex = _texLoader.load(url);
    try {
      // r152+ uses colorSpace; older uses encoding — handle gracefully
      (tex as any).colorSpace = (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding;
    } catch (_) {/* ignore */}
    _texCache.set(url, tex);
  }
  return _texCache.get(url)!;
}

// ─── Space background helpers ────────────────────────────────────────────────

/** Populate the Three.js scene with stars and a Milky Way band. */
function addSpaceBackground(scene: THREE.Scene) {
  // ── Stars ──
  const STAR_PALETTE: [number, number, number][] = [
    [1.0, 1.0, 1.0],   // white ×3
    [1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0],
    [0.75, 0.85, 1.0], // blue-white ×2
    [0.75, 0.85, 1.0],
    [1.0, 0.95, 0.78], // yellow-white
    [1.0, 0.80, 0.65], // orange-red
    [0.55, 0.65, 1.0], // blue
  ];
  const starCount = 9000;
  const sPos = new Float32Array(starCount * 3);
  const sCol = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const rad   = 1200 + Math.random() * 800;
    sPos[i * 3]     = rad * Math.sin(phi) * Math.cos(theta);
    sPos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
    sPos[i * 3 + 2] = rad * Math.cos(phi);
    const c = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
    sCol[i * 3]     = c[0];
    sCol[i * 3 + 1] = c[1];
    sCol[i * 3 + 2] = c[2];
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute("color",    new THREE.BufferAttribute(sCol, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ size: 1.9, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true }),
    ),
  );

  // ── Milky Way band (dense star disc) ──
  const mwCount = 5000;
  const mPos = new Float32Array(mwCount * 3);
  for (let i = 0; i < mwCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r     = 1350 + Math.random() * 450;
    mPos[i * 3]     = r * Math.cos(theta);
    mPos[i * 3 + 1] = (Math.random() - 0.5) * r * 0.38; // flatten into disc
    mPos[i * 3 + 2] = r * Math.sin(theta);
  }
  const mwGeo = new THREE.BufferGeometry();
  mwGeo.setAttribute("position", new THREE.BufferAttribute(mPos, 3));
  scene.add(
    new THREE.Points(
      mwGeo,
      new THREE.PointsMaterial({ color: 0xccddf8, size: 1.1, transparent: true, opacity: 0.35, sizeAttenuation: true }),
    ),
  );

}

// ─── Color maps ──────────────────────────────────────────────────────────────

const REGION_COLORS: Record<string, string> = {
  "Core World":        "#4fc3f7",
  "Deep Core":         "#ffd54f",
  Colonies:            "#81d4fa",
  "Inner Rim":         "#a5d6a7",
  "Expansion Region":  "#80cbc4",
  "Mid Rim":           "#ffb74d",
  "Outer Rim":         "#ef9a9a",
  "Hutt Space":        "#ce93d8",
  "Wild Space":        "#b0bec5",
  "Unknown Regions":   "#78909c",
};

const IMPORTANCE_COLORS: Record<number, string> = {
  1: "#607d8b",
  2: "#2196f3",
  3: "#4caf50",
  4: "#ff9800",
  5: "#ff5252",
};

type ColorMode = "region" | "faction" | "importance";
type EdgeMode  = "none" | "faction" | "hyperspace";

const REGION_LEGEND     = Object.entries(REGION_COLORS);
const IMPORTANCE_LEGEND: [string, string][] = [
  ["Iconic",       "#ff5252"],
  ["Major",        "#ff9800"],
  ["Significant",  "#4caf50"],
  ["Notable",      "#2196f3"],
  ["Minor",        "#607d8b"],
];

// ─── Graph types ─────────────────────────────────────────────────────────────

interface GNode {
  id: string; name: string; val: number; color: string;
  classification: string; importance: number; imageUrl?: string;
  x?: number; y?: number; z?: number;
}
interface GLink {
  source: string | GNode; target: string | GNode;
  color: string; label?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNodeColor(planetId: string, mode: ColorMode): string {
  const p = findPlanet(planetId);
  if (!p) return "#555";
  if (mode === "region")     return REGION_COLORS[p.classification] ?? "#888";
  if (mode === "importance") return IMPORTANCE_COLORS[p.importance] ?? "#888";
  if (p.affiliations.length > 0) {
    const f = FACTIONS.find((f) => f.id === p.affiliations[0].faction);
    if (f?.color) return f.color;
  }
  return "#888";
}

const PLANET_IDS = new Set(PLANETS.map((p) => p.id));

// LOD switch distance: below → textured sphere; above → colored glow
const LOD_THRESHOLD = 180;

// ─── Component ───────────────────────────────────────────────────────────────

export default function GalaxyPage() {
  const [colorMode,   setColorMode]   = useState<ColorMode>("region");
  const [edgeMode,    setEdgeMode]    = useState<EdgeMode>("hyperspace");
  const [search,      setSearch]      = useState("");
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [showLegend,  setShowLegend]  = useState(true);

  const containerRef      = useRef<HTMLDivElement>(null);
  const graphRef          = useRef<any>(null);
  const bgAddedRef        = useRef(false);
  const [graphW, setGraphW] = useState(0);
  const [graphH, setGraphH] = useState(0);

  // Measure container via ResizeObserver
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

  // Add space background once the graph canvas is ready
  useEffect(() => {
    if (graphW === 0 || graphH === 0 || bgAddedRef.current) return;
    const t = setTimeout(() => {
      const scene: THREE.Scene | undefined = graphRef.current?.scene?.();
      if (!scene) return;
      bgAddedRef.current = true;
      addSpaceBackground(scene);
    }, 250);
    return () => clearTimeout(t);
  }, [graphW, graphH]);

  // Auto-fit camera after simulation cools
  useEffect(() => {
    const t = setTimeout(() => graphRef.current?.zoomToFit?.(700, 80), 2500);
    return () => clearTimeout(t);
  }, []);

  // ─── Graph data ─────────────────────────────────────────────────────────

  const nodes = useMemo<GNode[]>(() =>
    PLANETS.map((p) => ({
      id: p.id, name: p.name,
      val: p.importance * 1.6,
      color: getNodeColor(p.id, colorMode),
      classification: p.classification,
      importance: p.importance,
      imageUrl: p.imageUrl,
    })),
    [colorMode],
  );

  const links = useMemo<GLink[]>(() => {
    if (edgeMode === "none") return [];

    if (edgeMode === "hyperspace") {
      return HYPERSPACE_ROUTES.flatMap((route) => {
        const valid = route.planets.filter((id) => PLANET_IDS.has(id));
        return valid.slice(0, -1).map((id, i) => ({
          source: id, target: valid[i + 1],
          color: route.color, label: route.name,
        }));
      });
    }

    // Faction: chain planets that share a faction
    const byFaction = new Map<string, string[]>();
    PLANETS.forEach((p) =>
      p.affiliations.forEach((a) => {
        if (!byFaction.has(a.faction)) byFaction.set(a.faction, []);
        byFaction.get(a.faction)!.push(p.id);
      }),
    );
    const out: GLink[] = [];
    byFaction.forEach((pids, fid) => {
      if (pids.length < 2) return;
      const faction = FACTIONS.find((f) => f.id === fid);
      const color   = faction?.color ?? "#444";
      const sorted  = [...pids].sort(
        (a, b) => (findPlanet(b)?.importance ?? 0) - (findPlanet(a)?.importance ?? 0),
      );
      for (let i = 0; i < Math.min(sorted.length - 1, 5); i++) {
        out.push({ source: sorted[i], target: sorted[i + 1], color, label: faction?.name });
      }
    });
    return out;
  }, [edgeMode]);

  // ─── Search highlight ────────────────────────────────────────────────────

  const highlightIds = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return new Set(
      PLANETS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      ).map((p) => p.id),
    );
  }, [search]);

  // ─── Custom Three.js node: LOD sphere ───────────────────────────────────
  //   • Close  (< LOD_THRESHOLD units): textured planet image on a sphere
  //   • Far    (≥ LOD_THRESHOLD units): colored glow dot

  const nodeThreeObject = (node: any) => {
    const highlighted = !highlightIds || highlightIds.has(node.id as string);
    const col = new THREE.Color(node.color as string);
    const r   = Math.cbrt(node.val as number) * 1.4;
    const url = node.imageUrl as string | undefined;

    const lod = new THREE.LOD();

    // ── Close level: textured sphere ──
    if (url) {
      const tex  = getTexture(url);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r * 1.5, 32, 32),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: !highlighted,
          opacity: highlighted ? 1 : 0.15,
        }),
      );
      lod.addLevel(mesh, 0);
    }

    // ── Far level: colored glow sphere (always present as fallback) ──
    const farGroup = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(r, 14, 14),
      new THREE.MeshBasicMaterial({ color: col, transparent: !highlighted, opacity: highlighted ? 1 : 0.12 }),
    );
    farGroup.add(core);
    if (highlighted) {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(r * 2.6, 14, 14),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, depthWrite: false }),
      );
      farGroup.add(halo);
    }
    lod.addLevel(farGroup, url ? LOD_THRESHOLD : 0);

    return lod;
  };

  // ─── Legend ──────────────────────────────────────────────────────────────

  const legendItems: [string, string][] =
    colorMode === "region"     ? REGION_LEGEND :
    colorMode === "importance" ? IMPORTANCE_LEGEND :
    FACTIONS.slice(0, 12).map((f) => [f.shortName ?? f.name, f.color]);

  const selected = selectedId ? findPlanet(selectedId) : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100dvh" }}>

      {/* ── Controls bar ── */}
      <div className="shrink-0 z-20 px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center border-b border-border bg-black/75 backdrop-blur-md">
        <span className="font-display text-[11px] uppercase tracking-[0.28em] text-primary mr-1 hidden sm:inline">
          Galaxy Map
        </span>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest font-display hidden md:inline">Color</span>
          <select value={colorMode} onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="region">By Region</option>
            <option value="faction">By Faction</option>
            <option value="importance">By Importance</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest font-display hidden md:inline">Edges</span>
          <select value={edgeMode} onChange={(e) => setEdgeMode(e.target.value as EdgeMode)}
            className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="hyperspace">Hyperspace Routes</option>
            <option value="faction">Faction Connections</option>
            <option value="none">No Edges</option>
          </select>
        </label>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="search" placeholder="Highlight planet…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md bg-input border border-border text-sm w-40 focus:border-primary focus:outline-none" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground hidden sm:inline">
            {PLANETS.length} planets · {links.length} links
          </span>
          <button onClick={() => setShowLegend((v) => !v)}
            className="px-2.5 py-1.5 rounded-md text-[11px] font-display uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            {showLegend ? "Hide" : "Legend"}
          </button>
          <button onClick={() => graphRef.current?.zoomToFit?.(500, 60)} title="Reset camera"
            className="px-2 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 3D canvas ── */}
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
            linkOpacity={0.5}
            linkDirectionalParticles={edgeMode === "hyperspace" ? 2 : 0}
            linkDirectionalParticleWidth={1.2}
            linkDirectionalParticleColor={(link: any) => link.color ?? "#aaf"}
            onNodeClick={(node: any) => setSelectedId(node.id as string)}
            cooldownTicks={160}
            d3AlphaDecay={0.015}
            d3VelocityDecay={0.25}
          />
        )}

        {/* LOD hint badge – fades after first view */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full border border-border bg-black/60 backdrop-blur-sm text-[10px] font-display uppercase tracking-widest text-muted-foreground pointer-events-none select-none">
          Zoom in on a planet to see its surface
        </div>

        {/* Legend overlay */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-border bg-black/70 backdrop-blur-md p-3 max-w-[190px]">
            <div className="text-[9px] uppercase tracking-[0.28em] text-primary font-display mb-2">
              {colorMode === "region" ? "Galactic Region" : colorMode === "faction" ? "Faction" : "Importance"}
            </div>
            <div className="space-y-1">
              {legendItems.map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                  <span className="text-[10px] text-foreground/75 truncate">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border text-[9px] text-muted-foreground/50 font-mono">
              Zoom in to reveal planet textures
            </div>
          </div>
        )}
      </div>

      {/* ── Planet detail drawer ── */}
      {selected && (
        <DrawerPortal>
          <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedId(null)}>
            <div className="flex-1 bg-background/40 backdrop-blur-sm" />
            <div onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-sm bg-card border-l border-border overflow-y-auto overscroll-y-contain">
              <div className="p-5" style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-display">
                    {selected.classification}
                  </span>
                  <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="font-display text-xl text-foreground mb-1">{selected.name}</h2>
                <div className="text-[10px] uppercase tracking-widest text-primary font-display mb-3">
                  {selected.region}{selected.system ? ` · ${selected.system}` : ""}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <ContinuityBadge value={selected.continuity} />
                  <ImportanceBar value={selected.importance} />
                </div>
                {selected.imageUrl && (
                  <div className="rounded-lg overflow-hidden mb-4 border border-border">
                    <img src={selected.imageUrl} alt={selected.name}
                      className="w-full h-36 object-cover" />
                  </div>
                )}
                <p className="text-xs text-foreground/80 leading-relaxed mb-4">
                  {selected.loreSignificance}
                </p>
                {selected.affiliations.length > 0 && (
                  <DrawerSection title="Affiliations">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.affiliations.slice(0, 6).map((a) => (
                        <span key={a.faction + (a.era ?? "")}
                          className="px-2 py-0.5 rounded-full text-[10px] border border-border text-muted-foreground">
                          {FACTIONS.find((f) => f.id === a.faction)?.shortName ?? a.faction}
                        </span>
                      ))}
                    </div>
                  </DrawerSection>
                )}
                <div className="mt-5 pt-4 border-t border-border">
                  <Link href={`/planets#${selected.id}`}
                    className="block w-full text-center py-2 rounded-md border border-primary text-primary text-xs font-display uppercase tracking-widest hover:bg-primary/10 transition-colors">
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

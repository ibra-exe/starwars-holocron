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
import { setPendingAnchor } from "@/lib/useHashAnchor";
import { RotateCcw, Search, X } from "lucide-react";

// ─── Canonical galaxy coordinates (x, z) ──────────────────────────────────
// Approximate positions on the Star Wars galaxy map. Galaxy is laid flat in
// the XZ plane; Y is added as a thin disc variance via strHash.
// Scale: ~±330 units → galaxy diameter ≈ 660 units.

const GALAXY_POS: Record<string, [number, number]> = {
  // ── Deep Core ──
  coruscant:         [    0,    0],
  tython:            [  -15,   18],
  mortis:            [    5,  -10], // Force nexus — placed near centre
  // ── Core Worlds ──
  corellia:          [  -55,  -45],
  alderaan:          [  -40,  -70],
  kuat:              [  -55,   35],
  chandrila:         [   25,   55],
  "hosnian-prime":   [  -30,   55],
  // ── Colonies ──
  "cato-neimoidia":  [   90,   50],
  "ord-mantell":     [  110,   40],
  // ── Inner Rim ──
  jedha:             [ -100,   30],
  kashyyyk:          [   90,  -70],
  vandor:            [ -185,  -65],
  // ── Expansion Region ──
  bothawui:          [  140,   30],
  // ── Mid Rim ──
  naboo:             [  130,  -95],
  geonosis:          [  160,  -85],
  ryloth:            [   90,  145],
  "mon-cala":        [  190,   40],
  felucia:           [  160, -120],
  kessel:            [   45,  195],
  bespin:            [   30,  230],
  // ── Outer Rim ──
  tatooine:          [  -65, -205],
  jakku:             [ -145, -205],
  endor:             [ -125, -205],
  dagobah:           [  125, -225],
  hoth:              [  -30,  210],
  mustafar:          [   85, -265],
  kamino:            [  110, -310],
  lothal:            [   75,  255],
  mandalore:         [ -175,   40],
  concordia:         [ -180,   30],
  dathomir:          [  185, -135],
  sullust:           [  155, -185],
  "yavin-4":         [  210, -100],
  scarif:            [  225, -135],
  eadu:              [  250, -100],
  "polis-massa":     [  165, -155],
  pillio:            [  195,  -85],
  cantonica:         [  205,  -55],
  takodana:          [  105, -175],
  "d-qar":           [   55, -255],
  crait:             [  105, -275],
  pasaana:           [   95, -295],
  nevarro:           [  -25,  275],
  sorgan:            [  -55,  275],
  kijimi:            [ -155,  210],
  bakura:            [  185, -245],
  // ── Unknown Regions & Sith Worlds ──
  korriban:          [  145, -325],
  ziost:             [  125, -355],
  "dromund-kaas":    [ -260,  110],
  exegol:            [ -290,  310],
  ilum:              [ -205,  255],
  bastion:           [ -270,  205],
  "ahch-to":         [ -310,  -95],
  lehon:             [ -315,  105],
};

/** Deterministic pseudo-random from a string — used for consistent Y spread. */
function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0) / 0xffffffff; // 0‥1
}

/** Y offset: thin disc, slightly thicker toward the Outer Rim. */
function galaxyY(id: string, x: number, z: number): number {
  const r = Math.sqrt(x * x + z * z);
  const variance = 4 + r * 0.04; // grows from ±4 at core to ±17 at edge
  return (strHash(id) - 0.5) * variance * 2;
}

// ─── Texture cache ─────────────────────────────────────────────────────────

const _texLoader = new THREE.TextureLoader();
const _texCache  = new Map<string, THREE.Texture>();

function getTexture(url: string): THREE.Texture {
  if (!_texCache.has(url)) {
    const tex = _texLoader.load(url);
    try { (tex as any).colorSpace = (THREE as any).SRGBColorSpace; } catch (_) {/**/}
    _texCache.set(url, tex);
  }
  return _texCache.get(url)!;
}

// ─── Space background ────────────────────────────────────────────────────────

function addSpaceBackground(scene: THREE.Scene) {
  // Stars
  const PALETTE: [number, number, number][] = [
    [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0],
    [0.75, 0.85, 1.0], [0.75, 0.85, 1.0],
    [1.0, 0.95, 0.78], [1.0, 0.80, 0.65], [0.55, 0.65, 1.0],
  ];
  const N = 9000;
  const sp = new Float32Array(N * 3), sc = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    const r  = 1200 + Math.random() * 800;
    sp[i*3]   = r * Math.sin(ph) * Math.cos(th);
    sp[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    sp[i*3+2] = r * Math.cos(ph);
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    sc[i*3] = c[0]; sc[i*3+1] = c[1]; sc[i*3+2] = c[2];
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  sg.setAttribute("color",    new THREE.BufferAttribute(sc, 3));
  scene.add(new THREE.Points(sg,
    new THREE.PointsMaterial({ size: 1.9, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true })));

  // Milky Way disc band
  const M = 5000, mp = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) {
    const th = Math.random() * Math.PI * 2, r = 1350 + Math.random() * 450;
    mp[i*3] = r * Math.cos(th);
    mp[i*3+1] = (Math.random() - 0.5) * r * 0.38;
    mp[i*3+2] = r * Math.sin(th);
  }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.BufferAttribute(mp, 3));
  scene.add(new THREE.Points(mg,
    new THREE.PointsMaterial({ color: 0xccddf8, size: 1.1, transparent: true, opacity: 0.35, sizeAttenuation: true })));
}

// ─── Color maps ─────────────────────────────────────────────────────────────

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
  1: "#607d8b", 2: "#2196f3", 3: "#4caf50", 4: "#ff9800", 5: "#ff5252",
};

type ColorMode = "region" | "faction" | "importance";
type EdgeMode  = "none"   | "faction" | "hyperspace";

const REGION_LEGEND     = Object.entries(REGION_COLORS);
const IMPORTANCE_LEGEND: [string, string][] = [
  ["Iconic", "#ff5252"], ["Major", "#ff9800"],
  ["Significant", "#4caf50"], ["Notable", "#2196f3"], ["Minor", "#607d8b"],
];

// ─── Graph types ─────────────────────────────────────────────────────────────

interface GNode {
  id: string; name: string; val: number; color: string;
  classification: string; importance: number; imageUrl?: string;
  fx?: number; fy?: number; fz?: number;
}
interface GLink {
  source: string | GNode; target: string | GNode;
  color: string; label?: string;
}

function getNodeColor(id: string, mode: ColorMode): string {
  const p = findPlanet(id);
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
const LOD_THRESHOLD = 180; // switch to texture below this camera-distance

// ─── "Far-out" threshold ─────────────────────────────────────────────────────
// Show SW easter-egg text when camera is pulled much farther than normal view.
const FAR_SHOW_DIST = 2500;
const FAR_HIDE_DIST = 2000;

// ─── Component ───────────────────────────────────────────────────────────────

export default function GalaxyPage() {
  const [colorMode,    setColorMode]    = useState<ColorMode>("region");
  const [edgeMode,     setEdgeMode]     = useState<EdgeMode>("hyperspace");
  const [filterRegion, setFilterRegion] = useState<string>("All");
  const [search,       setSearch]       = useState("");
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [showLegend,   setShowLegend]   = useState(true);
  const [isFarOut,     setIsFarOut]     = useState(false);
  const [farKey,       setFarKey]       = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef     = useRef<any>(null);
  const bgAddedRef   = useRef(false);
  const wasFarRef    = useRef(false);
  const [graphW, setGraphW] = useState(0);
  const [graphH, setGraphH] = useState(0);

  // Measure container
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => { setGraphW(e[0].contentRect.width); setGraphH(e[0].contentRect.height); });
    ro.observe(el);
    setGraphW(el.clientWidth); setGraphH(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  // Once canvas is ready: add background + position camera for bird's-eye view
  useEffect(() => {
    if (graphW === 0 || graphH === 0 || bgAddedRef.current) return;
    const t = setTimeout(() => {
      const scene: THREE.Scene | undefined = graphRef.current?.scene?.();
      const cam   = graphRef.current?.camera?.();
      const ctrl  = graphRef.current?.controls?.();
      if (!scene) return;
      bgAddedRef.current = true;
      addSpaceBackground(scene);
      // Bird's-eye view: mostly above, slight forward tilt so disc is visible
      if (cam && ctrl) {
        cam.position.set(0, 850, 180);
        ctrl.target.set(0, 0, 0);
        ctrl.update();
      }
    }, 200);
    return () => clearTimeout(t);
  }, [graphW, graphH]);

  // Zoom-to-fit after positions settle (no simulation with fixed coords)
  useEffect(() => {
    const t = setTimeout(() => graphRef.current?.zoomToFit?.(800, 80), 500);
    return () => clearTimeout(t);
  }, []);

  // Poll camera distance each frame for the far-out easter egg
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const cam = graphRef.current?.camera?.();
      if (cam) {
        const dist = cam.position.length();
        if (!wasFarRef.current && dist > FAR_SHOW_DIST) {
          wasFarRef.current = true;
          setIsFarOut(true);
          setFarKey((k) => k + 1); // restart animation
        } else if (wasFarRef.current && dist < FAR_HIDE_DIST) {
          wasFarRef.current = false;
          setIsFarOut(false);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ─── Graph data ───────────────────────────────────────────────────────────

  const nodes = useMemo<GNode[]>(() =>
    PLANETS
      .filter((p) => filterRegion === "All" || p.classification === filterRegion)
      .map((p) => {
        const [gx, gz] = GALAXY_POS[p.id] ?? [0, 0];
        const gy = galaxyY(p.id, gx, gz);
        return {
          id: p.id, name: p.name,
          val: p.importance * 1.6,
          color: getNodeColor(p.id, colorMode),
          classification: p.classification,
          importance: p.importance,
          imageUrl: p.imageUrl,
          fx: gx, fy: gy, fz: gz,
        };
      }),
    [colorMode, filterRegion],
  );

  const SORTED_PLANETS = useMemo(
    () => [...PLANETS].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const flyTo = (id: string) => {
    const gpos = GALAXY_POS[id];
    if (!gpos) return;
    const [gx, gz] = gpos;
    const gy = galaxyY(id, gx, gz);
    graphRef.current?.cameraPosition?.(
      { x: gx, y: gy + 70, z: gz + 130 },
      { x: gx, y: gy,      z: gz       },
      1200,
    );
    setTimeout(() => setSelectedId(id), 400);
  };

  const links = useMemo<GLink[]>(() => {
    if (edgeMode === "none") return [];
    if (edgeMode === "hyperspace") {
      return HYPERSPACE_ROUTES.flatMap((route) => {
        const valid = route.planets.filter((id) => PLANET_IDS.has(id));
        return valid.slice(0, -1).map((id, i) => ({
          source: id, target: valid[i + 1], color: route.color, label: route.name,
        }));
      });
    }
    // Only connect planets that share a faction AND are spatially close.
    // This prevents galaxy-spanning crossing lines.
    const MAX_FACTION_DIST = 220;
    const byFaction = new Map<string, string[]>();
    PLANETS.forEach((p) => p.affiliations.forEach((a) => {
      if (!byFaction.has(a.faction)) byFaction.set(a.faction, []);
      byFaction.get(a.faction)!.push(p.id);
    }));
    const out: GLink[] = [];
    const seen = new Set<string>();
    byFaction.forEach((pids, fid) => {
      if (pids.length < 2) return;
      const faction = FACTIONS.find((f) => f.id === fid);
      const color   = faction?.color ?? "#444";
      for (let i = 0; i < pids.length; i++) {
        for (let j = i + 1; j < pids.length; j++) {
          const [ax, az] = GALAXY_POS[pids[i]] ?? [0, 0];
          const [bx, bz] = GALAXY_POS[pids[j]] ?? [0, 0];
          const dist = Math.sqrt((ax - bx) ** 2 + (az - bz) ** 2);
          if (dist > MAX_FACTION_DIST) continue;
          const key = [pids[i], pids[j]].sort().join("|");
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ source: pids[i], target: pids[j], color, label: faction?.name });
        }
      }
    });
    return out;
  }, [edgeMode]);

  // ─── Search ───────────────────────────────────────────────────────────────

  const highlightIds = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return new Set(PLANETS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    ).map((p) => p.id));
  }, [search]);

  // ─── Three.js LOD node ────────────────────────────────────────────────────

  const nodeThreeObject = (node: any) => {
    const highlighted = !highlightIds || highlightIds.has(node.id as string);
    const col = new THREE.Color(node.color as string);
    const r   = Math.cbrt(node.val as number) * 1.4;
    const url = node.imageUrl as string | undefined;
    const lod = new THREE.LOD();

    if (url) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r * 1.5, 32, 32),
        new THREE.MeshBasicMaterial({
          map: getTexture(url),
          transparent: !highlighted, opacity: highlighted ? 1 : 0.15,
        }),
      );
      lod.addLevel(mesh, 0);
    }

    const far = new THREE.Group();
    far.add(new THREE.Mesh(
      new THREE.SphereGeometry(r, 14, 14),
      new THREE.MeshBasicMaterial({ color: col, transparent: !highlighted, opacity: highlighted ? 1 : 0.12 }),
    ));
    if (highlighted) {
      far.add(new THREE.Mesh(
        new THREE.SphereGeometry(r * 2.6, 14, 14),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, depthWrite: false }),
      ));
    }
    lod.addLevel(far, url ? LOD_THRESHOLD : 0);
    return lod;
  };

  // ─── Legend ───────────────────────────────────────────────────────────────

  const legendItems: [string, string][] =
    colorMode === "region"     ? REGION_LEGEND :
    colorMode === "importance" ? IMPORTANCE_LEGEND :
    FACTIONS.slice(0, 12).map((f) => [f.shortName ?? f.name, f.color]);

  const selected = selectedId ? findPlanet(selectedId) : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100dvh" }}>

      {/* Controls bar */}
      <div className="shrink-0 z-20 px-3 sm:px-5 py-2.5 flex flex-wrap gap-2 items-center border-b border-border bg-black/75 backdrop-blur-md">

        {/* Row-1 group: jump + region filter */}
        <select
          defaultValue=""
          onChange={(e) => { flyTo(e.target.value); e.target.value = ""; }}
          className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none max-w-[160px]"
        >
          <option value="" disabled>Jump to planet…</option>
          {SORTED_PLANETS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
          className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none">
          <option value="All">All Regions</option>
          {Object.keys(REGION_COLORS).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        {/* Divider */}
        <span className="hidden sm:block w-px h-5 bg-border" />

        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest font-display hidden lg:inline text-[10px]">Color</span>
          <select value={colorMode} onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="region">By Region</option>
            <option value="faction">By Faction</option>
            <option value="importance">By Importance</option>
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest font-display hidden lg:inline text-[10px]">Edges</span>
          <select value={edgeMode} onChange={(e) => setEdgeMode(e.target.value as EdgeMode)}
            className="px-2 py-1.5 rounded-md bg-input border border-border text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="hyperspace">Hyperspace Routes</option>
            <option value="faction">Faction Links</option>
            <option value="none">No Edges</option>
          </select>
        </label>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="search" placeholder="Highlight…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md bg-input border border-border text-sm w-32 focus:border-primary focus:outline-none" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground hidden md:inline">
            {nodes.length} planets · {links.length} links
          </span>
          <button onClick={() => setShowLegend((v) => !v)}
            className="px-2.5 py-1.5 rounded-md text-[11px] font-display uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            {showLegend ? "Hide" : "Legend"}
          </button>
          <button onClick={() => graphRef.current?.zoomToFit?.(600, 60)} title="Reset camera"
            className="px-2 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-D canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {graphW > 0 && graphH > 0 && (
          <ForceGraph3D
            ref={graphRef}
            graphData={{ nodes, links }}
            width={graphW} height={graphH}
            backgroundColor="#00001a"
            nodeId="id" nodeLabel="name"
            nodeThreeObject={nodeThreeObject}
            nodeThreeObjectExtend={false}
            linkColor={(l: any) => l.color ?? "#334"}
            linkWidth={0.8} linkOpacity={0.5}
            linkCurvature={0.25}
            linkDirectionalParticles={edgeMode === "hyperspace" ? 2 : 0}
            linkDirectionalParticleWidth={1.2}
            linkDirectionalParticleColor={(l: any) => l.color ?? "#aaf"}
            onNodeClick={(n: any) => setSelectedId(n.id as string)}
            cooldownTicks={0}
            warmupTicks={0}
          />
        )}

        {/* Zoom-in hint */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full border border-border bg-black/60 backdrop-blur-sm text-[10px] font-display uppercase tracking-widest text-muted-foreground pointer-events-none select-none">
          Zoom in on a planet to see its surface
        </div>

        {/* Legend */}
        {showLegend && (
          <div
            className="absolute left-4 z-10 rounded-xl border border-border bg-black/70 backdrop-blur-md p-3 max-w-[190px] max-h-[35vh] overflow-y-auto"
            style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))" }}
          >
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
              Zoom in to reveal textures
            </div>
          </div>
        )}

        {/* ── "A long time ago…" easter egg ── */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{
            background: isFarOut ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0)",
            transition: "background 1.2s ease-in-out",
          }}
        >
          {isFarOut && (
            <p
              key={farKey}
              style={{
                fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1.1rem, 2.8vw, 1.9rem)",
                color: "#7eb8d4",
                textAlign: "center",
                letterSpacing: "0.04em",
                lineHeight: 1.9,
                textShadow: "0 0 60px rgba(126,184,212,0.25)",
                animation: "swFadeIn 3.2s ease-in-out forwards",
                userSelect: "none",
              }}
            >
              A long time ago in a galaxy far, far away....
            </p>
          )}
        </div>

        {/* CSS keyframe for the SW text */}
        <style>{`
          @keyframes swFadeIn {
            0%   { opacity: 0; }
            25%  { opacity: 0; }
            70%  { opacity: 1; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>

      {/* Planet detail drawer */}
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
                    <img src={selected.imageUrl} alt={selected.name} className="w-full h-36 object-cover" />
                  </div>
                )}
                <p className="text-xs text-foreground/80 leading-relaxed mb-4">{selected.loreSignificance}</p>
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
                  <button
                    onClick={() => {
                      setPendingAnchor({ page: "/planets", id: selected.id });
                      window.location.hash = "#/planets";
                    }}
                    className="block w-full text-center py-2 rounded-md border border-primary text-primary text-xs font-display uppercase tracking-widest hover:bg-primary/10 transition-colors"
                  >
                    Full Entry →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DrawerPortal>
      )}
    </div>
  );
}

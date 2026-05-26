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

/** Y offset: disc thickness — enough 3-D depth for natural-looking links without
 *  planets drifting off-plane. Grows from ±12 at the core to ±45 at the Outer Rim. */
function galaxyY(id: string, x: number, z: number): number {
  const r = Math.sqrt(x * x + z * z);
  const variance = 12 + r * 0.1; // 3× more than original → real depth, still a disc
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

// Round dot texture for star particles — prevents the default square sprite look.
let _dotTex: THREE.Texture | null = null;
function getDotTexture(): THREE.Texture {
  if (_dotTex) return _dotTex;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, "rgba(255,255,255,1.0)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.9)");
  grad.addColorStop(0.8, "rgba(255,255,255,0.2)");
  grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  _dotTex = new THREE.CanvasTexture(canvas);
  return _dotTex;
}

// ─── Space background ────────────────────────────────────────────────────────

function addSpaceBackground(scene: THREE.Scene) {
  // ── 1. Deep-space star field (spherical shell far from the galaxy) ────────
  const PALETTE: [number, number, number][] = [
    [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0],
    [0.75, 0.85, 1.0], [0.75, 0.85, 1.0],
    [1.0, 0.95, 0.78], [1.0, 0.80, 0.65], [0.55, 0.65, 1.0],
  ];
  const N = 12000;
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
    new THREE.PointsMaterial({ size: 2.0, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true, map: getDotTexture(), alphaTest: 0.02 })));

  // ── 2. Galaxy disc — dense star field in the XZ plane (r = 350–950) ──────
  // This forms the visible spiral galaxy seen OUTSIDE the planet zones,
  // matching the dark-blue swirling galaxy background of the official map.
  const BG_ARM_COUNT = 4;
  const BG_STARS  = 3500; // per arm — dense enough to see the spiral shape
  const bgPos = new Float32Array(BG_ARM_COUNT * BG_STARS * 3);
  const bgCol = new Float32Array(BG_ARM_COUNT * BG_STARS * 3);
  let bi = 0;
  for (let arm = 0; arm < BG_ARM_COUNT; arm++) {
    const offset = (arm / BG_ARM_COUNT) * Math.PI * 2;
    for (let s = 0; s < BG_STARS; s++) {
      const t     = s / BG_STARS;
      // Spiral starts at r≈350 (just outside planet zone) and winds to r≈950
      const theta = offset + t * Math.PI * 3.5;
      const r     = 350 + t * 600;
      const scatter = (Math.random() - 0.5) * r * 0.22;
      const x = (r + scatter) * Math.cos(theta) + (Math.random() - 0.5) * 30;
      const z = (r + scatter) * Math.sin(theta) + (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * r * 0.08; // thin disc
      bgPos[bi * 3]     = x;
      bgPos[bi * 3 + 1] = y;
      bgPos[bi * 3 + 2] = z;
      // Deep blue — the dark teal/blue of spiral arms in the official map
      bgCol[bi * 3]     = 0.25 + Math.random() * 0.20;
      bgCol[bi * 3 + 1] = 0.45 + Math.random() * 0.30;
      bgCol[bi * 3 + 2] = 0.80 + Math.random() * 0.20;
      bi++;
    }
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute("position", new THREE.BufferAttribute(bgPos.slice(0, bi * 3), 3));
  bg.setAttribute("color",    new THREE.BufferAttribute(bgCol.slice(0, bi * 3), 3));
  scene.add(new THREE.Points(bg,
    new THREE.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: 0.70, sizeAttenuation: true, map: getDotTexture(), alphaTest: 0.02 })));

  // ── 3. Inner galaxy — denser star concentration inside the planet zone ────
  const IN_STARS = 4000;
  const inPos = new Float32Array(IN_STARS * 3);
  const inCol = new Float32Array(IN_STARS * 3);
  for (let i = 0; i < IN_STARS; i++) {
    const th = Math.random() * Math.PI * 2;
    const r  = Math.sqrt(Math.random()) * 350; // uniform in disc
    const x  = r * Math.cos(th) + (Math.random() - 0.5) * 10;
    const z  = r * Math.sin(th) + (Math.random() - 0.5) * 10;
    const y  = (Math.random() - 0.5) * Math.max(6, r * 0.05);
    inPos[i * 3]     = x;
    inPos[i * 3 + 1] = y;
    inPos[i * 3 + 2] = z;
    // Warm golden near core → cool blue-white toward edge
    const cf = Math.max(0, 1 - r / 350);
    inCol[i * 3]     = 0.80 + cf * 0.20;
    inCol[i * 3 + 1] = 0.75 + cf * 0.15;
    inCol[i * 3 + 2] = 0.60 + (1 - cf) * 0.40;
  }
  const ig = new THREE.BufferGeometry();
  ig.setAttribute("position", new THREE.BufferAttribute(inPos, 3));
  ig.setAttribute("color",    new THREE.BufferAttribute(inCol, 3));
  scene.add(new THREE.Points(ig,
    new THREE.PointsMaterial({ size: 0.9, vertexColors: true, transparent: true, opacity: 0.55, sizeAttenuation: true, map: getDotTexture(), alphaTest: 0.02 })));

  // ── 4. Galactic region zone fills ────────────────────────────────────────
  // Solid colored concentric bands on the XZ plane, matching the official
  // Star Wars galaxy map — warm golden core → cooler blue outer zones.
  const ZONES: { inner: number; outer: number; color: number; opacity: number }[] = [
    { inner:   0, outer:  32, color: 0xd4a820, opacity: 0.42 }, // Deep Core: golden
    { inner:  32, outer:  90, color: 0xc88830, opacity: 0.34 }, // Core Worlds: amber
    { inner:  90, outer: 130, color: 0xb07030, opacity: 0.26 }, // Colonies: brown-orange
    { inner: 130, outer: 175, color: 0xb88858, opacity: 0.22 }, // Inner Rim: tan
    { inner: 175, outer: 215, color: 0xa06878, opacity: 0.20 }, // Expansion: rose/mauve
    { inner: 215, outer: 265, color: 0x607098, opacity: 0.18 }, // Mid Rim: periwinkle
    { inner: 265, outer: 340, color: 0x405878, opacity: 0.14 }, // Outer Rim: steel blue
  ];
  for (const z of ZONES) {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(z.inner, z.outer, 128),
      new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: z.opacity, side: THREE.DoubleSide, depthWrite: false }),
    );
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);
  }

  // Soft glow halos on top of the zone fills to blend edges
  const HALOS: { r: number; color: number; opacity: number }[] = [
    { r:  34, color: 0xffdd60, opacity: 0.30 },
    { r:  92, color: 0xe0a040, opacity: 0.20 },
    { r: 132, color: 0xc07840, opacity: 0.15 },
    { r: 177, color: 0xa07060, opacity: 0.12 },
    { r: 217, color: 0x7080a8, opacity: 0.10 },
    { r: 267, color: 0x506888, opacity: 0.09 },
  ];
  for (const h of HALOS) {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(h.r - 8, h.r + 8, 128),
      new THREE.MeshBasicMaterial({ color: h.color, transparent: true, opacity: h.opacity, side: THREE.DoubleSide, depthWrite: false }),
    );
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);
  }

  // ── 5. Inner spiral arm stars — layered over the zone fills ──────────────
  // Four logarithmic spiral arms traced within the planet zone (r < 390).
  // Large bright stars at high opacity so they're clearly visible above the
  // coloured zone fills — this is the primary "galaxy spiral" structure.
  const ARM_COUNT  = 4;
  const ARM_STARS  = 4000;
  const armPos = new Float32Array(ARM_COUNT * ARM_STARS * 3);
  const armCol = new Float32Array(ARM_COUNT * ARM_STARS * 3);
  let ai = 0;
  for (let arm = 0; arm < ARM_COUNT; arm++) {
    const offset = (arm / ARM_COUNT) * Math.PI * 2;
    for (let s = 0; s < ARM_STARS; s++) {
      const t       = s / ARM_STARS;
      const theta   = offset + t * Math.PI * 2.8;
      const r       = 22 * Math.exp(0.26 * (theta - offset));
      const scatter = (Math.random() - 0.5) * r * 0.16;
      const x = (r + scatter) * Math.cos(theta) + (Math.random() - 0.5) * 10;
      const z = (r + scatter) * Math.sin(theta) + (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 8; // keep tight to the disc plane
      if (Math.sqrt(x * x + z * z) > 390) continue;
      armPos[ai * 3]     = x;
      armPos[ai * 3 + 1] = y;
      armPos[ai * 3 + 2] = z;
      // Warm golden near the core → bright blue-white toward the rim
      const cf = Math.max(0, 1 - Math.sqrt(x * x + z * z) / 390);
      armCol[ai * 3]     = 0.85 + cf * 0.15;
      armCol[ai * 3 + 1] = 0.90 + cf * 0.10;
      armCol[ai * 3 + 2] = 1.00;
      ai++;
    }
  }
  if (ai > 0) {
    const ag = new THREE.BufferGeometry();
    ag.setAttribute("position", new THREE.BufferAttribute(armPos.slice(0, ai * 3), 3));
    ag.setAttribute("color",    new THREE.BufferAttribute(armCol.slice(0, ai * 3), 3));
    scene.add(new THREE.Points(ag,
      new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.82, sizeAttenuation: true })));
  }

  // ── 6. Galactic core glow ─────────────────────────────────────────────────
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(9, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfffae0 }),
  ));
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(32, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe890, transparent: true, opacity: 0.28, depthWrite: false }),
  ));
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(75, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xc09040, transparent: true, opacity: 0.10, depthWrite: false }),
  ));
}

// ─── Color maps ─────────────────────────────────────────────────────────────

// Colors matched to the zone fills so planet dots look part of their region.
const REGION_COLORS: Record<string, string> = {
  "Deep Core":         "#ffd84a",   // bright golden
  "Core World":        "#e8a030",   // amber
  Colonies:            "#d48040",   // brown-orange
  "Inner Rim":         "#d4a860",   // tan/cream
  "Expansion Region":  "#c07888",   // rose/mauve
  "Mid Rim":           "#7888c8",   // periwinkle blue
  "Outer Rim":         "#5878a0",   // steel blue
  "Hutt Space":        "#b060d0",   // purple
  "Wild Space":        "#708090",   // slate
  "Unknown Regions":   "#445566",   // dark slate
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

const PLANET_IDS    = new Set(PLANETS.map((p) => p.id));
const LOD_TEXTURE   = 180; // below this distance → show texture sphere
const LOD_LABEL     = 350; // below this distance → show floating name label

// ─── Text label sprites ───────────────────────────────────────────────────────
// Canvas-rendered text sprites that float next to each planet in the close-up
// LOD level. Cached by name+color to avoid redundant canvas allocations.
const _labelTexCache = new Map<string, THREE.Texture>();

function makeTextSprite(name: string, color: string, r: number): THREE.Sprite {
  const key = `${name}|${color}`;
  let tex = _labelTexCache.get(key);
  if (!tex) {
    const W = 384, H = 48;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.textBaseline = "middle";
    // Dark outline for readability against any background
    ctx.strokeStyle = "rgba(0,4,18,0.92)";
    ctx.lineWidth = 4;
    ctx.strokeText(name, 6, H / 2);
    ctx.fillStyle = color;
    ctx.fillText(name, 6, H / 2);
    tex = new THREE.CanvasTexture(canvas);
    _labelTexCache.set(key, tex);
  }
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }),
  );
  // Scale: 18 world-units wide, keep W:H aspect ratio
  const labelW = 18, labelH = labelW * (48 / 384);
  sprite.scale.set(labelW, labelH, 1);
  // Position: to the right of the planet + a little above centre
  sprite.position.set(r * 2.2 + labelW * 0.55, r * 0.9, 0);
  return sprite;
}

// ─── "Far-out" threshold ─────────────────────────────────────────────────────
// Show SW easter-egg text when camera is pulled much farther than normal view.
const FAR_SHOW_DIST = 10000;
const FAR_HIDE_DIST = 6000;

// ─── Component ───────────────────────────────────────────────────────────────

export default function GalaxyPage() {
  const [colorMode,    setColorMode]    = useState<ColorMode>("region");
  const [edgeMode,     setEdgeMode]     = useState<EdgeMode>("none");
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
  const distDisplayRef = useRef<HTMLSpanElement>(null);
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
        // Update the HUD counter without triggering a React re-render
        if (distDisplayRef.current) {
          distDisplayRef.current.textContent = Math.round(dist).toString();
        }
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
    // Zoom close enough to trigger the texture LOD (< LOD_TEXTURE = 180)
    // Distance here ≈ sqrt(35² + 65²) ≈ 73 units — clearly shows the texture.
    // Drawer stays closed; user can click the planet to open it.
    graphRef.current?.cameraPosition?.(
      { x: gx, y: gy + 35, z: gz + 65 },
      { x: gx, y: gy,      z: gz      },
      1200,
    );
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

    // ── Level 0: close-up (camera < LOD_TEXTURE) — textured sphere + label ─
    const closeGroup = new THREE.Group();
    if (url) {
      closeGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(r * 1.5, 32, 32),
        new THREE.MeshBasicMaterial({
          map: getTexture(url),
          transparent: !highlighted,
          opacity: highlighted ? 1 : 0.15,
        }),
      ));
    } else {
      closeGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(r * 1.5, 24, 24),
        new THREE.MeshBasicMaterial({ color: col, transparent: !highlighted, opacity: highlighted ? 1 : 0.15 }),
      ));
    }
    closeGroup.add(makeTextSprite(node.name as string, node.color as string, r));
    lod.addLevel(closeGroup, 0);

    // ── Level 1: medium zoom (LOD_TEXTURE ≤ camera < LOD_LABEL) — glow + label
    const midGroup = new THREE.Group();
    midGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(r, 14, 14),
      new THREE.MeshBasicMaterial({ color: col, transparent: !highlighted, opacity: highlighted ? 1 : 0.12 }),
    ));
    if (highlighted) {
      midGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(r * 2.6, 14, 14),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, depthWrite: false }),
      ));
    }
    midGroup.add(makeTextSprite(node.name as string, node.color as string, r));
    lod.addLevel(midGroup, LOD_TEXTURE);

    // ── Level 2: far out (camera ≥ LOD_LABEL) — glow dot only, no label ──
    const farGroup = new THREE.Group();
    farGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(r, 14, 14),
      new THREE.MeshBasicMaterial({ color: col, transparent: !highlighted, opacity: highlighted ? 1 : 0.12 }),
    ));
    if (highlighted) {
      farGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(r * 2.6, 14, 14),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, depthWrite: false }),
      ));
    }
    lod.addLevel(farGroup, LOD_LABEL);
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
            backgroundColor="#000010"
            nodeId="id" nodeLabel="name"
            nodeThreeObject={nodeThreeObject}
            nodeThreeObjectExtend={false}
            linkColor={(l: any) => l.color ?? "#334"}
            linkWidth={0.8} linkOpacity={0.55}
            linkDirectionalParticles={edgeMode === "hyperspace" ? 2 : 0}
            linkDirectionalParticleWidth={1.2}
            linkDirectionalParticleColor={(l: any) => l.color ?? "#aaf"}
            linkCurvature={0.2}
            enableNodeDrag={false}
            onNodeClick={(n: any) => setSelectedId(n.id as string)}
            cooldownTicks={0}
            warmupTicks={0}
          />
        )}

        {/* Zoom-in hint */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full border border-border bg-black/60 backdrop-blur-sm text-[10px] font-display uppercase tracking-widest text-muted-foreground pointer-events-none select-none">
          Zoom in on a planet to see its surface
        </div>

        {/* Camera distance HUD — useful for tuning the easter-egg thresholds */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-0.5 pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-md border border-border/60 bg-black/55 backdrop-blur-sm">
            <span className="font-mono text-[11px] text-muted-foreground/70 tracking-wider">
              dist{" "}
            </span>
            <span ref={distDisplayRef} className="font-mono text-[13px] text-primary/80 tabular-nums">
              —
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/50 tracking-wider"> u</span>
          </div>
          <div className="px-2 py-0.5 rounded-sm bg-black/40 text-[9px] font-mono text-muted-foreground/40 tracking-wider">
            easter egg @ {FAR_SHOW_DIST} u
          </div>
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

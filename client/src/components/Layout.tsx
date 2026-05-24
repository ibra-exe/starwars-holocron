import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Globe,
  Clock,
  Library,
  Users,
  Flag,
  Sparkles,
  Network,
  Route as RouteIcon,
  Search,
  Sword,
  Dna,
  Scale,
  Menu,
  X,
  MapPin,
  Rocket,
  Gem,
  GitBranch,
  Quote,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useSettings } from "@/lib/settings";
import { playMenuOpen, playMenuClose, playNavClick } from "@/lib/sounds";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { href: "/eras", label: "Eras Atlas", icon: Globe, testId: "nav-eras" },
  { href: "/timeline", label: "Master Timeline", icon: Clock, testId: "nav-timeline" },
  { href: "/media", label: "Media Library", icon: Library, testId: "nav-media" },
  { href: "/characters", label: "Character Codex", icon: Users, testId: "nav-characters" },
  { href: "/species", label: "Species", icon: Dna, testId: "nav-species" },
  { href: "/factions", label: "Factions", icon: Flag, testId: "nav-factions" },
  { href: "/planets", label: "Planets & Locations", icon: MapPin, testId: "nav-planets" },
  { href: "/ships", label: "Ships & Vehicles", icon: Rocket, testId: "nav-ships" },
  { href: "/artifacts", label: "Weapons & Artifacts", icon: Gem, testId: "nav-artifacts" },
  { href: "/lineages", label: "Lineages", icon: GitBranch, testId: "nav-lineages" },
  { href: "/force", label: "Force Philosophy", icon: Sparkles, testId: "nav-force" },
  { href: "/continuity", label: "Canon vs Legends", icon: Scale, testId: "nav-continuity" },
  { href: "/visualizations", label: "Visualizations", icon: Network, testId: "nav-viz" },
  { href: "/pathways", label: "Pathways", icon: RouteIcon, testId: "nav-pathways" },
  { href: "/search", label: "Cross-Reference", icon: Search, testId: "nav-search" },
  { href: "/quote", label: "Quote of the Day", icon: Quote, testId: "nav-quote" },
  { href: "/settings", label: "Settings", icon: Settings, testId: "nav-settings" },
];

function HolocronLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-label="Holocron"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <defs>
        <radialGradient id="holo-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="28" height="28" rx="2" transform="rotate(45 20 20)" />
      <rect x="11" y="11" width="18" height="18" rx="1.5" transform="rotate(45 20 20)" opacity="0.55" />
      <rect x="15" y="15" width="10" height="10" rx="1" transform="rotate(45 20 20)" opacity="0.85" />
      <circle cx="20" cy="20" r="6" fill="url(#holo-core)" stroke="none" />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <line x1="20" y1="2" x2="20" y2="6" />
      <line x1="20" y1="34" x2="20" y2="38" />
      <line x1="2" y1="20" x2="6" y2="20" />
      <line x1="34" y1="20" x2="38" y2="20" />
    </svg>
  );
}

function SidebarContent({ location, onNavigate, onNavSound }: { location: string; onNavigate?: () => void; onNavSound?: () => void }) {
  return (
    <>
      <div className="px-6 py-6 border-b border-sidebar-border relative">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigate}>
            <div className="text-primary glow-gold-sm rounded-md p-1.5 bg-primary/[0.06] border border-primary/30 group-hover:bg-primary/10 transition-colors">
              <HolocronLogo className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <div className="font-display text-[15px] tracking-[0.22em] text-primary leading-none">
                HOLOCRON
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1.5">
                Lore Intelligence
              </div>
            </div>
          </div>
        </Link>
        <div className="absolute bottom-[-1px] left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <nav className="flex-1 px-3 py-5 space-y-px overflow-y-auto">
        <div className="px-3 pb-2 eyebrow-muted text-[9px]">Archives</div>
        {NAV.map((item, idx) => {
          const active =
            location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} data-testid={item.testId}>
              <div
                onClick={() => { onNavSound?.(); onNavigate?.(); }}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] cursor-pointer transition-all relative ${
                  active
                    ? "bg-primary/[0.08] text-primary"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r glow-gold-sm" />
                )}
                <Icon className={`w-[15px] h-[15px] shrink-0 ${active ? "" : "opacity-60 group-hover:opacity-90"}`} />
                <span className="truncate font-medium">{item.label}</span>
                <span className={`ml-auto font-mono text-[9px] tracking-wider ${active ? "text-primary/70" : "text-muted-foreground/40"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border text-[10px] text-muted-foreground space-y-3 relative">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <ThemeSwitcher />
        <div className="flex items-center gap-2 pl-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <Sword className="w-3 h-3 text-primary" />
          <span className="uppercase tracking-[0.22em] font-mono">Archives Online</span>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground/70 pl-5">
          25,000 BBY → 35 ABY
        </div>
      </div>
    </>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { animations, sounds } = useSettings();

  const openMenu = () => { setMobileOpen(true); if (sounds) playMenuOpen(); };
  const closeMenu = () => { setMobileOpen(false); if (sounds) playMenuClose(); };
  const navSound = () => { if (sounds) playNavClick(); };

  // Close mobile sidebar whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const spring = animations
    ? { type: "spring" as const, damping: 26, stiffness: 260, mass: 0.85 }
    : { duration: 0 };
  const fade = { duration: animations ? 0.18 : 0 };

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex-col relative"
        data-testid="sidebar"
      >
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none" />
        <SidebarContent location={location} onNavSound={navSound} />
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-30 bg-sidebar/95 backdrop-blur border-b border-sidebar-border"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
        data-testid="mobile-header"
      >
      <div className="h-14 flex items-center justify-between px-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={openMenu}
          className="p-3 text-foreground/85 hover:text-primary"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" data-testid="link-mobile-home">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="text-primary glow-gold-sm rounded-md p-1 bg-primary/[0.06] border border-primary/30">
              <HolocronLogo className="w-5 h-5" />
            </div>
            <div className="font-display text-[12px] tracking-[0.22em] text-primary leading-none">
              HOLOCRON
            </div>
          </div>
        </Link>
        <div className="w-12" aria-hidden />
      </div>
      </header>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-sidebar"
            className="md:hidden fixed inset-0 z-50"
            data-testid="mobile-sidebar-overlay"
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              onClick={closeMenu}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={spring}
              style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
            >
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeMenu}
                className="absolute right-3 p-1.5 text-muted-foreground hover:text-foreground z-10"
                style={{ top: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
                data-testid="button-mobile-close"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent location={location} onNavigate={closeMenu} onNavSound={navSound} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 relative overflow-hidden mobile-safe-pt md:pt-0">
        <div className="starfield" aria-hidden />
        <div className="grain absolute inset-0 pointer-events-none z-[2]" aria-hidden />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}

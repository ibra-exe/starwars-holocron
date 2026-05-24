# Star Wars: Project Holocron

An interactive Star Wars lore intelligence system — 13 eras spanning 25,000+ years of Canon and Legends. Browse characters, planets, factions, ships, species, artifacts, Force concepts, and media across the full saga with deep cross-referencing and curated viewing pathways.

**Live:** https://ibra-exe.github.io/starwars-project-holocron/

---

## What's Inside

| Section | Entries | Description |
|---|---|---|
| Eras | 13 | Dawn of the Jedi → Post-Sequel era, each with timeline, politics, and key events |
| Media | 79 | Films, series, novels, comics, and games — Canon and Legends |
| Characters | 59 | Full dossiers: biography, affiliations, Force alignment, appearances |
| Planets | 55 | Geography, history, notable characters, key events per world |
| Ships | 54 | Specs, faction affiliations, combat history |
| Species | 62 | Biology, culture, Force sensitivity, homeworld |
| Factions | 24 | Full political history, leadership, rise and fall |
| Artifacts | 42 | Lightsabers, holocrons, relics — origin and lore significance |
| Lineages | 14 | Training chains and bloodlines mapped as node graphs |
| Force Concepts | 16 | Powers, philosophies, and traditions of both sides |
| Quotes | 34 | Hand-curated lines from across the saga, daily rotation |

### Feature highlights

- **Timeline** — scrollable chronological view across all 13 eras
- **Visualizations** — Mermaid.js-rendered faction relationship diagrams
- **Force graph** — D3-powered interactive network of Force lineages
- **Global search** — instant cross-reference across every entity type
- **Viewing pathways** — curated watch/read orders for different audiences (beginner, completionist, character-focused, faction-focused)
- **Canon vs. Legends** — continuity filter and full explainer section
- **Spoiler veil** — toggle spoiler-tagged content on/off per page
- **Quote of the Day** — seeded daily from the quote vault
- **PWA-ready** — web manifest and service worker included

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite 7](https://vite.dev) | Build tool and dev server |
| [TypeScript](https://www.typescriptlang.org) | Strict type-safety across all data and components |
| [Wouter](https://github.com/molefrog/wouter) | Lightweight client-side router (hash-based) |
| [TanStack Query v5](https://tanstack.com/query) | Server state management |
| [Tailwind CSS v3](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Radix-based accessible component library |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [D3.js](https://d3js.org) + [react-force-graph-2d](https://github.com/vasturiano/react-force-graph-2d) | Force-directed lineage graph |
| [Mermaid.js](https://mermaid.js.org) | Faction relationship diagrams |
| [Recharts](https://recharts.org) | Data visualizations |
| [Lucide React](https://lucide.dev) | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light theme switching |

### Backend
| Tool | Purpose |
|---|---|
| [Express 5](https://expressjs.com) | HTTP server (serves static files in production) |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe database access layer |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite driver |
| [Zod](https://zod.dev) | Schema validation |

> The backend is intentionally minimal — all lore data is static TypeScript. The Express server exists to support future API features.

### Tooling
| Tool | Purpose |
|---|---|
| [esbuild](https://esbuild.github.io) | Server bundle for production |
| [tsx](https://github.com/privatenumber/tsx) | TypeScript execution for scripts |
| [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | Database migrations |
| [GitHub Actions](https://docs.github.com/en/actions) | CI/CD → GitHub Pages |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5000)
npm run dev

# Type check
npm run check

# Production build
npm run build

# Serve production build
npm start
```

---

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── data/          # All lore data as typed TypeScript arrays
│   │   ├── pages/         # One file per route
│   │   ├── components/    # Shared UI components + shadcn/ui primitives
│   │   └── lib/           # Utilities (theme, settings, entity index, router)
│   └── public/            # PWA assets (manifest, icons, service worker)
├── server/                # Express server + static file serving
├── shared/                # Drizzle schema shared between client and server
└── script/                # Build scripts
```

---

## Deployment

The app is deployed to **GitHub Pages** via a GitHub Actions workflow on every push to `main`. The workflow builds the Vite client and deploys the `dist/public` output.

Because all routing is hash-based (`/#/characters`, `/#/planets`, etc.), no server-side rewrite rules are needed for deep linking.

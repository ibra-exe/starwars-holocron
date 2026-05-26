import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/lib/theme";
import { SettingsProvider } from "@/lib/settings";
import Dashboard from "@/pages/dashboard";
import ErasPage from "@/pages/eras";
import TimelinePage from "@/pages/timeline";
import MediaPage from "@/pages/media";
import CharactersPage from "@/pages/characters";
import FactionsPage from "@/pages/factions";
import ForcePage from "@/pages/force";
import VisualizationsPage from "@/pages/visualizations";
import PathwaysPage from "@/pages/pathways";
import SearchPage from "@/pages/search";
import SpeciesPage from "@/pages/species";
import ContinuityPage from "@/pages/continuity";
import PlanetsPage from "@/pages/planets";
import GalaxyPage from "@/pages/galaxy";
import ShipsPage from "@/pages/ships";
import ArtifactsPage from "@/pages/artifacts";
import LineagesPage from "@/pages/lineages";
import SettingsPage from "@/pages/settings";
import QuotePage from "@/pages/quote";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/eras" component={ErasPage} />
      <Route path="/timeline" component={TimelinePage} />
      <Route path="/media" component={MediaPage} />
      <Route path="/characters" component={CharactersPage} />
      <Route path="/factions" component={FactionsPage} />
      <Route path="/force" component={ForcePage} />
      <Route path="/visualizations" component={VisualizationsPage} />
      <Route path="/pathways" component={PathwaysPage} />
      <Route path="/species" component={SpeciesPage} />
      <Route path="/continuity" component={ContinuityPage} />
      <Route path="/planets" component={PlanetsPage} />
      <Route path="/galaxy" component={GalaxyPage} />
      <Route path="/ships" component={ShipsPage} />
      <Route path="/artifacts" component={ArtifactsPage} />
      <Route path="/lineages" component={LineagesPage} />
      <Route path="/quote" component={QuotePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/search" component={SearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <Layout>
              <AppRouter />
            </Layout>
          </Router>
        </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

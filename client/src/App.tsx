import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import ExperienceDetail from "./pages/ExperienceDetail";
import EducationDetail from "./pages/EducationDetail";
import Sidebar from "./components/Sidebar";
import ActivityDetail from "@/pages/ActivityDetail";
import Login from "@/pages/Login";
import RequestAccess from "@/pages/RequestAccess";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/request-access" component={RequestAccess} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/experience/:index" component={ExperienceDetail} />
      <Route path="/activity/:category/:item" component={ActivityDetail} />
      <Route path="/education/:type/:index" component={EducationDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <Sidebar />
            <div className="lg:pl-[280px]">
              <AppRoutes />
            </div>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
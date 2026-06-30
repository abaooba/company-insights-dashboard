import { Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const linkCls = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
const activeCls = "text-foreground";

/** App-wide header with brand + primary navigation, shared across pages. */
const SiteHeader = () => (
  <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
    <div className="container flex h-14 max-w-6xl items-center gap-6 px-4">
      <NavLink to="/" className="flex shrink-0 items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold tracking-tight text-foreground">SEC Analyzer</span>
      </NavLink>
      <nav className="flex items-center gap-5">
        <NavLink to="/" end className={linkCls} activeClassName={activeCls}>
          Analyze
        </NavLink>
        <NavLink to="/factors" className={linkCls} activeClassName={activeCls}>
          Factor Attribution
        </NavLink>
      </nav>
      <span className="ml-auto hidden font-mono text-xs text-muted-foreground/50 sm:block">v0.2</span>
    </div>
  </header>
);

export default SiteHeader;

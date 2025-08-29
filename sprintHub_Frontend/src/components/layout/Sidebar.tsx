
import React, { createContext, useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  CheckSquare,
  ChevronRight,
  Folders,
  Home,
  Menu,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("SidebarTrigger must be used within SidebarProvider");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => context.setExpanded((prev) => !prev)}
      aria-label={context.expanded ? "Close sidebar" : "Open sidebar"}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

interface SidebarNavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
}

function SidebarNavLink({ to, icon: Icon, children, end }: SidebarNavLinkProps) {
  const location = useLocation();
  const context = useContext(SidebarContext);
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-accent",
          isActive ? "bg-primary text-primary-foreground" : "text-foreground"
        )
      }
    >
      <Icon className="h-5 w-5 min-w-[20px]" />
      <span className={cn(
        "font-medium transition-all duration-300",
        context?.expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
      )}>
        {children}
      </span>
    </NavLink>
  );
}

export function Sidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar must be used within SidebarProvider");

  const { expanded, setExpanded } = context;

  return (
    <aside
      className={cn(
        "group/sidebar relative z-30 flex h-screen flex-col border-r bg-background transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span
            className={cn(
              "text-xl transition-opacity",
              expanded ? "opacity-100" : "opacity-0"
            )}
          >
            SprintHub
          </span>
        </NavLink>
        <div className="ml-auto md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 px-2 py-4 transition-opacity duration-300",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <h3 className="px-3 text-xs font-medium text-muted-foreground">
          Menu
        </h3>
      </div>
      <nav className="flex-1 px-2 py-2">
        <div className="space-y-1">
          
          <SidebarNavLink to="/dashboard" icon={BarChart3}>
            Dashboard
          </SidebarNavLink>
          <SidebarNavLink to="/projects" icon={Folders}>
            Sprints
          </SidebarNavLink>
          <SidebarNavLink to="/tasks" icon={CheckSquare}>
            Backlog
          </SidebarNavLink>
          <SidebarNavLink to="/team" icon={Users}>
            Teams
          </SidebarNavLink>
        </div>
      </nav>
      <div className="border-t px-2 py-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expanded ? "rotate-180" : "rotate-0"
            )}
          />
         <span
  className={cn(
    "ml-2 transition-all duration-300 overflow-hidden",
    expanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
  )}
>
  Collapse
</span>

        </Button>
      </div>
    </aside>
  );
}

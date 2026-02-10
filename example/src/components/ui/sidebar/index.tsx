import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Bell,
  Settings,
  TrendingUp,
  ChevronsLeft,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/elements";
import { useSidebar } from "./use-sidebar";
import { SIDEBAR_NAV } from "@/routes/routeConfig";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/analytics": TrendingUp,
  "/transactions": ArrowLeftRight,
  "/users": Users,
  "/notifications": Bell,
  "/settings": Settings,
};

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 flex h-screen min-h-0 flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CreditCard className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground tracking-tight">Apex Finance</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        {(["overview", "manage"] as const).map((section) => (
          <div key={section}>
            {!collapsed && (
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section === "overview" ? "Overview" : "Manage"}
              </p>
            )}
            <div className="space-y-0.5">
              {SIDEBAR_NAV.filter((item) => item.section === section).map((item) => {
                const Icon = ICON_MAP[item.path];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end ?? false}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-2",
                      )
                    }
                  >
                    {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-semibold">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 shrink-0" fallback="JD" />
          {!collapsed && (
            <>
              <div className="flex flex-1 flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate">John Doe</span>
                <span className="text-xs text-muted-foreground truncate">john@apex.io</span>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={toggle}
                  aria-label="Toggle sidebar"
                >
                  <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

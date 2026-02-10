import { Outlet, useMatches } from "react-router-dom";

import { Sidebar, SidebarProvider, useSidebar } from "@/components/ui";
import { Header } from "@/components/ui/header";
import { cn } from "@/lib/utils";

interface RouteHandle {
  title?: string;
  description?: string;
}

function AdminLayoutInner() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;
  const title = handle?.title ?? "Admin";
  const description = handle?.description ?? "";
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-200",
          collapsed ? "ml-16" : "ml-64",
        )}
      >
        <Header title={title} description={description} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutInner />
    </SidebarProvider>
  );
}

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/elements";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SearchInput placeholder="Search..." className="w-64 h-9 bg-secondary/50 border-border/50" />
          </div>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground border-0">
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

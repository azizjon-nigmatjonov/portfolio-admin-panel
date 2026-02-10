import { createContext } from "react";

export interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

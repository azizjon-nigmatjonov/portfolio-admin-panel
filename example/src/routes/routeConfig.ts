/**
 * Central route path constants and sidebar navigation config.
 * Supports 1-layer (single item) and 2-layer (parent > child) sidebar items.
 */

export const ROUTES = {
  // Auth (AuthLayout)
  SIGN_IN: "/auth/sign-in",

  // Dashboard section (AdminLayout)
  DASHBOARD: "/dashboard",
  DASHBOARD_MAIN: "/dashboard",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",

  // Admin pages (AdminLayout)
  TRANSACTIONS: "/transactions",
  USERS: "/users",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
} as const;

export type NavSection = "overview" | "manage";

export interface NavItem {
  path: string;
  label: string;
  description: string;
  section: NavSection;
  end?: boolean;
  badge?: string;
}

/** Single source of truth for admin sidebar nav. Used by sidebar and route handles. */
export const SIDEBAR_NAV: NavItem[] = [
  { path: ROUTES.DASHBOARD_MAIN, label: "Dashboard", description: "Your financial overview at a glance.", section: "overview", end: true },
  { path: ROUTES.DASHBOARD_ANALYTICS, label: "Analytics", description: "Detailed financial metrics and performance insights.", section: "overview" },
  { path: ROUTES.TRANSACTIONS, label: "Transactions", description: "View and manage all financial transactions.", section: "overview", end: true },
  { path: ROUTES.USERS, label: "Users", description: "Manage team members and their permissions.", section: "manage", end: true },
  { path: ROUTES.NOTIFICATIONS, label: "Notifications", description: "Stay updated on important events and alerts.", section: "manage", badge: "3", end: true },
  { path: ROUTES.SETTINGS, label: "Settings", description: "Manage your account and preferences.", section: "manage", end: true },
];

export function getRouteHandle(path: string) {
  return SIDEBAR_NAV.find((item) => item.path === path);
}

/** Build route handle { title, description } from path for React Router. */
export function toRouteHandle(path: string) {
  const item = getRouteHandle(path);
  return item ? { title: item.label, description: item.description } : undefined;
}

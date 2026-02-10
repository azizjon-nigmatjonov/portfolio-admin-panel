import SettingsPage from "@/pages/settings";
import { ROUTES, toRouteHandle } from "../routeConfig";

export const SETTINGS_MAIN = [
  { path: ROUTES.SETTINGS, element: <SettingsPage />, handle: toRouteHandle(ROUTES.SETTINGS) },
];
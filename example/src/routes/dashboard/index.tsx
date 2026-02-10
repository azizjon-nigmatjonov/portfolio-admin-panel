import AnalyticsPage from "@/pages/dashboard/analytics";
import DashboardMainPage from "../../pages/dashboard/main";
import { ROUTES, toRouteHandle } from "../routeConfig";

export const DASHBOARD_MAIN = [
  { path: ROUTES.DASHBOARD_MAIN, element: <DashboardMainPage />, handle: toRouteHandle(ROUTES.DASHBOARD_MAIN) },
  { path: ROUTES.DASHBOARD_ANALYTICS, element: <AnalyticsPage />, handle: toRouteHandle(ROUTES.DASHBOARD_ANALYTICS) },
];
import NotificationsPage from "@/pages/notifications";
import { ROUTES, toRouteHandle } from "../routeConfig";

export const NOTIFICATIONS_MAIN = [
  { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage />, handle: toRouteHandle(ROUTES.NOTIFICATIONS) },
];
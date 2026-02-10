import UsersPage from "@/pages/users";
import { ROUTES, toRouteHandle } from "../routeConfig";

export const USERS_MAIN = [
  { path: ROUTES.USERS, element: <UsersPage />, handle: toRouteHandle(ROUTES.USERS) },
];
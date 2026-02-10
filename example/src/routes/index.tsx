import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/admin-layout";
import AuthLayout from "../components/layouts/auth-layout";
import { ROUTES } from "./routeConfig";

import { AUTH_LOGIN } from "./auth";
import { DASHBOARD_MAIN } from "./dashboard";
import { TRANSACTIONS_MAIN } from "./transactions";
import { USERS_MAIN } from "./users";
import { NOTIFICATIONS_MAIN } from "./notifications";
import { SETTINGS_MAIN } from "./settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      ...DASHBOARD_MAIN,
      ...TRANSACTIONS_MAIN,
      ...USERS_MAIN,
      ...NOTIFICATIONS_MAIN,
      ...SETTINGS_MAIN,
    ],
  },
  {
    path: ROUTES.SIGN_IN,
    element: <AuthLayout />,
    children: [...AUTH_LOGIN],
  },
  { path: "/login", element: <Navigate to={ROUTES.SIGN_IN} replace /> },
  { path: "/sign-in", element: <Navigate to={ROUTES.SIGN_IN} replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

import TransactionsPage from "@/pages/transactions";
import { ROUTES, toRouteHandle } from "../routeConfig";

export const TRANSACTIONS_MAIN = [
  { path: ROUTES.TRANSACTIONS, element: <TransactionsPage />, handle: toRouteHandle(ROUTES.TRANSACTIONS) },
];
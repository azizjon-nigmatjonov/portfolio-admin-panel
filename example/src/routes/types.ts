import type { RouteObject } from 'react-router-dom';

/**
 * App-specific route type. Use when you add route-level meta (e.g. breadcrumbs, guards).
 */
export type AppRouteObject = RouteObject & {
  children?: AppRouteObject[];
};

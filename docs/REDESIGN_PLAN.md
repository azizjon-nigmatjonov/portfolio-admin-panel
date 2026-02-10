# Admin Panel Redesign Plan (Example-Project Style)

## Goals
- Redesign admin panel in the style of the **example/** project.
- **Do not change content** (routes, pages, features, copy).
- **Change only styles** (tokens, layout, components look).
- Align **npm packages** (Tailwind 4, Storybook, Vitest) with example; no MUI/Redux (not used in either project).
- **Setup Storybook and testing** as in example (Storybook 10, Vitest unit + storybook projects, coverage).
- **Do not remove** any existing code; only add/update styles and tooling.

## 1. Package changes
- **Tailwind**: Upgrade to v4 (`tailwindcss@^4`, `@tailwindcss/postcss`); remove `tailwind.config.js`; configure via CSS `@theme` and variables.
- **PostCSS**: Use `@tailwindcss/postcss` only (example does not use `autoprefixer` in same way; Tailwind 4 bundles what’s needed).
- **Storybook**: Add Storybook 10 (`storybook`, `@storybook/react-vite`, `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-onboarding`, `@chromatic-com/storybook`).
- **Vitest**: Upgrade to v4; add `@vitest/coverage-v8`, `@vitest/browser-playwright`, `@storybook/addon-vitest`; add second project for Storybook tests.
- **Testing Library**: Align versions with example (`@testing-library/jest-dom/vitest` for setup).
- **Keep**: React 19, Zustand, Radix UI, React Router, Firebase, react-hook-form, zod, TanStack Query, etc. No MUI or Redux.

## 2. Styles (example-like design system)
- **index.css**: Replace with example-style setup:
  - `@import "tailwindcss"`.
  - `@custom-variant dark (&:where(.dark, .dark *))`.
  - `:root` and `.dark` CSS variables (e.g. primary `234 89% 60%`, background `220 20% 97%`, success, warning, etc.).
  - `@theme` block mapping variables to Tailwind 4 theme (e.g. `--color-background`, `--color-foreground`, `--radius-*`).
  - Base styles: `* { border-color }`, `body { background, color, font-smoothing }`.
- **Theme application**: Use existing app store `theme` (light/dark). Add a small effect or wrapper that applies `class="dark"` to `document.documentElement` when theme is `dark`, so existing theme toggle drives the new design tokens.
- **Components**: Replace raw grays and primary-600 with semantic tokens: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `bg-muted`, etc., matching example.

## 3. Layout and shared components (styles only)
- **DashboardLayout**: `min-h-screen bg-background`; main area with `border-border` if needed; spacing unchanged.
- **Sidebar**: Example-like: `border-r border-border bg-card`, nav items `bg-primary/10 text-primary` when active, `text-muted-foreground hover:bg-muted`; keep all links and behavior.
- **Header**: `border-b border-border`, `text-foreground`, `text-muted-foreground`; keep structure and actions.
- **ErrorFallback / LoadingScreen** (in providers): Use `bg-background`, `text-foreground`, semantic buttons/cards.
- **Shared UI** (button, input, dialog, etc.): Already Radix + CVA; only adjust class names to use new tokens (e.g. `bg-primary` instead of `primary-600` where applicable).

## 4. Storybook setup
- **.storybook/main.ts**: Stories from `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` and `*.mdx`; addons: vitest, a11y, docs, onboarding.
- **.storybook/preview.ts**: Import `../src/index.css`; controls/a11y parameters as in example.
- **.storybook/vitest.setup.ts**: `setProjectAnnotations` for Storybook + a11y.
- **vite.config.ts**: Add `storybookTest` plugin; define Vitest projects: `unit` (jsdom, src **/*.test.*) and `storybook` (playwright, storybook addon).
- **Scripts**: `storybook`, `build-storybook`, `test:storybook`, `test:coverage` (unit only).
- Add **2–3 example stories** (e.g. Button, Header or Sidebar) without removing any app code.

## 5. Testing alignment
- **src/test/setup.ts**: Use `@testing-library/jest-dom/vitest`; add `afterEach(cleanup)`; keep matchMedia/localStorage mocks.
- **vitest.config**: Two projects (unit, storybook); coverage with v8 for unit; include/exclude as in example.
- Optional: add one small unit test (e.g. for `useDebounce`) to mirror example quality.

## 6. Optional (theme store)
- Example uses a dedicated `useThemeStore` with `light | dark | system`. We can keep a single app store and only add `document.documentElement.classList.add/remove('dark')` from existing `theme`; or add a minimal theme store later without removing current store.

## Execution order
1. Package changes (package.json + install).
2. Tailwind 4 + new index.css (and remove tailwind.config.js if fully migrated).
3. Theme provider / .dark class from store.
4. Restyle layout and shared components.
5. Restyle providers and pages.
6. Storybook setup + first stories.
7. Vitest config and test setup alignment.

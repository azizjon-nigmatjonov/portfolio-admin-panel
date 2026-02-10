import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render as rtlRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import type { ReactElement } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

type WrapperProps = { children: React.ReactNode };

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    );
  };
}

export function render(
  ui: ReactElement,
  options: RenderOptions & { queryClient?: QueryClient } = {},
): RenderResult {
  const { queryClient = defaultQueryClient, ...renderOptions } = options;
  const Wrapper = createWrapper(queryClient);
  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
}

export * from "@testing-library/react";

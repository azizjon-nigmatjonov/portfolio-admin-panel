import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './configurations/i18next';
import './index.css';
import './components/ui/ui.css';
import App from './App.tsx';
import I18nQuerySync from './components/providers/i18next-query-sync.tsx';
import { ThemeProvider } from './components/providers/theme-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nQuerySync />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);

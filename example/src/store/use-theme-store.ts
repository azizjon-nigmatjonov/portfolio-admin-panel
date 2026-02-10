import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: "dark",
        setTheme: (theme) => set({ theme }),
      }),
      { name: "themeStore" },
    ),
  ),
);

export const setTheme = (theme: Theme) => {
  useThemeStore.getState().setTheme(theme);
};

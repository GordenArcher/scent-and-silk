import React, { createContext, useState, useEffect, ReactNode } from "react";
import { themes, themeLabels } from "./themes";
import { Theme, ThemeName } from "../types";
import { getTheme, saveTheme } from "../storage/storage";

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  themeLabels: Record<ThemeName, string>;
  allThemes: ThemeName[];
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: themes.noir,
  themeName: "noir",
  setTheme: () => {},
  themeLabels,
  allThemes: [],
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("noir");

  useEffect(() => {
    (async () => {
      const saved = await getTheme();
      if (saved && themes[saved]) {
        setThemeName(saved);
      }
    })();
  }, []);

  const setTheme = async (name: ThemeName) => {
    setThemeName(name);
    await saveTheme(name);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeName],
        themeName,
        setTheme,
        themeLabels,
        allThemes: Object.keys(themes) as ThemeName[],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

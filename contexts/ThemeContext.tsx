import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  isDarkMode: boolean;
  theme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  theme: "light",
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, theme: colorScheme || "light" }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

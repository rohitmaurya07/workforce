import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const FONT_OPTIONS = [
  { id: "Inter", name: "Inter", stack: "'Inter', sans-serif", desc: "Clean & Modern Workhorse" },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta", stack: "'Plus Jakarta Sans', sans-serif", desc: "Sleek Corporate Sans" },
  { id: "Poppins", name: "Poppins", stack: "'Poppins', sans-serif", desc: "Friendly Geometric Sans" },
  { id: "Outfit", name: "Outfit", stack: "'Outfit', sans-serif", desc: "Modern Display & Tech" },
  { id: "Space Grotesk", name: "Space Grotesk", stack: "'Space Grotesk', sans-serif", desc: "Edgy Tech Sans" },
  { id: "JetBrains Mono", name: "JetBrains Mono", stack: "'JetBrains Mono', monospace", desc: "Developer Monospace" },
];

const hexToRgb = (hex) => {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "dark";
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem("app_accent") || "#6366F1";
  });

  const [font, setFont] = useState(() => {
    return localStorage.getItem("app_font") || "Inter";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const { r, g, b } = hexToRgb(accent);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
    root.style.setProperty("--accent-light", `rgba(${r}, ${g}, ${b}, 0.12)`);
    root.style.setProperty("--accent-border", `rgba(${r}, ${g}, ${b}, 0.3)`);
    root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.25)`);
    localStorage.setItem("app_accent", accent);
  }, [accent]);

  useEffect(() => {
    const root = document.documentElement;
    const selectedFontObj = FONT_OPTIONS.find((f) => f.id === font) || FONT_OPTIONS[0];
    root.style.setProperty("--app-font", selectedFontObj.stack);
    document.body.style.fontFamily = selectedFontObj.stack;
    localStorage.setItem("app_font", font);
  }, [font]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, accent, setAccent, font, setFont, FONT_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "dark",
      setTheme: () => {},
      toggleTheme: () => {},
      accent: "#6366F1",
      setAccent: () => {},
      font: "Inter",
      setFont: () => {},
      FONT_OPTIONS,
    };
  }
  return context;
};

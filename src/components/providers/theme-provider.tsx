// src/components/providers/theme-provider.tsx
'use client';

import type { ReactNode} from 'react';
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light, useEffect will update

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    // Set initial theme based on localStorage or system preference
    // This effect runs only on the client after hydration
    const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    // This effect also runs only on the client
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Prevent rendering children until theme is determined to avoid flash of unstyled content or hydration mismatch
  // This is a common pattern but for next-themes, they use suppressHydrationWarning.
  // For a manual setup, ensuring this logic is client-side and state-driven is key.
  // The initial render on server will use default 'light', client will update.
  // If this causes issues, a `useEffect` with a `mounted` state can delay child rendering.
  // For now, keep it simple and rely on `suppressHydrationWarning` on <html>.

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

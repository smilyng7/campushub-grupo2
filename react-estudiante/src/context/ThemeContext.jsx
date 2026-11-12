import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema);
  }, [tema]);

  const toggleTema = useCallback(() => {
    setTema((actual) => (actual === 'light' ? 'dark' : 'light'));
  }, []);
  const value = useMemo(() => ({ tema, toggleTema }), [tema, toggleTema]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }

  return context;
}

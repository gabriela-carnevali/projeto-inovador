import { createContext, useContext, useState } from 'react';

const lightColors = {
  background: '#F6F0E2',
  surface: '#FFFDF7',
  input: '#FFFFFF',
  inputText: '#2D3748',
  text: '#2D3748',
  secondaryText: '#666666',
  mutedText: '#888888',
  border: '#CBD5E0',
  primary: '#3182CE',
};

const darkColors = {
  background: '#121826',
  surface: '#1F2937',
  input: '#FFFFFF',
  inputText: '#2D3748',
  text: '#F7FAFC',
  secondaryText: '#CBD5E0',
  mutedText: '#A0AEC0',
  border: '#4A5568',
  primary: '#63B3ED',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const colors = darkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        colors,
        toggleDarkMode: () => setDarkMode((modoAtual) => !modoAtual),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return theme;
}

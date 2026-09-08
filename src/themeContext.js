// Importa as funções essenciais do React para criar e consumir Contextos e gerenciar Estados
import { createContext, useContext, useState } from 'react';

// Paleta de cores para o Modo Claro (Light Theme)
const lightColors = {
  background: '#F6F0E2',   // Cor de fundo padrão das telas
  surface: '#FFFDF7',      // Cor de fundo para cartões e áreas elevadas
  input: '#FFFFFF',        // Cor de fundo dos campos de texto
  inputText: '#2D3748',    // Cor do texto digitado no campo
  text: '#2D3748',         // Cor principal dos textos
  secondaryText: '#666666',// Cor de textos secundários (ex: autor, legendas)
  mutedText: '#888888',    // Cor para textos discretos ou listas vazias
  border: '#CBD5E0',       // Cor das bordas das caixas e botões
  primary: '#3182CE',      // Cor de destaque (botões principais)
};

// Paleta de cores para o Modo Escuro (Dark Theme)
const darkColors = {
  background: '#121826',   // Fundo escuro
  surface: '#1F2937',      // Fundo dos cartões em tom escuro contrastante
  input: '#FFFFFF',        // Mantém fundo claro no input
  inputText: '#2D3748',    // Texto escuro dentro do input para boa leitura
  text: '#F7FAFC',         // Texto claro para destacar no fundo escuro
  secondaryText: '#CBD5E0',// Texto secundário claro
  mutedText: '#A0AEC0',    // Texto apagado para o modo escuro
  border: '#4A5568',       // Bordas mais sutis para fundo escuro
  primary: '#63B3ED',      // Azul mais brilhante para destacar no escuro
};

// Cria o Contexto do Tema que vai armazenar as cores e a função de alternar
const ThemeContext = createContext(null);

// Componente Provedor (Provider): ele envolve toda a aplicação no App.js para disponibilizar o tema para todos os componentes
export function ThemeProvider({ children }) {
  // Estado que guarda se o Modo Escuro está ativado ou não (false = Claro, true = Escuro)
  const [darkMode, setDarkMode] = useState(false);

  // Define dinamicamente qual objeto de cores utilizar baseando-se no estado `darkMode`
  const colors = darkMode ? darkColors : lightColors;

  return (
    // Transmite as informações de tema (estado, cores e função de alternar) para todos os componentes filhos ({children})
    <ThemeContext.Provider
      value={{
        darkMode,
        colors,
        toggleDarkMode: () => setDarkMode((modoAtual) => !modoAtual), // Inverte o tema (se estava claro fica escuro, e vice-versa)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para consumir o tema facilmente em qualquer tela/componente
export function useTheme() {
  const theme = useContext(ThemeContext);

  // Trava de segurança: avisa o desenvolvedor se ele tentar usar o `useTheme` sem colocar o `<ThemeProvider>` por volta do App
  if (!theme) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }

  return theme; // Retorna { darkMode, colors, toggleDarkMode }
}

// Importa o hook useEffect para executar ações assim que o app carrega
import { useEffect } from 'react';

// Importa componentes visuais básicos do React Native
import { StyleSheet, View, Text } from 'react-native';

// Importa os componentes de navegação principal (Contêiner e Navegação por Abas Inferiores)
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importa a função que inicializa/cria as tabelas do banco de dados SQLite
import { initDatabase } from './src/database/database';

// Importa as telas do aplicativo
import QuerendoLerScreen from './src/screens/QuerendoLer';
import LendoScreen from './src/screens/Lendo';
import LidoScreen from './src/screens/Lido';
import CadastroLivroScreen from './src/screens/CadastroLivro';

// Importa o Provedor de Tema e o Hook do contexto de cores
import { ThemeProvider, useTheme } from './src/themeContext';

// Cria o navegador de abas inferiores (Bottom Tab Navigator)
const Tab = createBottomTabNavigator();

// Componente principal/raiz do aplicativo
export default function App() {
  return (
    // Envolve toda a aplicação no ThemeProvider para disponibilizar o tema (claro/escuro) em qualquer tela
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Conteúdo principal do App (separado para poder consumir o hook `useTheme`)
function AppContent() {
  // Extrai o estado do modo escuro, as cores do tema e a função de alternar tema
  const { darkMode, colors, toggleDarkMode } = useTheme();

  // Executa apenas uma vez quando o aplicativo abre
  useEffect(() => {
    try {
      // Cria a estrutura de tabelas do banco de dados SQLite
      initDatabase();
    } catch (error) {
      console.error("Erro ao inicializar o banco de dados:", error);
    }
  }, []);

  return (
    // Contêiner pai responsável por gerenciar todo o fluxo de telas
    <NavigationContainer>
      {/* Configurações globais do menu inferior de abas */}
      <Tab.Navigator
        initialRouteName="Querendo" // Tela inicial ao abrir o app
        screenOptions={{
          tabBarActiveTintColor: colors.primary, // Cor da aba selecionada
          tabBarInactiveTintColor: darkMode ? '#E2E8F0' : '#4A5568', // Cor da aba inativa
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
          },
          tabBarStyle: {
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
            backgroundColor: colors.background, // Fundo da barra inferior
            borderTopColor: colors.border, // Linha de borda superior
          },
          headerStyle: {
            backgroundColor: '#3182CE', // Cor do cabeçalho superior
          },
          headerTintColor: '#FFFFFF', // Cor do texto do cabeçalho
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          sceneStyle: { backgroundColor: colors.background }, // Cor de fundo padrão de cada tela
        }}
      >
        {/* Aba 1: Querendo Ler */}
        <Tab.Screen 
          name="Querendo" 
          component={QuerendoLerScreen} 
          options={{
            title: 'Querendo Ler',
            // Adiciona o botão de mudar tema no canto direito do cabeçalho
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="🔖" color={color} />,
          }}
        />

        {/* Aba 2: Lendo */}
        <Tab.Screen 
          name="Lendo" 
          component={LendoScreen} 
          options={{
            title: 'Lendo',
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="📖" color={color} />,
          }}
        />

        {/* Aba 3: Lido */}
        <Tab.Screen 
          name="Lido" 
          component={LidoScreen} 
          options={{
            title: 'Lido',
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="✅" color={color} />,
          }}
        />

        {/* Aba 4: Novo Livro / Cadastro */}
        <Tab.Screen 
          name="Cadastrar" 
          component={CadastroLivroScreen} 
          options={{
            title: 'Novo Livro',
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="+" color={color} isPlus darkMode={darkMode} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Componente auxiliar para o botão de alternar tema no cabeçalho
function BotaoTema({ darkMode, onPress }) {
  return (
    <Text
      accessibilityRole="button"
      accessibilityLabel={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onPress={onPress}
      style={styles.botaoTema}
    >
      {/* Exibe o ícone de Sol se estiver escuro, ou Lua se estiver claro */}
      {darkMode ? '☀' : '☾'}
    </Text>
  );
}

// Componente auxiliar para renderizar os ícones de emoji na barra de navegação inferior
function IconeTab({ emoji, color, isPlus = false, darkMode = false }) {
  return (
    <View style={styles.iconeContainer}>
      <Text style={[styles.iconeTexto, isPlus && styles.iconePlus, { color: isPlus ? (darkMode ? '#FFFFFF' : '#2D3748') : color }]}>
        {emoji}
      </Text>
    </View>
  );
}

// Estilos dos componentes auxiliares (ícones e botões)
const styles = StyleSheet.create({
  iconeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: {
    fontSize: 20,
  },
  iconePlus: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  botaoTema: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 16,
  },
});

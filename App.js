import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importação da inicialização do banco de dados
import { initDatabase } from './src/database/database';

// Importação das Telas
import QuerendoLerScreen from './src/screens/QuerendoLer';
import LendoScreen from './src/screens/Lendo';
import LidoScreen from './src/screens/Lido';
import CadastroLivroScreen from './src/screens/CadastroLivro';
import { ThemeProvider, useTheme } from './src/themeContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { darkMode, colors, toggleDarkMode } = useTheme();

  // Inicializa o banco de dados ao carregar o aplicativo
  useEffect(() => {
    try {
      initDatabase();
    } catch (error) {
      console.error("Erro ao inicializar o banco de dados:", error);
    }
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Querendo"
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: darkMode ? '#E2E8F0' : '#4A5568',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
          },
          tabBarStyle: {
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: '#3182CE',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tab.Screen 
          name="Querendo" 
          component={QuerendoLerScreen} 
          options={{
            title: 'Querendo Ler',
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="🔖" color={color} />,
          }}
        />

        <Tab.Screen 
          name="Lendo" 
          component={LendoScreen} 
          options={{
            title: 'Lendo',
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="📖" color={color} />,
          }}
        />

        <Tab.Screen 
          name="Lido" 
          component={LidoScreen} 
          options={{
            title: 'Lido',
            headerRight: () => <BotaoTema darkMode={darkMode} onPress={toggleDarkMode} />,
            tabBarIcon: ({ color }) => <IconeTab emoji="✅" color={color} />,
          }}
        />

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

function BotaoTema({ darkMode, onPress }) {
  return (
    <Text
      accessibilityRole="button"
      accessibilityLabel={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onPress={onPress}
      style={styles.botaoTema}
    >
      {darkMode ? '☀' : '☾'}
    </Text>
  );
}

// Componente simples para renderizar os ícones da barra inferior
function IconeTab({ emoji, color, isPlus = false, darkMode = false }) {
  return (
    <View style={styles.iconeContainer}>
      <Text style={[styles.iconeTexto, isPlus && styles.iconePlus, { color: isPlus ? (darkMode ? '#FFFFFF' : '#2D3748') : color }]}>{emoji}</Text>
    </View>
  );
}

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
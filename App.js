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

const Tab = createBottomTabNavigator();

export default function App() {
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
          tabBarActiveTintColor: '#3182CE',
          tabBarInactiveTintColor: '#718096',
          tabBarStyle: {
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#3182CE',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen 
          name="Querendo" 
          component={QuerendoLerScreen} 
          options={{
            title: 'Querendo Ler',
            tabBarIcon: ({ color }) => <IconeTab emoji="🔖" color={color} />,
          }}
        />

        <Tab.Screen 
          name="Lendo" 
          component={LendoScreen} 
          options={{
            title: 'Lendo',
            tabBarIcon: ({ color }) => <IconeTab emoji="📖" color={color} />,
          }}
        />

        <Tab.Screen 
          name="Lido" 
          component={LidoScreen} 
          options={{
            title: 'Lido',
            tabBarIcon: ({ color }) => <IconeTab emoji="✅" color={color} />,
          }}
        />

        <Tab.Screen 
          name="Cadastrar" 
          component={CadastroLivroScreen} 
          options={{
            title: 'Novo Livro',
            tabBarIcon: ({ color }) => <IconeTab emoji="➕" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Componente simples para renderizar os ícones da barra inferior
function IconeTab({ emoji }) {
  return (
    <View style={styles.iconeContainer}>
      <Text style={styles.iconeTexto}>{emoji}</Text>
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
});